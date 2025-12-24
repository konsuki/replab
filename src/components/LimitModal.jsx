'use client';

import React from 'react';
import CheckoutButton from './CheckoutButton';

export const LimitModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* モーダル本体 */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative transform transition-all scale-100">
        
        {/* 閉じるボタン (右上の×) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* コンテンツ */}
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            🔒
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            利用回数制限に達しました
          </h3>
          <p className="text-gray-600 mb-6 text-sm">
            無料プランではコメント取得は4回までです。<br/>
            Pro版を購入して無制限に利用しましょう。
          </p>

          {/* 課金ボタン */}
          <div className="mb-6 flex justify-center">
            <CheckoutButton />
          </div>

          <button 
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default LimitModal;