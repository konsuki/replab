'use client';

import React, { useState } from 'react';

export const UseCaseTabs = () => {
  // 選択中のタブIDを管理 (デフォルトは 'creator')
  const [activeTab, setActiveTab] = useState('creator');

  // タブの定義データ
  const tabs = [
    { id: 'creator', label: '🎥 クリエイターへ', icon: '🎨' },
    { id: 'marketer', label: '📈 マーケターへ', icon: '📊' },
    { id: 'viewer', label: '👀 視聴者へ', icon: '🍿' },
    { id: 'developer', label: '💻 開発者へ', icon: '⚙️' },
  ];

  // コンテンツの定義データ
  const contents = {
    creator: {
      title: '次の動画のアイデア、コメント欄に眠っていませんか？',
      description: '数千件のコメントを全て読む時間はもう必要ありません。AIが「視聴者が求めている企画」「不満点」「改善要望」を瞬時にリストアップ。ファンとのエンゲージメントを高め、チャンネル成長を加速させましょう。',
      points: [
        '企画のネタ切れを解消',
        'アンチコメントの傾向分析と対策',
        'コアファンの熱量を可視化'
      ],
      colorClass: 'bg-red-50 text-red-600 border-red-200'
    },
    marketer: {
      title: '競合チャンネルの分析、これ1つで完結。',
      description: '自社製品のレビュー動画や、競合他社のプロモーション動画のコメントを分析。消費者の生の声を市場調査データとして活用できます。ポジティブ・ネガティブな意見を定量的に把握しましょう。',
      points: [
        '競合製品の評判調査（ソーシャルリスニング）',
        'インフルエンサー選定のためのエンゲージメント分析',
        '商品改善のヒントを発掘'
      ],
      colorClass: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    viewer: {
      title: '「みんなはどう思った？」をすぐに把握。',
      description: '長い動画を見る前に、コメント欄の要約をチェック。「この動画は見る価値があるか？」「どの部分が一番盛り上がったか？」を効率的に知ることができます。ネタバレを回避しつつ、動画の空気感を掴みましょう。',
      points: [
        '動画を見るかどうかの判断材料に',
        '議論が起きているポイントを特定',
        '長時間のライブ配信のアーカイブ視聴を効率化'
      ],
      colorClass: 'bg-green-50 text-green-600 border-green-200'
    },
    developer: {
      title: 'YouTube Data API × LLM の可能性を拡張。',
      description: 'このツールはモダンな技術スタック（Next.js, FastAPI, LangChain/Gemini）で構築されています。APIを利用して独自の分析ダッシュボードを作成したり、自社サービスにコメント分析機能を組み込むことが可能です。',
      points: [
        'JSON形式での構造化データ取得',
        'Gemini Pro APIの活用事例として',
        'オープンソースとしての拡張性（予定）'
      ],
      colorClass: 'bg-purple-50 text-purple-600 border-purple-200'
    }
  };

  const activeContent = contents[activeTab];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-8">
        
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4" style={{ color: 'rgb(0 0 0 / 60%)' }}>
            コメント検索するならリプラボ
          </h2>
          <p className="text-gray-500">
            あなたの立場に合わせて、最適な使い方をご提案します。
          </p>
        </div>

        {/* タブナビゲーション */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 rounded-full text-sm md:text-base font-bold transition-all duration-200 border
                flex items-center gap-2 cursor-pointer 
                ${activeTab === tab.id 
                  ? 'bg-gray-900 text-white border-gray-900 shadow-lg transform scale-105' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                } 
              `}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* コンテンツエリア (アニメーション付き切り替え) */}
        <div className="max-w-4xl mx-auto">
          <div 
            key={activeTab} // keyを変えることで再レンダリング時にアニメーションさせる
            className={`
              relative overflow-hidden rounded-2xl border p-8 md:p-12 shadow-sm animate-fadeIn
              ${activeContent.colorClass.replace('text-', 'border-').split(' ')[2]} 
              bg-white
            `}
          >
            {/* 装飾背景 */}
            <div className={`absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 rounded-bl-full opacity-10 ${activeContent.colorClass.split(' ')[0]}`}></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
              
              {/* テキスト情報 */}
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4" style={{ color: 'rgb(0 0 0 / 60%)' }}>
                  {activeContent.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8">
                  {activeContent.description}
                </p>
                
                {/* チェックリスト */}
                <ul className="space-y-3">
                  {activeContent.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${activeContent.colorClass.split(' ')[0]}`}>
                        <svg className={`w-3 h-3 ${activeContent.colorClass.split(' ')[1]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 右側のイメージ画像 (ダミー) */}
              <div className="w-full md:w-1/3 aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-4xl shadow-inner">
                {tabs.find(t => t.id === activeTab).icon}
              </div>
              
            </div>
          </div>
        </div>

      </div>

      {/* 簡易的なフェードインアニメーション用スタイル */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </section>
  );
};