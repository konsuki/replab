# backend/auth.py
import os
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from jose import jwt
from dotenv import load_dotenv

# ★ Firebase関連のインポートを追加
import firebase_admin
from firebase_admin import credentials, firestore

load_dotenv()

# 環境変数の読み込み
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL", "http://localhost:8000")

# JWTの有効期限（これが「セッション継続時間」になります）
# ここでは30日間に設定
ACCESS_TOKEN_EXPIRE_DAYS = 30

# --- ★ Firebase (Firestore) Setup ---
# api.py と同様に初期化を行いますが、二重初期化を防ぐチェックを入れます
if not firebase_admin._apps:
    try:
        # serviceAccountKey.json が backend ディレクトリにある前提
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
        print("Firebase Admin Initialized in auth.py")
    except Exception as e:
        print(f"Firebase Init Error in auth.py: {e}")

# DBクライアントの取得
db = firestore.client()

router = APIRouter(prefix="/auth", tags=["auth"])

# OAuth設定
oauth = OAuth()
oauth.register(
    name="google",
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """JWTトークンを作成する関数"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    # 'exp' クレームが有効期限を表します
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@router.get("/login")
async def login(request: Request):
    """
    1. フロントエンドから呼ばれる
    2. Googleの認証画面へリダイレクトURLを生成して飛ばす
    """
    redirect_uri = f"{BACKEND_BASE_URL}/auth/callback"
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/callback")
async def auth_callback(request: Request):
    """
    3. Google認証完了後、Googleからここにリダイレクトされる
    4. ユーザー情報を取得し、DBに保存し、JWTを発行してフロントエンドに戻す
    """
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get("userinfo")

        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to get user info")

        # GoogleユーザーID
        google_sub = user_info["sub"]
        
        # --- ★ ここでDBへのユーザー登録/更新処理を行う ---
        try:
            user_ref = db.collection("users").document(google_sub)
            
            # set(..., merge=True) を使うことで、
            # - ユーザーがいなければ作成
            # - 既にいれば指定したフィールドだけ更新（既存の is_pro や usage_count は消えない）
            user_ref.set({
                "email": user_info.get("email"),
                "name": user_info.get("name"),
                "picture": user_info.get("picture"),
                "last_login": firestore.SERVER_TIMESTAMP,
                # 初回作成時のみデフォルト値を入れたい場合は、doc.exists チェックが必要ですが、
                # ここでは merge=True なので、is_proなどは既存の値が維持されます。
                # もし初回のみ設定したい値がある場合は別途ロジックが必要ですが、
                # 基本的なプロフィール同期はこれでOKです。
            }, merge=True)
            
            print(f"User synced to Firestore: {google_sub}")

        except Exception as db_e:
            print(f"Database Save Error: {db_e}")
            # DB保存に失敗してもログイン自体は止めない（ログだけ出す）方針
            # 厳密にするならここでエラーにしても良い

        # --- JWTの生成 ---
        access_token_expires = timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
        access_token = create_access_token(
            data={
                "sub": google_sub, # GoogleのユーザーID
                "email": user_info["email"],
                "name": user_info["name"],
                "picture": user_info["picture"],
            },
            expires_delta=access_token_expires,
        )

        # 5. トークンを持ってフロントエンドの成功ページへリダイレクト
        response_url = f"{FRONTEND_URL}/auth/success?token={access_token}"
        return RedirectResponse(url=response_url)

    except Exception as e:
        print(f"Auth Error: {e}")
        return RedirectResponse(url=f"{FRONTEND_URL}/?error=auth_failed")