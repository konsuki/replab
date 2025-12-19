'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // 追加: メニュー開閉状態

  useEffect(() => {
    // マウント時にログイン状態をチェック
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    if (confirm('ログアウトしますか？')) {
      localStorage.removeItem('accessToken');
      setIsLoggedIn(false);
      setIsUserMenuOpen(false); // メニューも閉じる
      window.location.reload();
    }
  };

  // ユーザーメニューの切り替え
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* ロゴエリア (クリックでアプリのトップへ) */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-800 hover:opacity-80 transition">
          <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">AI</span>
          <span>CommentAnalyzer</span>
        </Link>

        {/* ナビゲーション (PC) */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
          {/* 
             修正ポイント: 
             セクションの実体は "src/app/LP/page.jsx" にあるため、
             "/LP#id名" と指定することで、どこからでもLPの該当箇所へ遷移・スクロールします。
          */}
          <Link href="/LP#features" className="hover:text-blue-600 transition">機能</Link>
          <Link href="/LP#usecases" className="hover:text-blue-600 transition">活用事例</Link>
          {/* 料金セクションなどがまだない場合は仮で "#" またはLPを指定 */}
          <Link href="/LP#pricing" className="hover:text-blue-600 transition">料金</Link>
        </nav>

        {/* 右側アクションエリア */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            // === ログイン中の表示 ===
            <div className="flex items-center gap-4">
              <button className="hidden sm:block text-xs font-bold text-blue-600 border border-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-50 transition">
                Pro Plan
              </button>

              <div className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-[2px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform active:scale-95"
                >
                   <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                     <span className="font-bold text-blue-600 text-sm">U</span>
                   </div>
                </button>

                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10 cursor-default" 
                      onClick={() => setIsUserMenuOpen(false)}
                    ></div>

                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-gray-500">ログイン中</p>
                        <p className="text-sm font-bold text-gray-800 truncate">user@example.com</p>
                      </div>
                      
                      <div className="py-1">
                        <Link 
                          href="/profile" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          プロフィール設定
                        </Link>
                        <Link 
                          href="/dashboard" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          ダッシュボード
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 py-1">
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                        >
                          ログアウト
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            // === 未ログイン時の表示 ===
            <div className="flex items-center gap-3">
              <Link href="/auth/signin">
                <button className="text-sm font-bold text-gray-600 hover:text-gray-900">
                  ログイン
                </button>
              </Link>
              <Link href="/auth/signin">
                <button className="text-sm font-bold bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition shadow-md hover:shadow-lg">
                  登録する
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};