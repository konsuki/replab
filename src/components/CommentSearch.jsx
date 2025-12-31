// src/components/CommentSearch.jsx
'use client';
import React, { useState, useRef } from 'react'; // ★ useRefを追加

export const CommentSearch = ({ comments, onSearchResult }) => {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ★ 進行中のリクエストを管理するためのRef
  const abortControllerRef = useRef(null);

  // const BACKEND_API_URL = "https://backend-904463184290.asia-northeast1.run.app/api/search-comments";
  // またはローカルで動かしている場合
  const BACKEND_API_URL = "http://localhost:8000/api/search-comments";

  const handleSearch = async () => {
    if (!keyword.trim() || !comments || comments.length === 0) {
      alert('キーワードを入力するか、先にYouTubeコメントを取得してください。');
      return;
    }

    // ===============================================
    // ★ 1. 前回のリクエストをキャンセル
    // ===============================================
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // ★ 2. 新しい AbortController を作成
    const newController = new AbortController();
    abortControllerRef.current = newController;

    setIsLoading(true);
    setError(null);

    // --- Step 1: ローカル検索 (即時実行) ---
    const lowerKeyword = keyword.toLowerCase();
    const localMatches = comments.filter(c => 
      c.text && c.text.toLowerCase().includes(lowerKeyword)
    );
    
    // 親コンポーネントへ即時通知 (ローカル結果 + キーワード)
    onSearchResult(JSON.stringify(localMatches), keyword);

    // --- Step 2: AI検索 (バックグラウンド実行) ---
    try {
      const payload = {
        keyword: keyword,
        comments: comments
      };

      const response = await fetch(BACKEND_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        // ★ 3. signal を fetch に渡す (これでキャンセル可能になる)
        signal: newController.signal,
      });

      if (!response.ok) {
        throw new Error(`AI検索エラー: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        let aiResults = [];
        try {
            aiResults = JSON.parse(result.data);
        } catch (e) {
            console.error("AI JSON Parse Error", e);
        }

        // --- Step 3: 結果のマージ ---
        const localTexts = new Set(localMatches.map(c => c.text));
        const newFindings = aiResults.filter(c => !localTexts.has(c.text));
        const mergedResults = [...localMatches, ...newFindings];

        // 正常完了時のみ結果を更新
        onSearchResult(JSON.stringify(mergedResults), keyword);
      }

    } catch (e) {
      // ★ 4. キャンセルによるエラーかどうかを判定
      if (e.name === 'AbortError') {
        console.log('前の検索リクエストがキャンセルされました:', keyword);
        // キャンセルされた場合は、stateの更新やエラー表示を行わずにここで終了する
        return; 
      }
      
      console.error('検索API呼び出しエラー:', e);
      setError(`AI検索に失敗しましたが、キーワード一致検索の結果を表示しています。`);
    } finally {
      // ★ 5. 最新のリクエストが完了したときだけローディングをOFFにする
      // (キャンセルされた古いリクエストが finally に来ても、isLoading を false にしない)
      if (abortControllerRef.current === newController) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 border border-blue-100">
      <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        🔍 コメント検索
        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Hybrid Search</span>
      </h2>
      
      <div className="flex space-x-3">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          // Enterキー連打でも正しくキャンセルされるようになります
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="例: 音質, 料金, わかりやすい..."
          className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-50"
          // isLoading中のdisabledは削除し、いつでも入力・再検索できるようにする
        />
        <button
          onClick={handleSearch}
          disabled={!comments || comments.length === 0}
          className={`px-6 py-2 rounded-md font-bold text-white transition-all shadow-md flex items-center gap-2
            ${(!comments || comments.length === 0)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:-translate-y-0.5'
            }
          `}
        >
          {isLoading ? (
             <>
               <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               {/* 検索中は「再検索」という文言に変えるのもUX的にアリです */}
               AI解析中...
             </>
          ) : (
             '検索'
          )}
        </button>
      </div>

      <div className="mt-2 min-h-[20px]">
          {isLoading && (
              <p className="text-xs text-blue-600 animate-pulse flex items-center gap-1">
                  ⚡ キーワード一致は即時表示しました。現在、AIが文脈を解析しています...
              </p>
          )}
          {error && (
            <p className="text-xs text-orange-500">{error}</p>
          )}
      </div>
    </div>
  );
};