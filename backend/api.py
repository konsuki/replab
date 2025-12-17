# コメント取得用API
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse  # 追加: エラーレスポンス用
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import os
import json
import google.generativeai as genai

# 追加: Stripeライブラリ
import stripe
from dotenv import load_dotenv

# サービスロジックをインポート
import youtube_service

# .envファイルから環境変数を読み込む
load_dotenv()

# --- Gemini API Setup ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY is not set in .env file.")

genai.configure(api_key=GEMINI_API_KEY)

# --- Stripe Setup (追加) ---
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID")
# フロントエンドのURL (デフォルトはローカル環境)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000/my-gh-pages-test")

if not STRIPE_SECRET_KEY:
    print("Warning: STRIPE_SECRET_KEY is not set in .env file.")
else:
    stripe.api_key = STRIPE_SECRET_KEY

# --- FastAPI App Setup ---
app = FastAPI()

# CORS Setup
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://konsuki.github.io",
    # 必要なドメインがあれば追加
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Application Constants ---
VIDEO_ID = "fmFn2otWosE"
GOAL_MAX_RESULTS = 1000


# --- Pydantic Models ---
class SearchRequest(BaseModel):
    keyword: str
    comments: List[Any]


# --- Main API Endpoint ---


@app.get("/api/comments")
async def get_video_comments_api(
    video_id: str = Query(VIDEO_ID, description="YouTube Video ID"),
    goal_max_results: int = GOAL_MAX_RESULTS,
) -> Dict[str, Any]:
    """
    YouTube動画のコメントを、nextPageTokenを利用して目標件数まで取得し、JSONで返します。
    """
    return youtube_service.fetch_comments_with_pagination(video_id, goal_max_results)


@app.get("/api/hello")
async def read_hello_compatibility() -> Dict[str, Any]:
    """/api/hello は /api/comments の結果を返します（互換性のため維持）。"""
    return youtube_service.fetch_comments_with_pagination(VIDEO_ID, GOAL_MAX_RESULTS)


@app.post("/api/search-comments")
async def search_comments_with_gemini(request: SearchRequest) -> Dict[str, Any]:
    """
    Gemini APIを非同期(await)で呼び出し、検索結果を返します。
    """
    # 1. APIキーの確認
    if not GEMINI_API_KEY:
        print("Error: API Key missing")
        raise HTTPException(
            status_code=500, detail="Server API Key configuration error."
        )

    keyword = request.keyword
    comments = request.comments

    # 2. 入力値の確認
    if not keyword or not comments:
        print("Error: Keyword or comments missing")
        raise HTTPException(
            status_code=400, detail="Keyword and comments are required."
        )

    print(f"Processing search request: '{keyword}' with {len(comments)} comments.")

    try:
        # 3. モデルの準備
        model = genai.GenerativeModel("gemini-2.5-flash")

        # 4. データのスライス（トークン制限対策）
        # 必要に応じて調整してください
        comments_to_analyze = comments[:500]
        comments_string = json.dumps(comments_to_analyze, ensure_ascii=False, indent=2)

        # 5. プロンプト作成
        prompt = f"""
        以下の【コメント配列】の中から、textプロパティの値に"{keyword}"が含まれるオブジェクトのみを抽出してください。
        
        【制約事項】
        1. 結果は抽出されたオブジェクトの配列を含むJSON文字列として、他の説明文やマークダウン( ```json 等)を付けずに**そのまま出力**してください。
        2. 抽出対象は、必ずtextプロパティにキーワードが含まれているものに限定してください。

        【コメント配列】
        {comments_string}
        """

        # 6. 非同期メソッドを使用し、awaitする
        response = await model.generate_content_async(prompt)

        # 7. 結果の取得とクリーニング
        result_text = response.text
        cleaned_text = result_text.replace("```json", "").replace("```", "").strip()

        print("Gemini response received successfully.")
        return {"success": True, "data": cleaned_text}

    except Exception as e:
        print(f"Gemini API Error Detail: {e}")
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")


# --- Stripe Checkout Endpoint (追加) ---


@app.post("/api/create-checkout-session")
async def create_checkout_session():
    """
    Stripeの決済セッションを作成し、決済ページのURLを返します。
    """
    # 必須変数のチェック
    if not STRIPE_SECRET_KEY or not STRIPE_PRICE_ID:
        raise HTTPException(
            status_code=500,
            detail="Stripe configuration error (Key or Price ID missing).",
        )

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price": STRIPE_PRICE_ID,
                    "quantity": 1,
                },
            ],
            mode="payment",  # 買い切り型
            # 決済成功時のリダイレクト先 (Next.jsのページ)
            success_url=f"{FRONTEND_URL}/success",
            # キャンセル時のリダイレクト先
            cancel_url=f"{FRONTEND_URL}/",
        )
        return {"url": checkout_session.url}

    except Exception as e:
        print(f"Stripe Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
