import React, { useState } from 'react';

// --- サブコンポーネント定義 ---

// 1. アバター表示 (画像がないため、名前の頭文字を表示)
const Avatar = ({ name }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  // ランダムっぽく見えるが固定の色を割り当てる（簡易的）
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
  ];
  const colorIndex = name ? name.length % colors.length : 0;
  
  return (
    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${colors[colorIndex]} text-white flex items-center justify-center text-lg font-medium select-none`}>
      {initial}
    </div>
  );
};

// 2. 1つのコメントを表示するコンポーネント
const YouTubeComment = ({ data, isReply = false }) => {
  if (!data) return null;

  return (
    <div className={`flex gap-3 w-full ${isReply ? 'mt-4' : 'mb-6'}`}>
      {/* 左側: アバター */}
      <Avatar name={data.author} />

      {/* 右側: コンテンツエリア */}
      <div className="flex-grow">
        {/* ヘッダー: 名前と日付 */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {data.author || 'Unknown User'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 cursor-pointer">
            {data.date || '日付不明'}
          </span>
        </div>

        {/* 本文: 改行を維持して表示 */}
        <div 
          className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap mb-2"
          dangerouslySetInnerHTML={{ __html: data.text }} 
          // ↑ YouTube APIのtextDisplayはHTMLタグ(brやaタグ)を含むことがあるため
        />

        {/* アクションボタン (いいね、返信など) - 外観のみ */}
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-xs font-medium">
          {/* いいねボタン */}
          <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full -ml-1 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span>{data.likes > 0 ? data.likes : ''}</span>
          </div>

          {/* 低評価ボタン (YouTube仕様により数字は出ない) */}
          <div className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full transition">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform scale-x-[-1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
          </div>

          <div className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded-full transition">
            返信
          </div>
        </div>

        {/* 返信エリア (再帰的に表示) */}
        {data.replies && data.replies.length > 0 && (
          <div className="mt-2">
             {/* YouTubeのように「返信を表示」ボタンを作ることも可能だが、今回は全展開 */}
            <div className="flex flex-col">
              {data.replies.map((reply, idx) => (
                <YouTubeComment key={idx} data={reply} isReply={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// --- メインコンポーネント ---

export const CommentDisplay = ({ apiData, searchResultJson }) => {
  if (!apiData) return null;

  if (apiData.status === "error") {
    return (
      <div className="text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300 p-4 rounded-lg shadow-md">
        <p className="font-bold mb-2">API処理エラー</p>
        <p className="text-sm">メッセージ: {apiData.message || '不明なエラー'}</p>
        <p className="text-xs mt-2">詳細: {apiData.detail || '詳細はコンソールを確認してください。'}</p>
      </div>
    );
  }

  if (apiData.status !== "success") return null;

  const totalComments = apiData.total_comments_on_video;
  const fetchedCount = apiData.total_comments_fetched;
  let parsedSearchResult = null;

  if (searchResultJson) {
    try {
      parsedSearchResult = JSON.parse(searchResultJson);
    } catch (e) {
      console.error("検索結果のJSONパースに失敗:", e);
      parsedSearchResult = null;
    }
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transition-shadow duration-300">
      <p className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
        ✅ YouTubeデータ受信成功
      </p>

      {/* 1. 統計情報 */}
      <div className="mb-8 p-4 border-l-4 border-red-600 bg-gray-50 dark:bg-gray-700/30 rounded-r-md shadow-sm flex flex-wrap gap-6 items-center">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold">コメント総数</p>
          <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {totalComments !== undefined ? totalComments.toLocaleString() : '-'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold">取得済み</p>
          <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {fetchedCount !== undefined ? fetchedCount.toLocaleString() : '-'}
          </p>
        </div>
      </div>
      
      {/* 2. AI検索結果エリア */}
      <h2 className="text-xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
         <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">AI</span>
         AI検索結果
      </h2>
      
      {parsedSearchResult ? (
          <div className="bg-blue-50 dark:bg-gray-900/50 p-4 rounded-xl border border-blue-100 dark:border-gray-700">
              {parsedSearchResult.length > 0 ? (
                 <div className="space-y-2">
                    {parsedSearchResult.map((comment, index) => (
                        <YouTubeComment key={`search-${index}`} data={comment} />
                    ))}
                 </div>
              ) : (
                 <p className="text-gray-500 text-sm">キーワードに一致するコメントは見つかりませんでした。</p>
              )}
          </div>
      ) : (
          <div className="text-gray-400 dark:text-gray-500 text-sm italic border border-dashed border-gray-300 dark:border-gray-600 rounded-lg mb-4 p-4 text-center">
              検索を実行すると、ここにAIによる抽出結果が表示されます。
          </div>
      )}

      {/* 3. 全コメントリストエリア */}
      <h3 className="text-xl font-bold mt-10 mb-4 text-gray-800 dark:text-gray-100 ">
        コメント一覧 <span className="text-sm font-normal text-gray-500 ml-2">({apiData.comments?.length} 件)</span>
      </h3>
      
      <div className="space-y-2">
        {apiData.comments && apiData.comments.length > 0 ? (
          apiData.comments.map((comment, index) => (
            <YouTubeComment key={`all-${index}`} data={comment} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">コメントがありません。</p>
        )}
      </div>
    </div>
  );
};

export default CommentDisplay;