// src/components/SkeletonCommentDisplay.jsx
import React from 'react';

const SkeletonComment = () => (
  <div className="flex gap-3 w-full animate-pulse mt-4">
    {/* アバター */}
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
    {/* コンテンツ */}
    <div className="flex-grow space-y-2">
      <div className="flex items-baseline gap-2">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded"></div>
      </div>
      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
);

export const SkeletonCommentDisplay = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl">
      <div className="flex items-center gap-2 mb-6">
         <div className="h-6 w-6 bg-green-200 rounded-full animate-pulse"></div>
         <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      {/* 統計エリアのスケルトン */}
      <div className="mb-8 p-4 border-l-4 border-gray-200 bg-gray-50 rounded-r-md flex gap-6">
        <div className="space-y-2">
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
            <div className="h-6 w-16 bg-gray-300 rounded"></div>
        </div>
        <div className="space-y-2">
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
            <div className="h-6 w-16 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* コメントリストのスケルトン (5件分表示) */}
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <SkeletonComment key={i} />
        ))}
      </div>
    </div>
  );
};