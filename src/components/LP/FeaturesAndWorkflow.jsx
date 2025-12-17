'use client';

import React from 'react';

// --- サブコンポーネント: 技術スタックのアイコンカード ---
const TechCard = ({ icon, label, color }) => (
  <div className="aspect-square bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 transition-transform hover:-translate-y-1 hover:shadow-md cursor-default">
    <div className={`text-3xl ${color}`}>{icon}</div>
    <span className="text-xs font-bold text-gray-500">{label}</span>
  </div>
);

export const FeaturesAndWorkflow = () => {
  
  // スムーズスクロール用ハンドラ
  const handleScrollToWorkflow = (e) => {
    e.preventDefault();
    const element = document.getElementById('workflow-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 
        ===========================================
        3. 品質・機能紹介エリア (Features)
        site1の「驚くほどの高品質」エリアに対応
        ===========================================
      */}
      <section className="py-20 md:py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              驚くほどの分析精度
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              単なるキーワード一致ではありません。<br className="hidden md:inline"/>
              Gemini AIが文脈を読み解き、あなたの質問に的確なコメントを抽出します。
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            
            {/* 左側: ビジュアル (AI検索のイメージデモ) */}
            <div className="w-full md:w-1/2 relative">
              {/* 装飾的な背景 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-full blur-3xl -z-10 opacity-60"></div>

              {/* カードUI */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 max-w-md mx-auto relative">
                {/* 検索入力の模倣 */}
                <div className="mb-6">
                  <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">User Input</div>
                  <div className="bg-gray-100 rounded-lg p-3 text-gray-800 font-medium flex items-center gap-2 border border-gray-200">
                    <span className="text-blue-500">🔍</span>
                    「この動画の<span className="text-blue-600 bg-blue-100 px-1 rounded">欠点</span>は？」
                  </div>
                </div>

                {/* 矢印 */}
                <div className="flex justify-center mb-6">
                  <svg className="w-6 h-6 text-gray-300 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                {/* AI抽出結果の模倣 */}
                <div>
                   <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide flex justify-between">
                      <span>AI Result</span>
                      <span className="text-green-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                        Context Match
                      </span>
                   </div>
                   
                   {/* 結果カード1: ネガティブ抽出 */}
                   <div className="bg-red-50 rounded-lg p-3 border-l-4 border-red-400 mb-3">
                      <p className="text-sm text-gray-800">
                        "...内容は良いけど、<span className="font-bold bg-yellow-200">BGMが大きすぎて</span>声が聞き取りづらい箇所があります..."
                      </p>
                      <div className="mt-2 text-xs text-gray-500 text-right">- User A (2:30付近)</div>
                   </div>

                   {/* 結果カード2: 別の視点 */}
                   <div className="bg-red-50 rounded-lg p-3 border-l-4 border-red-400">
                      <p className="text-sm text-gray-800">
                        "...<span className="font-bold bg-yellow-200">結論を先に言わない</span>ので、前半で離脱しそうになった..."
                      </p>
                   </div>
                </div>

                {/* ラベル */}
                <div className="absolute -right-4 -top-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12">
                  "欠点"という単語がなくても抽出！
                </div>
              </div>
            </div>

            {/* 右側: テキスト説明 */}
            <div className="w-full md:w-1/2 text-left space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                膨大なコメントの海から、<br />
                <span className="text-blue-600">真のインサイト</span>を釣り上げる。
              </h3>
              <p className="text-gray-600 leading-relaxed">
                従来の検索機能では、「面白い」と検索しても「面白くない」というコメントまでヒットしてしまいました。<br /><br />
                本ツールのAI検索は、文脈（コンテキスト）を理解します。ポジティブな意見、改善要望、特定のトピックに関する議論など、人間の感覚に近い精度でフィルタリングが可能です。
              </p>
              
              <div className="pt-4">
                <a 
                  href="#workflow-section" 
                  onClick={handleScrollToWorkflow}
                  className="inline-flex items-center text-blue-600 font-bold hover:text-blue-800 transition-colors group"
                >
                  技術的な仕組みを見る 
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 
        ===========================================
        5. ワークフロー統合エリア (Workflow)
        site1の「ソフトウェアのワークフローと統合」エリアに対応
        ===========================================
      */}
      <section id="workflow-section" className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20">
          
          {/* 右側 (グリッド): 技術スタックアイコン */}
          <div className="w-full md:w-1/2">
             <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-md mx-auto">
                <TechCard icon="⚡" label="FastAPI" color="text-teal-500" />
                <TechCard icon="⚛️" label="React" color="text-blue-400" />
                <TechCard icon="✨" label="Gemini" color="text-purple-500" />
                <TechCard icon="📺" label="YouTube Data" color="text-red-600" />
                <TechCard icon="🐍" label="Python" color="text-yellow-500" />
                <TechCard icon="📄" label="JSON/CSV" color="text-gray-600" />
             </div>
          </div>

          {/* 左側: テキスト説明 */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              既存のワークフローに<br/>スムーズに統合
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              分析データはJSON形式で構造化されており、他のツールでの再利用が容易です。
              Python (FastAPI) バックエンドは拡張性が高く、将来的にCSVエクスポートや
              CRMツールへの自動連携もサポート可能です。
            </p>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm inline-block">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                 <div className="text-xs font-mono text-gray-500">Terminal</div>
               </div>
               <code className="text-sm font-mono text-gray-800">
                 $ curl -X GET /api/comments?video_id=...
               </code>
            </div>

            <div className="mt-8">
              <a 
                href="http://localhost:8000/docs" // 必要に応じて本番URLに変更
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 font-bold hover:underline flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                APIドキュメントを見る (Swagger UI)
              </a>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};