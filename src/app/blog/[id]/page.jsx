// src/app/blog/[id]/page.jsx
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
        {/* 
          【読みやすさの核心】
          max-w-2xl (約672px) に設定することで、noteのような「狭くて集中できる」幅を実現。
          これが一行の文字数を35〜40文字程度に抑え、目の移動を楽にします。
        */}
        <article className="container mx-auto px-4 max-w-2xl">
          
          {/* --- 記事ヘッダーエリア --- */}
          <div className="mb-12 text-center">
            {/* 日付 */}
            <div className="text-sm text-gray-500 mb-5 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </div>

            {/* タイトル */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-snug mb-8 tracking-tight">
              {post.title}
            </h1>

            {/* サムネイル画像 */}
            {/* note風にするなら、画像も角丸を少し控えめに(rounded-lg) */}
            {post.thumbnail && (
              <div className="w-full aspect-video relative rounded-lg overflow-hidden border border-gray-100 mb-10">
                <img
                  src={post.thumbnail.url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* --- 記事本文エリア --- */}
          {/* 
             prose-lg: 文字サイズを約18pxに設定（note準拠）。
             max-w-none: 親要素(max-w-2xl)いっぱいに広げるため、制限を解除。
          */}
          <div
            className="
              prose 
              prose-slate 
              max-w-none 
              prose-lg
            "
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </article>

        {/* 記事下のナビゲーション */}
        {/* コンテナ幅も本文に合わせて max-w-2xl に統一 */}
        <div className="container mx-auto px-4 max-w-2xl mt-20 pt-10 border-t border-gray-100 text-center">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm hover:shadow-md"
          >
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