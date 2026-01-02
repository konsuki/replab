import httpx  # requests の代わりに httpx を使用
import os
from typing import Dict, Any, Optional

URL = "https://www.googleapis.com/youtube/v3/"
API_KEY = "YOUR_API_KEY"  # ★環境変数から取得することを推奨
API_MAX_RESULTS = 100

# format_comment_data 関数は変更なしのため省略


async def fetch_comments_page(
    video_id: str, page_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    指定されたページのコメント（最大100件）のみを非同期で取得して返します。
    """
    params = {
        "key": API_KEY,
        "part": "replies, snippet",
        "videoId": video_id,
        "order": "time",
        "textFormat": "plaintext",
        "maxResults": API_MAX_RESULTS,
    }
    if page_token:
        params["pageToken"] = page_token

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(URL + "commentThreads", params=params)
            response.raise_for_status()
            resource = response.json()

        comments_data = []
        for item in resource.get("items", []):
            # コメント整形処理（既存ロジックと同じ）
            snippet = item["snippet"]
            comment = format_comment_data(snippet, is_reply=False)

            # 返信の処理
            replies = []
            if "replies" in item and "comments" in item["replies"]:
                for reply_info in item["replies"]["comments"]:
                    replies.append(format_comment_data(reply_info, is_reply=True))
            comment["replies"] = replies
            comments_data.append(comment)

        return {
            "status": "success",
            "video_id": video_id,
            "next_page_token": resource.get(
                "nextPageToken"
            ),  # 次のページがある場合トークンを返す
            "total_results": resource.get("pageInfo", {}).get("totalResults"),
            "comments": comments_data,
        }

    except httpx.HTTPStatusError as e:
        return {"status": "error", "message": "YouTube API Error", "detail": str(e)}
    except Exception as e:
        return {"status": "error", "message": "Server Error", "detail": str(e)}


# 互換性のための同期ラッパー（必要であれば）
def fetch_comments_with_pagination(video_id, goal_max_results):
    # 既存のロジックが必要な箇所があれば残すが、基本は上記async関数に移行推奨
    pass
