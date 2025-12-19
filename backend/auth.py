# backend/auth.py
import os
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from jose import jwt
from dotenv import load_dotenv

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
    4. ユーザー情報を取得し、JWTを発行してフロントエンドに戻す
    """
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get("userinfo")

        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to get user info")

        # ここでDBへのユーザー登録/更新処理を行うのが一般的です
        # 今回は簡易化のため、JWTに直接ユーザー情報を埋め込みます

        # --- JWTの生成 ---
        access_token_expires = timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
        access_token = create_access_token(
            data={
                "sub": user_info["sub"],  # GoogleのユーザーID
                "email": user_info["email"],
                "name": user_info["name"],
                "picture": user_info["picture"],
            },
            expires_delta=access_token_expires,
        )

        # 5. トークンを持ってフロントエンドの成功ページへリダイレクト
        # URLフラグメントやクエリパラメータでトークンを渡す
        response_url = f"{FRONTEND_URL}/auth/success?token={access_token}"
        return RedirectResponse(url=response_url)

    except Exception as e:
        print(f"Auth Error: {e}")
        # エラー時はフロントエンドのトップなどに戻す
        return RedirectResponse(url=f"{FRONTEND_URL}/?error=auth_failed")
