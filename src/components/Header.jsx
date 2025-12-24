'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import CheckoutButton from '../components/CheckoutButton';

// JWTトークンの中身(ペイロード)をデコードするヘルパー関数
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT:', e);
    return null;
  }
};

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: '', picture: '' });
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // メニューエリアの参照用Ref
  const menuRef = useRef(null);

  useEffect(() => {
    // 1. ログイン状態のチェック
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setIsLoggedIn(true);
        setUserInfo({
          email: decoded.email,
          picture: decoded.picture
        });
      } else {
        localStorage.removeItem('accessToken');
        setIsLoggedIn(false);
      }
    }

    // 2. 「メニュー外クリック」を検知して閉じる処理
    const handleClickOutside = (event) => {
      // メニューが開いており、かつクリックされた場所がmenuRef(ボタンやメニュー)の外側なら閉じる
      if (isUserMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    // ドキュメント全体にクリックイベントを設定
    document.addEventListener('mousedown', handleClickOutside);

    // クリーンアップ関数
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]); // isUserMenuOpenが変わるたびにイベントリスナーを更新

  const handleLogout = () => {
    if (confirm('ログアウトしますか？')) {
      localStorage.removeItem('accessToken');
      setIsLoggedIn(false);
      setUserInfo({ email: '', picture: '' });
      setIsUserMenuOpen(false);
      window.location.reload();
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* ロゴエリア */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-800 hover:opacity-80 transition">
          <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">AI</span>
          <span>CommentAnalyzer</span>
        </Link>

        {/* ナビゲーション (PC) */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
          <Link href="/LP#features" className="hover:text-blue-600 transition">機能</Link>
          <Link href="/LP#usecases" className="hover:text-blue-600 transition">活用事例</Link>
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

              {/* 
                 ユーザーアイコンとメニューを囲む親要素に ref={menuRef} を設定 
                 ここに含まれない場所をクリックするとメニューが閉じます
              */}
              <div className="relative" ref={menuRef}>
                {/* アイコンボタン */}
                <button 
                  onClick={toggleUserMenu}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-[2px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform active:scale-95"
                >
                   <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                     {/* Googleアイコン画像を表示 */}
                     {userInfo.picture ? (
                       <img 
                         src={userInfo.picture} 
                         alt="User Icon" 
                         className="w-full h-full object-cover"
                         referrerPolicy="no-referrer"
                       />
                     ) : (
                       <span className="font-bold text-blue-600 text-sm">U</span>
                     )}
                   </div>
                </button>

                {/* メニュー */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-500">ログイン中</p>
                      <p className="text-sm font-bold text-gray-800 truncate" title={userInfo.email}>
                        {userInfo.email || 'unknown user'}
                      </p>
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
                )}
              </div>
              <CheckoutButton/>
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