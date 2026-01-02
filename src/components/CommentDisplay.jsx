// src/components/CommentDisplay.jsx
import React from 'react';

// --- ヘルパー関数: テキストのハイライト処理 ---
const highlightText = (text, keyword) => {
  if (!keyword || !text) return text;

  // HTMLタグを壊さないように簡易的なエスケープ処理が必要な場合もありますが、
  // YouTube APIのtextDisplayは既に安全なHTMLとして返ってくる前提で、
  // ここではキーワードの一致箇所のみを装飾します。
  
  // 正規表現でキーワード(大文字小文字無視)を検索
  // 特殊文字のエスケープは簡易的に省略していますが、実運用では必要に応じて追加してください
  const regex = new RegExp(`(${keyword})`, 'gi');
  
  // マッチした部分をモダンなスタイル付きの <mark> タグで置換
  return text.replace(regex, (match) => {
    return `<mark class="bg-yellow-100 text-orange-900 border-b-2 border-yellow-400 font-bold px-0.5 rounded-sm dark:bg-yellow-900/60 dark:text-yellow-100 dark:border-yellow-600">${match}</mark>`;
  });
};

// --- アバターコンポーネント (変更なし) ---
const Avatar = ({ name }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
  ];
  const colorIndex = name ? name.length % colors.length : 0;
  
  return (
    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${colors[colorIndex]} text-white flex items-center justify-center text-lg font-medium select-none shadow-sm`}>
      {initial}
    </div>
  );
};

// --- 個別のコメント表示コンポーネント ---
const YouTubeComment = ({ data, isReply = false, highlightKeyword = '' }) => {
  if (!data) return null;

  // テキストの正規化（HTMLタグ除去などが必要ならここで行う）
  // ここでは単純に小文字化してチェック
  const textContent = (data.text || "").toLowerCase();
  const keywordLower = highlightKeyword.toLowerCase();

  // キーワードが含まれているかチェック
  const hasKeyword = highlightKeyword && textContent.includes(keywordLower);
  
  // 「検索キーワードが指定されている」かつ「キーワードが本文に含まれていない」場合、
  // それはAIによって文脈で抽出されたコメントとみなす
  const isAiMatch = highlightKeyword && !hasKeyword;

  // 表示用HTMLの生成
  // キーワードがある場合はハイライト処理、なければそのまま
  const displayHtml = (highlightKeyword && hasKeyword)
    ? highlightText(data.text, highlightKeyword)
    : data.text;

  return (
    <div className={`flex gap-3 w-full group transition-all duration-300 ${isReply ? 'mt-4' : 'mb-6'}`}>
      {/* 左側: アバター */}
      <Avatar name={data.author} />

      {/* 右側: コンテンツエリア */}
      <div className="flex-grow min-w-0">
        {/* ヘッダー: 名前・日付・バッジ */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
            {data.author || 'Unknown User'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {data.date || '日付不明'}
          </span>
          
          {/* ★ AI抽出バッジ: AIが文脈で選んだ場合に表示 */}
          {isAiMatch && (
            <span className="ml-1 inline-flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm font-bold animate-in fade-in zoom-in duration-300">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
               AI Context
            </span>
          )}
        </div>

        {/* 本文 */}
        <div 
          className={`
            text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap mb-2 break-words
            ${isAiMatch ? 'bg-indigo-50/60 p-3 rounded-lg border border-indigo-100 dark:bg-gray-800 dark:border-gray-700' : ''}
          `}
          // dangerouslySetInnerHTMLを使用してHTML（ハイライト用のmarkタグ含む）を描画
          dangerouslySetInnerHTML={{ __html: displayHtml }} 
        />

        {/* アクションボタン (いいね、返信など) - 外観のみ */}
        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-xs font-medium opacity-70 group-hover:opacity-100 transition-opacity">
          {/* いいねボタン */}
          <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-1 py-0.5 rounded transition hover:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span>{data.likes > 0 ? data.likes : ''}</span>
          </div>

          {/* 低評価ボタン */}
          <div className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-1 py-0.5 rounded transition hover:text-gray-800">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform scale-x-[-1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
          </div>

          <div className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-0.5 rounded transition hover:text-gray-800">
            返信
          </div>
        </div>

        {/* 返信エリア (再帰表示) */}
        {data.replies && data.replies.length > 0 && (
          <div className="mt-3">
            {/* 「返信を表示」のようなトグルは省略し、インデントして表示 */}
            <div className="flex flex-col border-l-2 border-gray-100 dark:border-gray-700 pl-3">
              {data.replies.map((reply, idx) => (
                <YouTubeComment 
                  key={`${idx}-reply`} 
                  data={reply} 
                  isReply={true} 
                  highlightKeyword={highlightKeyword} // 返信にもハイライト情報を伝播
                />
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

  const totalComments = apiData.total_results || apiData.total_comments_on_video; 
  const fetchedCount = apiData.comments ? apiData.comments.length : 0;
  
  // ★ 親から渡された検索キーワードを取得 (apiDataに混入されている想定)
  const currentKeyword = apiData.currentKeyword || "";

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
    <div className="p-0 bg-white dark:bg-gray-800 rounded-xl duration-300">
      {/* 2. AI検索結果エリア */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
           <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">AI Analysis</span>
           検索結果
        </h2>
        
        {parsedSearchResult ? (
            <div className="bg-blue-50/40 dark:bg-gray-900/40 p-1 rounded-xl border border-blue-100 dark:border-gray-700">
                {parsedSearchResult.length > 0 ? (
                   <div className="space-y-0 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                      {parsedSearchResult.map((comment, index) => (
                          <React.Fragment key={`search-${index}`}>
                              <YouTubeComment 
                                  data={comment} 
                                  highlightKeyword={currentKeyword} // ★ キーワードを渡す
                              />
                              {/* 最後の要素以外に区切り線を入れる */}
                              {index < parsedSearchResult.length - 1 && (
                                <div className="border-b border-gray-100 dark:border-gray-700 my-4"></div>
                              )}
                          </React.Fragment>
                      ))}
                   </div>
                ) : (
                   <div className="p-8 text-center text-gray-500">
                      <p>キーワード「<span className="font-bold text-gray-700">{currentKeyword}</span>」に一致するコメントは見つかりませんでした。</p>
                   </div>
                )}
            </div>
        ) : (
            <div className="text-gray-400 dark:text-gray-500 text-sm italic border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl mb-4 p-8 text-center bg-gray-50 dark:bg-gray-800/50">
                上の検索ボックスからキーワードを入力すると、AIによる抽出結果がここに表示されます。
            </div>
        )}
      </div>

      {/* 3. 全コメントリストエリア */}
      <h3 className="text-xl font-bold mt-10 mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 pb-2">
        全コメント一覧 <span className="text-sm font-normal text-gray-500 ml-2">({fetchedCount} 件表示中)</span>
      </h3>
      
      <div className="space-y-2">
        {apiData.comments && apiData.comments.length > 0 ? (
          apiData.comments.map((comment, index) => (
            <YouTubeComment 
                key={`all-${index}`} 
                data={comment} 
                // 全リスト側でもハイライトさせたい場合はここにも渡す
                // highlightKeyword={currentKeyword} 
            />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 p-4">コメントがありません。</p>
        )}
      </div>
    </div>
  );
};

export default CommentDisplay;