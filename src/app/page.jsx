// src/app/page.jsx
'use client';
import { useState, useRef } from 'react';
// --- コンポーネントのインポート ---
import { Header } from '../components/Header';
import { HeroSection } from '../components/LP/HeroSection';
import { FeaturesAndWorkflow } from '../components/LP/FeaturesAndWorkflow';
import { UseCaseTabs } from '../components/LP/UseCaseTabs';
import { Footer } from '../components/Footer';
import { CommentDisplay } from '../components/CommentDisplay';
import { CommentSearch } from '../components/CommentSearch';
import { LimitModal } from '../components/LimitModal';
// ★ 追加: LoginModalのインポート
import { LoginModal } from '../components/LoginModal';
import { SkeletonCommentDisplay } from '../components/SkeletonCommentDisplay';
// ★ 追加: 動画プレーヤーコンポーネント
import { YouTubePlayer } from '../components/YouTubePlayer';
// APIエンドポイントを環境変数から取得
const YOUTUBE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/comments';

// --- 信頼性セクション ---
const TestimonialsSection = () => (
  <section className="container mx-auto px-4 py-20 text-center">
    <h2 className="text-2xl font-bold mb-4">沢山の方にご愛用いただきたい</h2>
    <p className="text-gray-500 mb-10">あなたもきっと気に入ってほしい。</p>
    <div className="flex flex-col md:flex-row gap-6 justify-center max-w-5xl mx-auto">
      {[
        { 
          name: "YouTuber A氏", 
          role: "Channel Owner", 
          text: "数千件のコメントからアンチコメントだけを抽出して対策するのに役立ってほしい。Geminiの精度がすごくあってほしいい。", 
          color: "border-red-500 text-red-600" 
        },
        { 
          name: "Company B", 
          role: "Marketing", 
          text: "競合チャンネルの分析に使用したい。視聴者が何を求めているかがデータとして可視化されてほしい。", 
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
  
  // ローディング状態
  const [loading, setLoading] = useState(false);        // 初回ロード用
  const [isLoadingMore, setIsLoadingMore] = useState(false); // 追加ロード用

  const [error, setError] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  // ★ 追加: 検索キーワード管理用 (ハイライト機能のため)
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // ページネーション用State
  const [nextPageToken, setNextPageToken] = useState(null);
  
  // モーダル表示管理用State
  const [showLimitModal, setShowLimitModal] = useState(false);
  // ★ 追加: ログインモーダル表示管理用State
  const [showLoginModal, setShowLoginModal] = useState(false);

  const resultRef = useRef(null);

  // --- API取得ロジック (Optimistic UI実装) ---
  const fetchComments = async (videoId, pageToken = null) => {
    // 初回検索時
    if (!pageToken) {
        // 1. 状態をリセットし、ローディングを開始（これでスケルトンが表示される）
        setSearchResult(null);
        setSearchKeyword(''); // キーワードもリセット
        setApiData(null);
        setNextPageToken(null);
        setError(null);
        setShowLimitModal(false);
        // ★ 追加: 実行時に一旦閉じる（念のため）
        setShowLoginModal(false);
        setLoading(true); 

        // 2. データ取得を待たずに、即座に結果エリアへスクロール開始
        // レンダリングサイクルを考慮してごくわずかな遅延を入れる
        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 10);
    } else {
        // 追加読み込み時はローディングフラグのみ
        setIsLoadingMore(true);
    }

    try {
      const token = localStorage.getItem('accessToken');
      
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      let url = `${YOUTUBE_API_URL}?video_id=${videoId}`;
      if (pageToken) {
          url += `&page_token=${pageToken}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      });

      // 402 (Payment Required) チェック
      if (response.status === 402) {
        setShowLimitModal(true);
        setLoading(false);
        setIsLoadingMore(false);
        return;
      }

      // 401 (Unauthorized) チェック
      if (response.status === 401) {
        // ★ 修正: エラー表示ではなくログインモーダルを表示する
        setShowLoginModal(true);
        setLoading(false);
        setIsLoadingMore(false);
        return;
      }

      const data = await response.json();

      if (data.status === 'error') {
        setError(data.message || 'コメント取得中にエラーが発生しました。');
        if (!pageToken) setApiData(data); // エラー情報を表示するためにセット
      } else {
        // データのセット処理
        if (!pageToken) {
            setApiData(data);
        } else {
            setApiData(prev => ({
                ...data, 
                comments: [...prev.comments, ...data.comments]
            }));
        }
        setNextPageToken(data.next_page_token || null);
      }
    } catch (e) {
      console.error('API呼び出しエラー:', e);
      setError('ネットワークエラーまたはAPI接続に失敗しました。');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  // 検索結果ハンドラ (キーワードも受け取るように修正)
  const handleSearchResult = (resultData, keyword) => {
    setSearchResult(resultData);
    setSearchKeyword(keyword || ''); // ハイライト用にキーワードを保存
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header />

      {/* ヒーローセクション */}
      <HeroSection onFetch={(id) => fetchComments(id)} loading={loading} />

      {/* 制限モーダルの配置 */}
      <LimitModal 
        isOpen={showLimitModal} 
        onClose={() => setShowLimitModal(false)} 
      />

      {/* ★ 追加: ログインモーダルの配置 */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />

      {/* エラー表示 */}
      {error && !loading && !apiData && (
        <div className="container mx-auto px-4 mt-8">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-center max-w-2xl mx-auto">
            <p className="font-bold">⚠️ エラーが発生しました</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* 結果表示エリア ★ apiDataがある時 OR loading中 の両方で表示する */}
      {(apiData || loading) && (
        <section 
          ref={resultRef} 
          className="py-16 bg-gradient-to-b from-white to-blue-50 min-h-[600px]"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-700">📊 分析結果</h2>
                <button 
                  onClick={() => { 
                      setApiData(null); 
                      setLoading(false);
                      setSearchKeyword('');
                      window.scrollTo({top:0, behavior:'smooth'}); 
                  }}
                  className="text-sm text-gray-500 hover:text-red-500"
                >
                  ✕ 閉じる
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                {/* ★ ローディング中はスケルトンを表示、データ取得後はコンテンツを表示 */}
                {loading ? (
                    <SkeletonCommentDisplay />
                ) : (
                    <>
                        {/* ★ 動画プレーヤー: データのvideo_idがあれば表示 */}
                        {apiData?.video_id && (
                          <YouTubePlayer videoId={apiData.video_id} />
                        )}

                        {apiData.status === 'success' && apiData.comments && (
                          <CommentSearch 
                            comments={apiData.comments} 
                            onSearchResult={handleSearchResult} 
                          />
                        )}
                        
                        <CommentDisplay 
                          // キーワードをapiDataの一部として擬似的に渡す（CommentDisplay側の修正に合わせる）
                          apiData={{ ...apiData, currentKeyword: searchKeyword }} 
                          searchResultJson={searchResult} 
                        />

                        {/* 「さらに読み込む」ボタン */}
                        {nextPageToken && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => fetchComments(apiData.video_id, nextPageToken)}
                                    disabled={isLoadingMore}
                                    className={`
                                        px-8 py-3 rounded-full font-bold text-white shadow-md transition-all transform hover:-translate-y-0.5
                                        ${isLoadingMore 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg hover:from-blue-600 hover:to-indigo-700'
                                        }
                                    `}
                                >
                                    {isLoadingMore ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            読み込み中...
                                        </span>
                                    ) : (
                                        'さらにコメントを読み込む'
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
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