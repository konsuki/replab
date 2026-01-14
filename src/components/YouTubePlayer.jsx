import React from 'react';

export const YouTubePlayer = ({ videoId }) => {
  if (!videoId) return null;

  return (
    <div className="w-full mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="relative w-full" style={{ paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <p className="mt-2 text-xs text-center text-gray-400">
        ※ 音声が出ない場合はミュートを解除してください
      </p>
    </div>
  );
};