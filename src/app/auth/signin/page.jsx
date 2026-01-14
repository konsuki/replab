// src/app/auth/signin/page.jsx
'use client';

import React from 'react';
import Link from 'next/link';

// バックエンドのURLを環境変数から取得 (デフォルトはローカル環境)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function SignInPage() {

  // --- ログインハンドラ ---
  const handleGoogleLogin = () => {
    // バックエンドの認証開始エンドポイントへリダイレクト
    // これにより、ユーザーはGoogleの認証画面へ飛びます
    // バックエンド側で処理された後、/auth/success ページへ戻ってきます
    window.location.href = `${API_URL}/auth/login`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* 背景の装飾 (LPに合わせる) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl relative z-10 border border-gray-100">
        
        {/* ヘッダー部分 */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-2 font-bold text-2xl text-gray-800 mb-2">
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-lg">AI</span>
              <span>Replab</span>
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            アカウント作成 / ログイン
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            YouTube分析の新しい体験を始めましょう
          </p>
        </div>

        {/* 認証ボタンエリア */}
        <div className="mt-8 space-y-6">
          
          {/* Google ログインボタン */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 font-medium transition-all duration-200 transform hover:-translate-y-0.5"
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
            Googleアカウントで登録・ログイン
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">または</span>
            </div>
          </div>

          {/* 今後の拡張用のダミーEメール入力 (見た目のみ: 無効化状態) */}
          <div className="space-y-4 opacity-60 pointer-events-none select-none grayscale" aria-hidden="true">
             <input type="email" placeholder="メールアドレス" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50" disabled />
             <button className="w-full bg-gray-800 text-white py-2 rounded-md" disabled>メールアドレスで続行</button>
          </div>
          <p className="text-center text-xs text-gray-400">※現在はGoogleログインのみサポートしています</p>

        </div>

        {/* 利用規約など */}
        <p className="mt-4 text-center text-xs text-gray-500">
          登録することで、
          <Link href="/replab/legal" className="font-medium text-blue-600 hover:text-blue-500 underline ml-1">利用規約</Link>
          および
          <Link href="#" className="font-medium text-blue-600 hover:text-blue-500 underline ml-1">プライバシーポリシー</Link>
          に同意したものとみなされます。
        </p>
      </div>
    </div>
  );
}