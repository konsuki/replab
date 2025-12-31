# === api.py ===
from fastapi import (
    FastAPI,
    HTTPException,
    Query,
    Depends,
    Header,
    status,
    Request,
    BackgroundTasks,  # ★ 追加: バックグラウンド処理用
)
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import os
import json
import google.generativeai as genai
from jose import jwt, JWTError
from google.cloud.firestore_v1.base_query import FieldFilter

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
else:
    genai.configure(api_key=GEMINI_API_KEY)

# --- Stripe Setup ---
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID")
FRONTEND_URL = os.getenv("FRONTEND_URL")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

if not STRIPE_SECRET_KEY:
    print("Warning: STRIPE_SECRET_KEY is not set in .env file.")
else:
    stripe.api_key = STRIPE_SECRET_KEY

# --- ★ Firebase (Firestore) Setup ---
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
        print("Firebase Admin Initialized successfully.")
    except Exception as e:
        print(f"Firebase Init Error: {e}")

# DBクライアントの取得
db = firestore.client()

# --- FastAPI App Setup ---
app = FastAPI()

# Auth設定の読み込み
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
    # 必要に応じてデプロイ先のURLを追加
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
# GOAL_MAX_RESULTS はページネーション導入により、必須ではなくなりましたが互換性のために残すか、削除してもOK

# --- Pydantic Models ---
class SearchRequest(BaseModel):
    keyword: str
    comments: List[Any]

# --- ★ 認証依存関数 (Dependency) ---
async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="認証トークンが見つかりません。ログインしてください。",
        )
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
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

