// Client Component
'use client';

import React, { useState } from 'react';

/** 
 * コメント検索コンポーネント。
 * ユーザー入力を受け付け、自作のFastAPIバックエンドを経由してGemini検索を行います。
 */
export const CommentSearch = ({ comments, onSearchResult }) => {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // バックエンドのAPI URL (ローカル開発用)
  // 本番環境(GitHub Pages)の場合、バックエンドがどこにホストされているかによって変更が必要です。
  // 一旦ローカル開発用に設定します。
  const BACKEND_API_URL = "https://backend-904463184290.asia-northeast1.run.app/api/search-comments";
  // const BACKEND_API_URL = "http://localhost:8000/api/search-comments"; // ローカル開発用

  const handleSearch = async () => {
    if (!keyword.trim() || !comments || comments.length === 0) {
      alert('キーワードを入力するか、先にYouTubeコメントを取得してください。');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // バックエンドへ送信するデータ
      const payload = {
        keyword: keyword,
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
        // バックエンドからのエラー詳細を取得しようと試みる
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
          // 抽出されたJSON文字列を親コンポーネントに渡す
          onSearchResult(result.data); 
      } else {
          throw new Error("APIからのレスポンス形式が不正です。");
      }

    } catch (e) {
      console.error('検索API呼び出しエラー:', e);
      setError(`検索中にエラーが発生しました: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
        AIキーワード検索 (Backend処理)
      </h2>
      <div className="flex space-x-3">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="コメント内を検索するキーワードを入力..."
          className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-50"
          disabled={isLoading}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading || !comments || comments.length === 0}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            isLoading || !comments || comments.length === 0
              ? 'bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
          }`}
        >
          {isLoading ? '検索中...' : '検索'}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};