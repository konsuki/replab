'use client';

import React from 'react';
import Link from 'next/link';

// サインインページと同様のAPI URL設定
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
// ※ 本番環境に合わせて page.jsx の YOUTUBE_API_URL のドメイン部分と同じにする必要がある場合は適宜書き換えてください
// 例: const API_URL = 'https://backend-904463184290.asia-northeast1.run.app';

export const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Googleログインハンドラ (signin/page.jsx から移植)
  const handleGoogleLogin = () => {
    // 現在のページ(トップページ)に戻ってこれるよう、バックエンド側でのリダイレクト設定が正しいか確認が必要ですが、
    // 基本的には /auth/login を叩けば認証フローが始まります。
    window.location.href = `${API_URL}/auth/login`;
  };

  return (
    // 背景のオーバーレイ (LimitModal.jsx を参考)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* モーダル本体 */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative transform transition-all scale-100 border border-gray-100">
        
        {/* 閉じるボタン */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* コンテンツエリア */}
        <div className="text-center space-y-6">
          
          {/* ロゴと見出し */}
          <div>
            <div className="inline-flex items-center justify-center gap-2 font-bold text-xl text-gray-800 mb-4">
              <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-2 py-1 rounded text-sm">AI</span>
              <span>リプラボ</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              以下からサインインしてください。
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              コメントを取得・分析するには、<br/>アカウント連携が必要です（無料）。
            </p>
          </div>

          {/* Google ログインボタン (signin/page.jsx からスタイルを少し調整して移植) */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 font-medium transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            onClick={handleGoogleLogin}
          >
            {/* Google SVG Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Googleで続行する
          </button>

          {/* 利用規約リンクなど */}
          <p className="text-xs text-gray-500">
            続行することで、
            <Link href="/replab/legal" className="text-blue-600 hover:underline mx-1">利用規約</Link>
            に同意したものとみなされます。
          </p>

          <button 
            onClick={onClose} 
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;