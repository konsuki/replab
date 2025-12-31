// src/components/CommentSearch.jsx
'use client';
import React, { useState } from 'react';

export const CommentSearch = ({ comments, onSearchResult }) => {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // AI検索中のフラグ
  const [error, setError] = useState(null);

  // バックエンドAPI
  const BACKEND_API_URL = "https://backend-904463184290.asia-northeast1.run.app/api/search-comments";

  const handleSearch = async () => {
    if (!keyword.trim() || !comments || comments.length === 0) {
      alert('キーワードを入力するか、先にYouTubeコメントを取得してください。');
      return;
    }

    setIsLoading(true);
    setError(null);

    // ===============================================
    // ★ Step 1: ローカル検索 (即時実行・即時表示)
    // ===============================================
    const lowerKeyword = keyword.toLowerCase();
    
    // 単純なキーワードマッチングを行う
    const localMatches = comments.filter(c => 
      c.text && c.text.toLowerCase().includes(lowerKeyword)
    );

    // 親コンポーネントに通知して、まずはこれを表示させる！
    // JSON文字列ではなく、オブジェクト配列を直接渡せるように親も修正が必要ですが、
    // ここでは既存仕様(JSON文字列)に合わせて変換して渡します。
    onSearchResult(JSON.stringify(localMatches));

    // ===============================================
    // ★ Step 2: AI検索 (バックグラウンド実行)
    // ===============================================
    try {
      const payload = {
        keyword: keyword,
        comments: comments
      };

      const response = await fetch(BACKEND_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

        // ===============================================
        // ★ Step 3: 結果のマージ (重複除去)
        // ===============================================
        // ローカルで見つかったコメントのテキストをSetに保存
        const localTexts = new Set(localMatches.map(c => c.text));

        // AIが見つけたもののうち、ローカル検索でまだ出ていないものだけを追加
        const newFindings = aiResults.filter(c => !localTexts.has(c.text));
        
        // 合体させる
        const mergedResults = [...localMatches, ...newFindings];

        // 最終結果を更新
        onSearchResult(JSON.stringify(mergedResults));
      }

    } catch (e) {
      console.error('検索API呼び出しエラー:', e);
      // AI検索が失敗しても、ローカル検索結果は残っているのでエラー表示は控えめにするか、
      // ユーザーに通知するならここで
      setError(`AI検索に失敗しましたが、キーワード一致検索の結果を表示しています。`);
    } finally {
      setIsLoading(false);
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
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="例: 音質, 料金, わかりやすい..."
          className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-50"
          disabled={isLoading && !comments} // 検索中でも入力は許可しても良いが、連打防止で制御
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
               {/* 検索中もボタンはアクティブに見せるが、ローディングアイコンを出す */}
               <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               AI解析中...
             </>
          ) : (
             '検索'
          )}
        </button>
      </div>

      {/* 検索状況のステータス表示 */}
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