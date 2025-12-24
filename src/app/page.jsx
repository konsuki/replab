'use client';

import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { CommentDisplay } from '../components/CommentDisplay';
import { CommentSearch } from '../components/CommentSearch'; 
import { VideoUrlInput } from '../components/VideoUrlInput';
import { LimitModal } from '../components/LimitModal'; // ★ 1. 追加インポート

// FastAPIのURL (開発環境に合わせて変更してください)
const YOUTUBE_API_URL = 'http://localhost:8000/api/comments'; 
// const YOUTUBE_API_URL = 'https://backend-904463184290.asia-northeast1.run.app/api/comments';

export default function Home() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  
  // ★ 2. モーダル表示用のStateを追加
  const [showLimitModal, setShowLimitModal] = useState(false);

  const fetchComments = async (videoId) => {
    setSearchResult(null);
    setApiData(null);
    setLoading(true);
    setError(null);
    setShowLimitModal(false); // リセット

    try {
      // ★ 3. ローカルストレージからJWTトークンを取得
      // (ログイン成功時に 'accessToken' というキーで保存されている前提)
      const token = localStorage.getItem('accessToken');

      if (!token) {
        // 未ログインなら先にエラーにするか、ログイン画面へ飛ばす
        setError("ログインが必要です。右上のボタンからログインしてください。");
        setLoading(false);
        return;
      }

      const url = `${YOUTUBE_API_URL}?video_id=${videoId}`;
      
      const response = await fetch(url, {
        method: 'GET', // GETリクエストでもHeaderは送れます
        headers: {
            // ★ 4. ヘッダーにトークンを付与
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
      });

      // ★ 5. サーバーからのステータスコードをチェック
      if (response.status === 402) {
        // 402 Payment Required = 制限回数オーバー
        console.warn("利用制限に達しました");
        setShowLimitModal(true); // モーダルを表示
        setLoading(false);
        return; // ここで処理終了
      }
      
      if (response.status === 401) {
        // 401 Unauthorized = トークン切れ or 無効
        setError("ログインセッションが切れました。再ログインしてください。");
        // localStorage.removeItem('accessToken'); // 必要なら消す
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.status === 'error') {
        setError(data.message || 'コメント取得中にエラーが発生しました。');
        setApiData(data);
      } else {
        setApiData(data);
      }
    } catch (e) {
      console.error('API呼び出しエラー:', e);
      setError('ネットワークエラーまたはAPI接続に失敗しました。');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mx-auto p-4 md:p-8">
      <Header/>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-50">
        YouTubeコメント分析ツール (Gemini連携)
      </h1>

      {/* 動画URL入力コンポーネント */}
      <VideoUrlInput 
        onFetch={fetchComments} 
        loading={loading} 
      />

      {/* 
         ★ 6. 制限モーダルを配置
         showLimitModal が true の時だけ表示されます
      */}
      <LimitModal 
        isOpen={showLimitModal} 
        onClose={() => setShowLimitModal(false)} 
      />

      {/* エラー表示 */}
      {error && (
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
         </div>
      )}
      
      {/* 検索コンポーネント */}
      {apiData && apiData.status === 'success' && apiData.comments && (
        <CommentSearch
          comments={apiData.comments}
          onSearchResult={setSearchResult}
        />
      )}

      {/* コメント表示コンポーネント */}
      <CommentDisplay 
        apiData={apiData} 
        searchResultJson={searchResult}
      />
    </div>
  );
}