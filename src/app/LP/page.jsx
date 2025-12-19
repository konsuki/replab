'use client';

import React, { useState, useRef, useEffect } from 'react';

// --- 作成したUIコンポーネントのインポート ---
import { HeroSection } from '../../components/LP/HeroSection';
import { FeaturesAndWorkflow } from '../../components/LP/FeaturesAndWorkflow';
import { UseCaseTabs } from '../../components/LP/UseCaseTabs';

// --- 既存の機能コンポーネントのインポート (site2) ---
import { CommentDisplay } from '../../components/CommentDisplay';
import { CommentSearch } from '../../components/CommentSearch';

// ファイルの先頭に追加
import Link from 'next/link'; 

// APIエンドポイント設定
// const YOUTUBE_API_URL = 'http://localhost:8000/api/comments'; // ローカル用
const YOUTUBE_API_URL = 'https://backend-904463184290.asia-northeast1.run.app/api/comments';


// --- 簡易ヘッダーコンポーネント (ファイル内定義) ---
const Header = () => (
  <header className="absolute top-0 left-0 w-full z-50 border-b border-transparent">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2 font-bold text-xl text-gray-800">
        <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">AI</span>
        <span>CommentAnalyzer</span>
      </div>
      <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
        <a href="#features" className="hover:text-blue-600 transition">機能</a>
        <a href="#usecases" className="hover:text-blue-600 transition">活用事例</a>
        <a href="#pricing" className="hover:text-blue-600 transition">料金</a>
      </nav>
      <div className="flex gap-3">
        <button className="text-sm font-bold text-gray-600 hover:text-gray-900">ログイン</button>
        <Link href="/auth/signin">
  <button className="text-sm font-bold bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition">
    登録する
  </button>
</Link>
      </div>
    </div>
  </header>
);

// --- 信頼性/口コミセクション (ファイル内定義) ---
const TestimonialsSection = () => (
  <section className="container mx-auto px-4 py-20 text-center">
    <h2 className="text-2xl font-bold mb-4">沢山の方にご愛用いただいております</h2>
    <p className="text-gray-500 mb-10">あなたもきっと気に入るはず。</p>
    
    <div className="flex flex-col md:flex-row gap-6 justify-center max-w-5xl mx-auto">
      {[
        { 
          name: "YouTuber A氏", 
          role: "Channel Owner", 
          text: "数千件のコメントからアンチコメントだけを抽出して対策するのに役立ちました。Geminiの精度がすごい。", 
          color: "border-red-500 text-red-600" 
        },
        { 
          name: "Company B", 
          role: "Marketing", 
          text: "競合チャンネルの分析に使用。視聴者が何を求めているかがデータとして可視化されました。", 
          color: "border-blue-500 text-blue-600" 
        }
      ].map((item, idx) => (
        /* ↓↓↓ ここを修正しました (key={}) ↓↓↓ */
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

// --- フッターコンポーネント (ファイル内定義) ---
const Footer = () => (
  <footer className="bg-gray-900 text-white pt-16 pb-8">
    <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
      <div>
        <h4 className="font-bold mb-4">製品</h4>
        <ul className="text-gray-400 text-sm space-y-2">
          <li><a href="#" className="hover:text-white">機能一覧</a></li>
          <li><a href="#" className="hover:text-white">APIドキュメント</a></li>
          <li><a href="#" className="hover:text-white">料金プラン</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">サポート</h4>
        <ul className="text-gray-400 text-sm space-y-2">
          <li><a href="#" className="hover:text-white">ヘルプセンター</a></li>
          <li><a href="#" className="hover:text-white">お問い合わせ</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">法的情報</h4>
        <ul className="text-gray-400 text-sm space-y-2">
          <li><a href="/legal" className="hover:text-yellow-400">特定商取引法に基づく表記</a></li>
          <li><a href="#" className="hover:text-white">利用規約</a></li>
          <li><a href="#" className="hover:text-white">プライバシーポリシー</a></li>
        </ul>
      </div>
    </div>
    <div className="container mx-auto px-4 border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
      © 2024 YouTube Comment AI Analyzer. All rights reserved.
    </div>
  </footer>
);


// === メインページコンポーネント ===
export default function Home() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  
  // 結果エリアへのスクロール用ref
  const resultRef = useRef(null);

  // --- API取得ロジック ---
  const fetchComments = async (videoId) => {
    setSearchResult(null);
    setApiData(null);
    setLoading(true);
    setError(null);

    try {
      // API呼び出し
      const url = `${YOUTUBE_API_URL}?video_id=${videoId}`;
      const response = await fetch(url);
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

  // --- データ取得完了時の自動スクロール ---
  useEffect(() => {
    if (apiData && !loading && resultRef.current) {
      // 少し待ってからスムーズにスクロール
      setTimeout(() => {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [apiData, loading]);

  // --- Gemini検索結果を受け取るハンドラ ---
  const handleSearchResult = (resultData) => {
    setSearchResult(resultData);
    // 検索完了後も少しスクロール調整すると親切かも知れません（今回は省略）
  };

  return (
    
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* 1. ヘッダー */}
      <Header />

      {/* 2. ヒーローセクション (入力フォームを含む) */}
      <HeroSection onFetch={fetchComments} loading={loading} />

      {/* グローバルエラー表示 (HeroSection外で起きたエラー用) */}
      {error && !apiData && (
        <div className="container mx-auto px-4 mt-8">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-center max-w-2xl mx-auto">
            <p className="font-bold">⚠️ エラーが発生しました</p>
            <p>{}</p>
          </div>
        </div>
      )}

      {/* 
        3. 実行結果表示エリア (データ取得時のみ表示)
        HeroSectionのすぐ下に配置することで、アクションに対する結果を直感的に見せる
      */}
      {apiData && (
        <section 
          ref={resultRef} 
          className="py-16 bg-gradient-to-b from-white to-blue-50 min-h-[600px]"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              
              {/* ヘッダー部分 */}
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
                {/* A. 検索コンポーネント (AI Search) */}
                {apiData.status === 'success' && apiData.comments && (
                  <CommentSearch
                    comments={apiData.comments}
                    onSearchResult={handleSearchResult} 
                  />
                )}

                {/* B. 結果表示コンポーネント (List Display) */}
                <CommentDisplay 
                  apiData={apiData} 
                  searchResultJson={searchResult}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. 特徴 & ワークフロー紹介 */}
      <div id="features">
        <FeaturesAndWorkflow />
      </div>

      {/* 5. ユースケース (タブ) */}
      <div id="usecases">
        <UseCaseTabs />
      </div>

      {/* 6. 信頼性・口コミ */}
      <TestimonialsSection />

      {/* 7. フッター */}
      <Footer />
    </div>
  );
}