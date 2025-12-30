'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// --- コンポーネントのインポート ---
import { Header } from '../components/Header';
import { HeroSection } from '../components/LP/HeroSection'; // デザイン維持のためこれを使用
import { FeaturesAndWorkflow } from '../components/LP/FeaturesAndWorkflow';
import { UseCaseTabs } from '../components/LP/UseCaseTabs';
import { Footer } from '../components/Footer';
import { CommentDisplay } from '../components/CommentDisplay';
import { CommentSearch } from '../components/CommentSearch';
import { LimitModal } from '../components/LimitModal';
import { LoginModal } from '../components/LoginModal';

// APIエンドポイント
// const YOUTUBE_API_URL = 'http://localhost:8000/api/comments';
const YOUTUBE_API_URL = 'https://backend-904463184290.asia-northeast1.run.app/api/comments';

// --- 信頼性セクション (変更なし) ---
const TestimonialsSection = () => (
  <section className="container mx-auto px-4 py-20 text-center">
    <h2 className="text-2xl font-bold mb-4">沢山の方にご愛用いただきたいです</h2>
    <p className="text-gray-500 mb-10">あなたもきっと気に入るはず。</p>
    <div className="flex flex-col md:flex-row gap-6 justify-center max-w-5xl mx-auto">
      {/* どんなことに使えそうかをtextに案として書く。ありきたりなものは禁止。youtube視聴者あるあるであること。 */}
      {[
        { 
          name: "開発者", 
          role: "共感コメ探し", 
          text: "共感コメ探すのに使えそう。",
          color: "border-red-500 text-red-600" 
        },
        { 
          name: "Company B", 
          role: "視聴者の意見分析", 
          text: "視聴者の意見を要約できそう。", 
          color: "border-blue-500 text-blue-600" 
        }
      ].map((item, idx) => (
        <div key={idx} className={`w-full md:w-1/2 bg-gray-50 p-6 rounded-xl border-l-4 ${item.color.split(' ')[0]} text-left shadow-sm`}>
          <div className={`font-bold text-lg mb-2 ${item.color.split(' ')[1]}`}>{item.name}</div>
          <p className="text-sm text-gray-700 italic mb-4">"{item.text}"</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
            <div className="text-xs text-gray-500">
              <div className="font-bold text-gray-900">{item.name}</div>
              <div>{item.role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// === メインページコンポーネント ===
export default function Home() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  
  // ★ 追加: モーダル表示管理用State
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const resultRef = useRef(null);

  // --- API取得ロジック ---
  const fetchComments = async (videoId) => {
    setSearchResult(null);
    setApiData(null);
    setLoading(true);
    setError(null);
    setShowLimitModal(false);
    setShowLoginModal(false); // ★ 追加: 実行時に一旦閉じる（念のため）

    try {
      // ★ トークン取得 (LPでも制限チェックのため必要)
      const token = localStorage.getItem('accessToken');
      
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // API URLの組み立て（環境変数等を使用している場合はそのまま）
      const url = `${YOUTUBE_API_URL}?video_id=${videoId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      });

      // ★ 402 (Payment Required) チェック
      if (response.status === 402) {
        setShowLimitModal(true);
        setLoading(false);
        return;
      }

      // ▼▼▼ 修正箇所ここから ▼▼▼
      // 401 (Unauthorized) チェック
      if (response.status === 401) {
        // 修正前: setError("この機能を利用するにはログインが必要です。");
        
        // 修正後: モーダルを表示させる
        setShowLoginModal(true);
        
        setLoading(false);
        return;
      }
      // ▲▲▲ 修正箇所ここまで ▲▲▲

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

  // --- 自動スクロール ---
  useEffect(() => {
    if (apiData && !loading && resultRef.current) {
      setTimeout(() => {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [apiData, loading]);

  const handleSearchResult = (resultData) => {
    setSearchResult(resultData);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header />

      {/* 2. ヒーローセクション */}
      {/* デザインはそのままで、onFetch関数を渡すだけ */}
      <HeroSection onFetch={fetchComments} loading={loading} />

      {/* 制限モーダルの配置 */}
      <LimitModal 
        isOpen={showLimitModal} 
        onClose={() => setShowLimitModal(false)} 
      />

      {/* ログインモーダルの配置 */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />

      {/* エラー表示 */}
      {error && !apiData && (
        <div className="container mx-auto px-4 mt-8">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-center max-w-2xl mx-auto">
            <p className="font-bold">⚠️ エラーが発生しました</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* 結果表示エリア */}
      {apiData && (
        <section 
          ref={resultRef} 
          className="py-16 bg-gradient-to-b from-white to-blue-50 min-h-[600px]"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-700">📊 分析結果</h2>
                <button 
                  onClick={() => { setApiData(null); window.scrollTo({top:0, behavior:'smooth'}); }}
                  className="text-sm text-gray-500 hover:text-red-500"
                >
                  ✕ 閉じる
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                {apiData.status === 'success' && apiData.comments && (
                  <CommentSearch
                    comments={apiData.comments}
                    onSearchResult={handleSearchResult} 
                  />
                )}
                <CommentDisplay 
                  apiData={apiData} 
                  searchResultJson={searchResult}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <div id="features"><FeaturesAndWorkflow /></div>
      <div id="usecases"><UseCaseTabs /></div>
      <TestimonialsSection />
      <Footer />
    </div>
  );
}