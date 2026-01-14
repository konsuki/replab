import Link from 'next/link';
import { getList } from '../../lib/microcms';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

// 日付を「2023/10/01」形式に変換するヘルパー関数
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// メインのページコンポーネント（非同期関数として定義）
export default async function BlogListPage() {
  // 1. microCMSから記事一覧を取得
  // Step 3で作った getList 関数を使用します
  const { contents: posts } = await getList();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 共通ヘッダー */}
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-8">
          
          {/* ページタイトルエリア */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              ブログ / 最新情報
            </h1>
            <p className="text-gray-500">
              開発の裏話や、YouTube分析に役立つヒントをお届けします。
            </p>
          </div>

          {/* 記事一覧グリッド */}
          {posts.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              <p>記事がまだありません。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                >
                  {/* リンク全体を包む */}
                  <Link href={`/blog/${post.id}`} className="flex flex-col h-full group">
                    
                    {/* サムネイル画像エリア */}
                    <div className="relative w-full aspect-video bg-gray-200 overflow-hidden">
                      {post.thumbnail ? (
                        <img
                          src={post.thumbnail.url}
                          alt={post.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        // 画像がない場合のダミー表示
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                          <span className="text-sm font-bold">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* テキストコンテンツエリア */}
                    <div className="p-6 flex-grow flex flex-col">
                      {/* 日付 */}
                      <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDate(post.publishedAt)}
                      </div>

                      {/* タイトル */}
                      <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h2>

                      {/* 抜粋 (あれば表示) */}
                      {post.excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
                          {post.excerpt}
                        </p>
                      )}

                      {/* 「続きを読む」リンクっぽい見た目 */}
                      <div className="mt-auto pt-4 text-blue-600 text-sm font-bold flex items-center gap-1">
                        続きを読む
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 共通フッター */}
      <Footer />
    </div>
  );
}