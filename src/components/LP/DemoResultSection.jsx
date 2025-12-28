'use client';

import React, { useState, useEffect } from 'react';

// --- 作成したコンポーネントのインポート ---
// ※ 実際のファイルパスに合わせて import パスを調整してください
import { HeroSection } from './HeroSection';
import { FeaturesAndWorkflow } from './FeaturesAndWorkflow';
import { UseCaseTabs } from './UseCaseTabs';
import { DemoResultSection } from './DemoResultSection';

// --- APIのエンドポイント ---
// 本番環境 (Cloud Run) のURL
const API_BASE_URL = 'https://backend-904463184290.asia-northeast1.run.app/api/comments';
// ローカル開発用 (必要に応じて切り替え)
// const API_BASE_URL = 'http://localhost:8000/api/comments';

export default function Home() {
  // --- State Management ---
  const [apiData, setApiData] = useState(null);         // YouTubeコメントデータ
  const [searchResult, setSearchResult] = useState(null); // Gemini検索結果
  const [loading, setLoading] = useState(false);        // ローディング状態
  const [error, setError] = useState(null);             // グローバルエラー (通信エラー等)

  // --- Logic: YouTubeコメント取得 ---
  const fetchComments = async (videoId) => {
    // 状態のリセット
    setApiData(null);
    setSearchResult(null);
    setError(null);
    setLoading(true);

    try {
      // APIリクエストの構築
      const url = `${API_BASE_URL}?video_id=${}`;
      
      console.log(`Fetching comments for: ${}...`);
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'error') {
        // API側で検知されたエラー (動画が存在しない、コメント無効など)
        setError(data.message || 'コメントの取得に失敗しました。');
        // エラー詳細がある場合は apiData にも含めて表示側で制御可能にする
        setApiData(data); 
      } else {
        // 成功時
        setApiData(data);
      }
    } catch (e) {
      console.error('API呼び出しエラー:', e);
      setError('サーバーへの接続に失敗しました。しばらく待ってから再試行してください。');
    } finally {
      setLoading(false);
    }
  };

  // --- Logic: 自動スクロール ---
  // データ取得が成功したら、結果エリア (#analysis-result) へスクロール
  useEffect(() => {
    if (apiData && apiData.status === 'success') {
      // 少し遅延させてDOMのレンダリングを待つ
      const timer = setTimeout(() => {
        const resultElement = document.getElementById('analysis-result');
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300); // 0.3秒待機

      return () => clearTimeout(timer);
    }
  }, [apiData]);

  // --- UI Layout ---
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* 0. ヘッダー (簡易ナビゲーション) */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <span className="font-bold text-lg tracking-tight">Replab<span className="text-blue-600">.ai</span></span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-blue-600 transition-colors">機能</a>
            <a href="#" className="hover:text-blue-600 transition-colors">ユースケース</a>
            <a href="#" className="hover:text-blue-600 transition-colors">料金</a>
          </nav>
          <div>
            <a 
              href="https://github.com/your-repo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="pt-16">
        
        {/* 1. ヒーローセクション (入力フォーム含む) */}
        <HeroSection 
          onFetch={} 
          loading={} 
        />

        {/* グローバルエラー表示エリア (通信エラーなど深刻なもの) */}
        {error && !apiData && (
          <div className="container mx-auto px-4 py-4">
             <div className="max-w-4xl mx-auto bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm flex items-start gap-3">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="font-bold text-red-800">エラーが発生しました</h3>
                  <p className="text-sm text-red-700 mt-1">{}</p>
                </div>
             </div>
          </div>
        )}

        {/* 2. 品質・機能紹介 & ワークフロー */}
        <FeaturesAndWorkflow />

        {/* 3. ユースケース (タブ) */}
        <UseCaseTabs />

        {/* 4. デモ・実行結果エリア */}
        {/* 
            初期状態: プレースホルダーを表示
            データ取得後: 実際のコメントリストと検索窓を表示
        */}
        <DemoResultSection 
          apiData={} 
          searchResult={} 
          onSearchResult={} 
        />

      </main>

      {/* 5. フッター */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold mb-4 text-gray-100">Product</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">機能一覧</a></li>
                <li><a href="#" className="hover:text-white transition-colors">APIドキュメント</a></li>
                <li><a href="#" className="hover:text-white transition-colors">料金プラン</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-100">Resources</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">ブログ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">コミュニティ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ヘルプセンター</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-100">Company</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                {/* コンテキストにあった特商法ページへのリンク */}
                <li><a href="/legal" className="hover:text-yellow-400 text-yellow-500/80 transition-colors">特定商取引法に基づく表記</a></li>
                <li><a href="#" className="hover:text-white transition-colors">利用規約</a></li>
                <li><a href="#" className="hover:text-white transition-colors">プライバシー</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-100">Connect</h4>
              <div className="flex gap-4">
                {/* ダミーSNSアイコン */}
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">𝕏</a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">🐙</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} YouTube Comment Analyzer. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Made with ❤️ using Next.js & Gemini</p>
          </div>
        </div>
      </footer>

    </div>
  );
}