# --- ★ Helper: バックグラウンドで実行するDB更新処理 ---
def increment_usage_count_task(user_id: str):
    """
    レスポンスを返した後にバックグラウンドで実行される関数。
    ユーザーの利用回数を+1する。
    """
    try:
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            # 初回アクセスの場合はドキュメント作成
            user_ref.set(
                {
                    "usage_count": 1,
                    "is_pro": False,
                    "email": "unknown", 
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
        print(f"Background Task: Incremented usage for {user_id}")
    except Exception as e:
        print(f"Background Task Error: {e}")

# --- Main API Endpoints ---

@app.get("/api/comments")
async def get_video_comments_api(
    background_tasks: BackgroundTasks, # ★ 追加
    video_id: str = Query(VIDEO_ID, description="YouTube Video ID"),
    page_token: Optional[str] = Query(None, description="Next Page Token for pagination"), # ★ 追加
    user_id: str = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    YouTube動画のコメントを取得します。
    ★ ページネーション対応により高速化
    ★ Firestoreの更新はバックグラウンドで行いレイテンシを削減
    """
    print(f"Request from User ID: {user_id}, Video ID: {video_id}, Page Token: {page_token}")

    # --- ★ Firestore: 制限チェック (Readのみ・同期実行) ---
    # 制限チェックはレスポンスを返す前にやる必要があるため、ここは await せずに実行（Firestore SDKは基本同期）
    # ※ FirestoreのReadは高速なのでここは許容
    try:
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()
        
        current_count = 0
        is_pro = False

        if user_doc.exists:
            user_data = user_doc.to_dict()
            current_count = user_data.get("usage_count", 0)
            is_pro = user_data.get("is_pro", False)
        
        print(f"User stats - Count: {current_count}, Pro: {is_pro}")

        # 制限チェック (4回以上 かつ Proではない場合)
        if current_count >= 4 and not is_pro:
            raise HTTPException(
                status_code=402, # Payment Required
                detail="無料版の利用回数制限に達しました。",
            )
            
        # ★ カウントアップ処理をバックグラウンドタスクに追加 (ここでは実行待ちしない)
        background_tasks.add_task(increment_usage_count_task, user_id)

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Firestore Check Error: {e}")
        # DB読込エラー時は、ユーザー体験優先で通すか、エラーにするか。ここでは安全側に倒してエラー
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

    # --- ★ YouTube取得ロジック (非同期・単一ページ取得) ---
    # youtube_service.py に新しく実装した(はずの) async 関数を呼び出す
    return await youtube_service.fetch_comments_page(video_id, page_token)


@app.get("/api/hello")
async def read_hello_compatibility() -> Dict[str, Any]:
    # 互換性のため残すが、もし同期関数が削除されている場合は注意
    return {"message": "Hello World. Please use /api/comments for features."}


@app.post("/api/search-comments")
async def search_comments_with_gemini(request: SearchRequest) -> Dict[str, Any]:
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
        # Gemini API呼び出し (非同期)
        model = genai.GenerativeModel("gemini-2.5-flash") # または gemini-1.5-flash
        
        # 解析対象の絞り込み
        comments_to_analyze = comments[:500]
        comments_string = json.dumps(comments_to_analyze, ensure_ascii=False, indent=2)

        prompt = f"""
        以下の【コメント配列】の中から、textプロパティの値に"{keyword}"に似た言葉を含むオブジェクトのみを抽出してください。
        【制約事項】
        1. 結果は抽出されたオブジェクトの配列を含むJSON文字列として、他の説明文やマークダウン( ```json 等)を付けずにそのまま出力してください。
        2. 抽出対象は、必ずtextプロパティにキーワードが含まれているものに限定してください。
        【コメント配列】
        {comments_string}
        """

        response = await model.generate_content_async(prompt)
        result_text = response.text
        
        # クリーニング
        cleaned_text = result_text.replace("```json", "").replace("```", "").strip()
        
        return {"success": True, "data": cleaned_text}

    except Exception as e:
        print(f"Gemini API Error Detail: {e}")
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")


@app.post("/api/create-checkout-session")
async def create_checkout_session(
    user_id: str = Depends(get_current_user),
):
    if not STRIPE_SECRET_KEY or not STRIPE_PRICE_ID:
        raise HTTPException(status_code=500, detail="Stripe configuration error.")

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{"price": STRIPE_PRICE_ID, "quantity": 1}],
            mode="subscription",
            subscription_data={
                "trial_period_days": 30,
            },
            success_url=f"{FRONTEND_URL}/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/",
            metadata={"user_id": user_id},
        )
        return {"url": checkout_session.url}
    except Exception as e:
        print(f"Stripe Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    payload = await request.body()

    if not STRIPE_WEBHOOK_SECRET:
        print("Error: STRIPE_WEBHOOK_SECRET is not set.")
        raise HTTPException(
            status_code=500, detail="Webhook Secret configuration error"
        )

    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        print("Error: Invalid payload")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        print("Error: Invalid signature")
        raise HTTPException(status_code=400, detail="Invalid signature")

    event_type = event["type"]
    data_object = event["data"]["object"]

    print(f"Received Webhook Event: {event_type}")

    # Case A: 決済完了 / トライアル開始
    if event_type == "checkout.session.completed":
        user_id = data_object.get("metadata", {}).get("user_id")
        stripe_customer_id = data_object.get("customer")

        if user_id:
            print(f"✅ Subscription started for User: {user_id}")
            try:
                user_ref = db.collection("users").document(user_id)
                user_ref.set(
                    {
                        "is_pro": True,
                        "stripe_customer_id": stripe_customer_id,
                        "updated_at": firestore.SERVER_TIMESTAMP,
                    },
                    merge=True,
                )
            except Exception as e:
                print(f"❌ DB Update Error (Checkout): {e}")
                return JSONResponse(status_code=500, content={"error": str(e)})
        else:
            print("⚠️ User ID not found in session metadata.")

    # Case B: サブスクリプション解約 / 期限切れ
    elif event_type == "customer.subscription.deleted":
        stripe_customer_id = data_object.get("customer")
        print(f"🚫 Subscription deleted for Customer: {stripe_customer_id}")

        if stripe_customer_id:
            try:
                users_ref = db.collection("users")
                query = users_ref.where(
                    filter=FieldFilter("stripe_customer_id", "==", stripe_customer_id)
                )
                results = query.stream()
                
                found_user = False
                for user_doc in results:
                    found_user = True
                    print(f"Found user to downgrade: {user_doc.id}")
                    user_doc.reference.update(
                        {"is_pro": False, "updated_at": firestore.SERVER_TIMESTAMP}
                    )
                
                if not found_user:
                    print(f"⚠️ No user found with Stripe Customer ID: {stripe_customer_id}")

            except Exception as e:
                print(f"❌ DB Update Error (Deletion): {e}")

    elif event_type == "invoice.payment_failed":
        print(f"⚠️ Payment failed for Customer: {data_object.get('customer')}")

    return {"status": "success"}


@app.get("/api/user/status")
async def get_user_status(user_id: str = Depends(get_current_user)):
    """
    現在のユーザーがProプランかどうかを返すAPI
    """
    user_ref = db.collection("users").document(user_id)
    doc = user_ref.get()
    is_pro = False
    if doc.exists:
        is_pro = doc.to_dict().get("is_pro", False)
    return {"is_pro": is_pro}