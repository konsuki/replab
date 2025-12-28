# backend/auth.py
import os
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from jose import jwt
from dotenv import load_dotenv

# ★ Firebase関連
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

# JWTの有効期限（セッション継続時間）
ACCESS_TOKEN_EXPIRE_DAYS = 30

# --- Firebase (Firestore) Setup ---
# api.py と同様に二重初期化を防ぐ
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
    4. ユーザー情報を取得し、初期化済みの完全なデータとしてDBに保存
    5. JWTを発行してフロントエンドに戻す
    """
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get("userinfo")

        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to get user info")

        # GoogleユーザーID
        google_sub = user_info["sub"]
        
        # --- DBへの登録処理 (修正済み) ---
        try:
            user_ref = db.collection("users").document(google_sub)
            doc = user_ref.get()
            
            # 常に更新したい基本プロフィール情報
            base_data = {
                "email": user_info.get("email"),
                "name": user_info.get("name"),
                "picture": user_info.get("picture"),
                "last_login": firestore.SERVER_TIMESTAMP,
            }

            if not doc.exists:
                # 【新規ユーザーの場合】
                # is_pro や usage_count など、アプリ動作に必要な初期値を含めて作成する
                print(f"Creating NEW user: {google_sub}")
                
                new_user_data = base_data.copy()
                new_user_data.update({
                    "is_pro": False,          # ★ 最初は無料会員
                    "usage_count": 0,         # ★ 使用回数0
                    "created_at": firestore.SERVER_TIMESTAMP,
                    "updated_at": firestore.SERVER_TIMESTAMP,
                    "stripe_customer_id": None
                })
                
                user_ref.set(new_user_data)
            else:
                # 【既存ユーザーの場合】
                # is_pro などの重要なフラグは上書きせず、プロフィールとログイン日時だけ更新する
                print(f"Updating EXISTING user: {google_sub}")
                user_ref.set(base_data, merge=True)

        except Exception as db_e:
            print(f"Database Save Error: {db_e}")
            # エラー時もログイン自体は許可する方針（ログだけ出力）

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
        # エラー時はフロントエンドのトップなどに戻す
        return RedirectResponse(url=f"{FRONTEND_URL}/?error=auth_failed")