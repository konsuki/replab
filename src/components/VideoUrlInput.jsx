// Client Component
'use client';

import React, { useState } from 'react';

// URLからIDを抽出する関数（変更なし）
const extractVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) return match[2];
  if (url.length === 11 && !url.includes(' ')) return url;
  return null;
};

export const VideoUrlInput = ({ onFetch, loading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);

  const handleFetch = () => {
    setError(null);
    if (!url) {
      setError('URLを入力してください。');
      return;
    }

    const videoId = extractVideoId(url.trim());

    if (!videoId) {
      setError('有効なYouTube URLまたは動画IDを入力してください。');
      return;
    }

    // ★ 以前あったlocalStorageのカウント処理はすべて削除 ★
    
    // 親コンポーネントへIDを渡して実行
    onFetch(videoId); 
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner mb-6">
      <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
        🚀 動画コメント取得
      </h2>
      <div className="flex space-x-3">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="YouTube URL または動画IDを入力してください..."
          className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-600 dark:text-gray-50 transition"
          disabled={loading}
        />
        <button
          onClick={handleFetch}
          disabled={loading}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            loading
              ? 'bg-gray-400 dark:bg-gray-500 text-gray-600 dark:text-gray-300 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
          }`}
        >
          {loading ? '取得中...' : 'コメントを取得'}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-red-500 text-sm font-medium">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

export default VideoUrlInput;