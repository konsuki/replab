# === api.py ===
# コメント取得用API
from fastapi import (
    FastAPI,
    HTTPException,
    Query,
    Depends,
    Header,
    status,
)  # ★ Depends, Header, status を追加
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import os
import json
import google.generativeai as genai
from jose import jwt, JWTError  # ★ JWTデコード用に追加

# Stripeライブラリ
import stripe
from dotenv import load_dotenv

# ★ Firebase関連の追加
import firebase_admin
from firebase_admin import credentials, firestore

# サービスロジックをインポート
import youtube_service

# 認証ロジックをインポート
import auth

# .envファイルから環境変数を読み込む
load_dotenv()

# --- Gemini API Setup ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY is not set in .env file.")

genai.configure(api_key=GEMINI_API_KEY)

# --- Stripe Setup ---
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID")
FRONTEND_URL = os.getenv("FRONTEND_URL")

if not STRIPE_SECRET_KEY:
    print("Warning: STRIPE_SECRET_KEY is not set in .env file.")
else:
    stripe.api_key = STRIPE_SECRET_KEY

# --- ★ Firebase (Firestore) Setup ---
# アプリがまだ初期化されていない場合のみ初期化する（二重初期化防止）
if not firebase_admin._apps:
    try:
        # Step 1で配置したJSONファイルを読み込む
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
        print("Firebase Admin Initialized successfully.")
    except Exception as e:
        print(f"Firebase Init Error: {e}")
        # ローカルでJSONがない場合などはここで落ちないように注意（本番では必須）

# DBクライアントの取得
db = firestore.client()


# --- FastAPI App Setup ---
app = FastAPI()

# Auth設定の読み込み (auth.pyと同じ値を使う必要があります)
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key_should_be_random")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

app.add_middleware(
    SessionMiddleware, secret_key=SECRET_KEY, max_age=3600, https_only=False
)

# CORS Setup
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://konsuki.github.io",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)


# --- Application Constants ---
VIDEO_ID = "fmFn2otWosE"
GOAL_MAX_RESULTS = 1000


# --- Pydantic Models ---
class SearchRequest(BaseModel):
    keyword: str
    comments: List[Any]


# --- ★ 認証依存関数 (Dependency) ---
# APIリクエストのHeaderにある 'Authorization: Bearer <token>' を読み取り、ユーザーIDを返す
async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        # トークンがない場合
        # 厳密な制限のため、ログインしていないユーザーはアクセス不可にする
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="認証トークンが見つかりません。ログインしてください。",
        )

    try:
        # "Bearer <token>" 形式から token 部分を取り出す
        token = authorization.split(" ")[1]
        # トークンをデコード（改ざんチェック）
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # auth.pyで作ったトークンには 'sub' (Google User ID) が入っているはず
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=401, detail="トークンが無効です(User ID不明)。"
            )

        return user_id

    except (JWTError, IndexError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="認証情報の検証に失敗しました。",
        )


# --- Main API Endpoints ---


@app.get("/api/comments")
async def get_video_comments_api(
    video_id: str = Query(VIDEO_ID, description="YouTube Video ID"),
    goal_max_results: int = GOAL_MAX_RESULTS,
    # ★ ここ重要: user_idを受け取ることで、このAPIを実行する前に上記 get_current_user が走る
    user_id: str = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    YouTube動画のコメントを取得します。
    ★ Firestoreを使用して呼び出し回数を制限します。
    """

    print(f"Request from User ID: {user_id}")

    # --- ★ Firestore: 回数制限ロジック ---

    # 1. ユーザーのドキュメント参照を取得
    user_ref = db.collection("users").document(user_id)

    try:
        user_doc = user_ref.get()

        current_count = 0
        is_pro = False

        # ドキュメントが存在する場合は現在の値を取得
        if user_doc.exists:
            user_data = user_doc.to_dict()
            current_count = user_data.get("usage_count", 0)
            is_pro = user_data.get("is_pro", False)  # 将来的に課金連携したらTrueにする

        print(f"User stats - Count: {current_count}, Pro: {is_pro}")

        # 2. 制限チェック (4回以上 かつ Proではない場合)
        # フロントエンド側でこの 402 エラーを検知してモーダルを出す
        if current_count >= 4 and not is_pro:
            raise HTTPException(
                status_code=402,  # Payment Required
                detail="無料版の利用回数制限に達しました。",
            )

        # 3. カウントアップ処理
        if not user_doc.exists:
            # 初回アクセスの場合はドキュメント作成
            user_ref.set(
                {
                    "usage_count": 1,
                    "is_pro": False,
                    "email": "unknown",  # 必要ならJWTから取得して保存可能
                    "created_at": firestore.SERVER_TIMESTAMP,
                }
            )
        else:
            # 既存ユーザーの場合はカウントを+1 (Atomic Increment)
            user_ref.update(
                {
                    "usage_count": firestore.Increment(1),
                    "last_updated": firestore.SERVER_TIMESTAMP,
                }
            )

    except HTTPException as he:
        # 制限エラーはそのまま上に投げる
        raise he
    except Exception as e:
        print(f"Firestore Error: {e}")
        # DBエラーでユーザーを止めるべきか、通すべきかはポリシーによる
        # ここではエラーとして返す
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

    # --- 既存のYouTube取得ロジック ---
    return youtube_service.fetch_comments_with_pagination(video_id, goal_max_results)


@app.get("/api/hello")
async def read_hello_compatibility() -> Dict[str, Any]:
    return youtube_service.fetch_comments_with_pagination(VIDEO_ID, GOAL_MAX_RESULTS)


@app.post("/api/search-comments")
async def search_comments_with_gemini(request: SearchRequest) -> Dict[str, Any]:
    # (既存のコードのまま)
    if not GEMINI_API_KEY:
        print("Error: API Key missing")
        raise HTTPException(
            status_code=500, detail="Server API Key configuration error."
        )

    keyword = request.keyword
    comments = request.comments

    if not keyword or not comments:
        print("Error: Keyword or comments missing")
        raise HTTPException(
            status_code=400, detail="Keyword and comments are required."
        )

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        comments_to_analyze = comments[:500]
        comments_string = json.dumps(comments_to_analyze, ensure_ascii=False, indent=2)

        prompt = f"""
        以下の【コメント配列】の中から;、textプロパティの値に"{keyword}"に似た言葉を含むオブジェクトのみを抽出してください。
        【制約事項】
        1. 結果は抽出されたオブジェクトの配列を含むJSON文字列として、他の説明文やマークダウン( ```json 等)を付けずに**そのまま出力**してください。
        2. 抽出対象は、必ずtextプロパティにキーワードが含まれているものに限定してください。
        【コメント配列】
        {comments_string}
        """

        response = await model.generate_content_async(prompt)
        result_text = response.text
        cleaned_text = result_text.replace("```json", "").replace("```", "").strip()

        return {"success": True, "data": cleaned_text}

    except Exception as e:
        print(f"Gemini API Error Detail: {e}")
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")


@app.post("/api/create-checkout-session")
async def create_checkout_session():
    # (既存のコードのまま)
    if not STRIPE_SECRET_KEY or not STRIPE_PRICE_ID:
        raise HTTPException(status_code=500, detail="Stripe configuration error.")

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{"price": STRIPE_PRICE_ID, "quantity": 1}],
            mode="payment",
            success_url=f"{FRONTEND_URL}/success",
            cancel_url=f"{FRONTEND_URL}/",
        )
        return {"url": checkout_session.url}

    except Exception as e:
        print(f"Stripe Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
