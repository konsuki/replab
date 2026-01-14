// 1. Linkをインポート
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDetail, getList } from '../../../lib/microcms';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';

// 静的生成（SSG）のための関数
export async function generateStaticParams() {
  const { contents } = await getList();
  return contents.map((post) => ({
    id: post.id,
  }));
}

// 日付フォーマット関数
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// 詳細ページコンポーネント
export default async function BlogDetailPage({ params }) {
  // Next.js 15以降ではparamsをawaitする必要があります
  const { id } = await params;

  let post;
  try {
    post = await getDetail(id);
  } catch (e) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Header />

      <main className="flex-grow pt-24 pb-20">
        {/* コンテナの幅を少し狭めて読みやすくする (max-w-3xl -> max-w-2xl も選択肢ですが、一旦3xlで維持) */}
        <article className="container mx-auto px-4 max-w-3xl">
          
          {/* --- 記事ヘッダーエリア --- */}
          <div className="mb-12 text-center">
            {/* 日付 */}
            <div className="text-sm text-gray-500 mb-5 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {/* strokeWidthを追加 */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </div>

            {/* タイトル: サイズを大きくし、行間を調整 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-snug mb-8 tracking-tight">
              {post.title}
            </h1>

            {/* サムネイル画像 */}
            {post.thumbnail && (
              <div className="w-full aspect-video relative rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                <img
                  src={post.thumbnail.url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* --- 記事本文エリア --- */}
          <div
            className="
              /* ベースのテキストスタイル: 色を少し柔らかく、行間を広く取る */
              text-gray-800 leading-relaxed md:leading-loose
              
              /* 見出し H2: サイズアップ、上の余白を増やして区切りを明確に */
              [&_h2]:text-2xl md:[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-gray-200 [&_h2]:leading-tight
              
              /* 見出し H3: サイズアップ、H2との階層差をつける */
              [&_h3]:text-xl md:[&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:leading-snug
              
              /* 段落 P: 下の余白を広げてゆったりさせる */
              [&_p]:mb-8 [&_p]:text-base md:[&_p]:text-lg
              
              /* リスト: 余白を段落に合わせる */
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-8 [&_ul]:text-base md:[&_ul]:text-lg
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-8 [&_ol]:text-base md:[&_ol]:text-lg
              [&_li]:mb-3
              
              /* リンク: 色を少し落ち着いた青に */
              [&_a]:text-blue-700 [&_a]:underline [&_a]:decoration-blue-300 [&_a]:underline-offset-4 [&_a]:hover:text-blue-900 [&_a]:hover:decoration-blue-900 [&_a]:transition-colors
              
              /* 太字 */
              [&_strong]:font-bold [&_strong]:text-gray-900
              [&_b]:font-bold [&_b]:text-gray-900
              
              /* 引用: デザインを少しモダンに調整 */
              [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-6 [&_blockquote]:pt-6 [&_blockquote]:pb-1 [&_blockquote]:italic [&_blockquotje]:text-gray-600 [&_blockquote]:mb-8 [&_blockquote]:bg-gray-50 [&_blockquote]:rounded-r-lg
              
              /* 画像 */
              [&_img]:rounded-xl [&_img]:shadow-lg [&_img]:my-10 [&_img]:mx-auto
            "
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </article>

        {/* 記事下のナビゲーション */}
        <div className="container mx-auto px-4 max-w-3xl mt-20 pt-10 border-t border-gray-100 text-center">
          {/* 2. <a>タグを <Link>タグに変更 */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm hover:shadow-md"
          >
            {/* strokeWidthを追加 */}
            <svg className="w-5 h-5 transform rotate-180 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            記事一覧に戻る
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}