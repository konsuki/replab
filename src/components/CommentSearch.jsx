// src/components/CommentSearch.jsx
'use client';
import React, { useState } from 'react';

/** 
 * コメント検索コンポーネント。
 * 1. ローカル検索 (即時)
 * 2. AI検索 (バックグラウンド)
 * の2段階で結果を表示するハイブリッド検索を実装。
 */
export const CommentSearch = ({ comments, onSearchResult }) => {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // AI検索中のフラグ
  const [error, setError] = useState(null);

  // バックエンドのAPI URL
  // 本番環境(Google Cloud Run等)のURLを指定
  // const BACKEND_API_URL = "https://backend-904463184290.asia-northeast1.run.app/api/search-comments";
  const BACKEND_API_URL = "http://localhost:8000/api/search-comments"; // ローカル開発用

  const handleSearch = async () => {
    // 入力チェック
    if (!keyword.trim() || !comments || comments.length === 0) {
      alert('キーワードを入力するか、先にYouTubeコメントを取得してください。');
      return;
    }

    setIsLoading(true);
    setError(null);
    const currentKeyword = keyword.trim(); // 検索時のキーワードを固定

    // ===============================================
    // ★ Step 1: ローカル検索 (即時実行・即時表示)
    // ===============================================
    try {
        const lowerKeyword = currentKeyword.toLowerCase();
        
        // textプロパティにキーワードが含まれるものを抽出
        const localMatches = comments.filter(c => 
          c.text && c.text.toLowerCase().includes(lowerKeyword)
        );

        // 即座に親コンポーネントへ通知 (第2引数でキーワードも渡す)
        // これにより、ユーザーは待ち時間ゼロで結果を見ることができる
        onSearchResult(JSON.stringify(localMatches), currentKeyword);

        // ===============================================
        // ★ Step 2: AI検索 (バックグラウンド実行)
        // ===============================================
        
        // バックエンドへ送信するデータ
        const payload = {
            keyword: currentKeyword,
            comments: comments
        };

        const response = await fetch(BACKEND_API_URL, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            // エラー詳細を取得
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `AI Search Error: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success && result.data) {
            let aiResults = [];
            try {
                // AIが返したJSON文字列をパース
                aiResults = JSON.parse(result.data);
                // AIが配列ではなく単一オブジェクトを返してしまった場合のガード
                if (!Array.isArray(aiResults)) {
                    aiResults = [aiResults];
                }
            } catch (e) {
                console.error("AI Response Parse Error:", e);
                // パースエラー時はAI結果なしとして進める
                aiResults = [];
            }

            // ===============================================
            // ★ Step 3: 結果のマージ (重複除去)
            // ===============================================
            
            // ローカルで見つかったコメントのテキストをSetに保存して高速検索できるようにする
            const localTexts = new Set(localMatches.map(c => c.text));

            // AIが見つけたもののうち、ローカル検索でまだ出ていないものだけを追加
            const newFindings = aiResults.filter(c => 
                c.text && !localTexts.has(c.text)
            );
            
            // ローカル結果とAI新規結果を合体
            const mergedResults = [...localMatches, ...newFindings];

            // 最終結果を更新して親に渡す
            onSearchResult(JSON.stringify(mergedResults), currentKeyword);
        }

    } catch (e) {
        console.error('検索プロセスエラー:', e);
        // AI検索が失敗しても、ローカル検索結果は既に表示されているので、
        // ユーザー体験を損なわないよう控えめなエラーメッセージにする
        setError(`AIによる詳細解析に失敗しました (キーワード一致の結果のみ表示しています)`);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 border border-blue-50 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        🔍 コメント検索
        <span className="text-[10px] font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
            Hybrid Search
        </span>
      </h2>

      <div className="flex space-x-3">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          // Enterキーでも検索実行
          onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                  handleSearch();
              }
          }}
          placeholder="例: 音質, 料金, わかりやすい..."
          className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-50 transition-shadow"
          disabled={isLoading && !comments} // データがない時の検索中は無効化
        />
        
        <button
          onClick={handleSearch}
          disabled={!comments || comments.length === 0}
          className={`
            px-6 py-2 rounded-md font-bold text-white transition-all shadow-md flex items-center gap-2 min-w-[100px] justify-center
            ${(!comments || comments.length === 0)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
            }
          `}
        >
          {isLoading ? (
             <>
               <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <span className="text-xs">解析中...</span>
             </>
          ) : (
             '検索'
          )}
        </button>
      </div>

      {/* ステータス / エラー表示エリア */}
      <div className="mt-2 min-h-[20px]">
          {isLoading && (
              <p className="text-xs text-blue-600 flex items-center gap-1 animate-pulse">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                  キーワード一致件数を即時表示しました。現在、AIが文脈を解析しています...
              </p>
          )}
          {error && (
            <p className="text-xs text-orange-500 flex items-center gap-1">
                ⚠️ {error}
            </p>
          )}
      </div>
    </div>
  );
};