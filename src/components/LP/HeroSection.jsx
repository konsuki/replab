'use client';

import React, { useState } from 'react';
// --- ユーティリティ関数: YouTube ID抽出 ---
const extractVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) return match[2];
  if (url.length === 11 && !url.includes(' ')) return url;
  return null;
};

export const HeroSection = ({ onFetch, loading }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [localError, setLocalError] = useState(null);

  // --- 動作定義: ボタンクリック時の処理 ---
  const handleFetchClick = () => {
    setLocalError(null);
    
    // 1. 入力チェック
    if (!inputUrl.trim()) {
      setLocalError('URLを入力してください。');
      return;
    }

    // 2. ID抽出と検証
    const videoId = extractVideoId(inputUrl.trim());
    if (!videoId) {
      setLocalError('有効なYouTube URLまたは動画IDを入力してください。');
      return;
    }

    // 3. 親コンポーネントへ通知 (制限チェックは親で行う)
    onFetch(videoId);
  };

  // --- 動作定義: Enterキーでの送信 ---
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleFetchClick();
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-orange-50/50 to-white pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12 md:gap-16">
        
        {/* === 左側: キャッチコピー & アクションカード === */}
        <div className="w-full md:w-1/2 z-10 flex flex-col gap-8">
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              <span 
                className="text-transparent bg-clip-text"
                style={{ 
                  backgroundImage: 'linear-gradient(to right, #FFC400, #FF9100, #DD2C00)' 
                }}
              >
                YouTubeのコメントを
              </span>
              <br />
              <span style={{ color: 'rgb(0 0 0 / 60%)' }}>
                検索できます。
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
              URLを貼るだけで、Gemini AIが数千件の声を可視化。<br />
              視聴者の感情やトレンドを、たった5秒で把握できます。
            </p>
          </div>

          {/* 入力アクションカード */}
          <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 transform transition-all hover:shadow-2xl">
            <div className="relative flex flex-col sm:flex-row gap-2 p-2">
              
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* アイコンの色も少しなじませる */}
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <input
                  type="text"
                  className={`block w-full pl-10 pr-3 py-4 text-base text-gray-900 bg-gray-50 rounded-xl border-2 focus:outline-none focus:ring-0 transition-colors ${
                    localError 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-transparent focus:border-orange-500 focus:bg-white' /* ▼変更: focus時の枠線をオレンジに */
                  }`}
                  placeholder="YouTubeのURLをここに貼り付け"
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    if (localError) setLocalError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                />
              </div>

              <button
                onClick={handleFetchClick}
                disabled={loading}
  className={`flex-shrink-0 px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-200 flex items-center justify-center min-w-[160px] ${
    loading
      ? 'bg-gray-400 cursor-not-allowed'
      : 'cursor-pointer bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0'
  }`}
>
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="24"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    解析中...
                  </>
                ) : (
                  <>
                    <span>コメントを取得</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            {localError && (
              <div className="px-4 pb-3 pt-1">
                <p className="text-red-500 text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {}
                </p>
              </div>
            )}
            
            <div className="px-4 pb-2 text-xs text-gray-400 text-center sm:text-left">
              ※ 動画IDのみの入力にも対応しています (例: fmFn2otWosE)
            </div>
          </div>

          <div className="flex gap-4 text-sm text-gray-500 font-medium">
            <span>✨ Gemini Pro搭載</span>
            <span>🔒 安全なAPI接続</span>
            <span>🚀 ログイン不要</span>
          </div>
        </div>

        {/* === 右側: ビジュアルエリア === */}
        <div className="w-full md:w-1/2 relative hidden md:block">
           {/* ▼変更: 背景の装飾円を青からオレンジ系へ */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>
          <div className="relative w-full aspect-video bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
            {/* ブラウザ風ヘッダー */}
            <div className="bg-gray-100 h-8 border-b flex items-center px-4 space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>

            {/* コンテンツエリア */}
            <div className="flex-grow p-6 flex items-center justify-center relative">
               {/* 左: YouTube動画っぽい要素 */}
              <div className="w-32 h-20 bg-red-500 rounded-lg shadow-lg flex items-center justify-center transform -rotate-6 z-10">
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
              </div>

               {/* 中央: 矢印とAIアイコン */}
               {/* ▼変更: 青からオレンジへ */}
              <div className="mx-4 text-orange-500 flex flex-col items-center z-20">
                <div className="bg-white p-2 rounded-full shadow-md mb-2">
                  <span className="text-xl">✨</span>
                </div>
                <svg className="w-8 h-8 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>

               {/* 右: データ/グラフ要素 */}
              <div className="w-36 h-40 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col p-2 transform rotate-3 z-10 space-y-2">
                <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                <div className="flex items-end gap-1 h-20 pb-2 border-b border-gray-100">
                  {/* ▼変更: グラフの色を青系から暖色系へ */}
                  <div className="w-1/4 bg-orange-200 h-[40%] rounded-t"></div>
                  <div className="w-1/4 bg-orange-400 h-[80%] rounded-t"></div>
                  <div className="w-1/4 bg-red-300 h-[60%] rounded-t"></div>
                  <div className="w-1/4 bg-red-500 h-[100%] rounded-t"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-gray-100 rounded"></div>
                  <div className="h-1.5 w-5/6 bg-gray-100 rounded"></div>
                  <div className="h-1.5 w-4/6 bg-gray-100 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};