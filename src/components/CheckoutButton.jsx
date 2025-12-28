// src/components/CheckoutButton.jsx
'use client'; 

import React, { useState, useEffect } from 'react';

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);        // Proプランかどうか
  const [checkingStatus, setCheckingStatus] = useState(true); // 確認中かどうか

  // APIのベースURL設定
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // ★ 1. マウント時にユーザーのステータスを確認する
  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('accessToken');
      
      // ログインしていない場合はチェック不要（Proではない）
      if (!token) {
        setCheckingStatus(false);
        return; 
      }

      try {
        const response = await fetch(`${API_BASE}/api/user/status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.is_pro) {
            setIsPro(true); // Proならstateを更新
          }
        }
      } catch (error) {
        console.error('Status Check Error:', error);
      } finally {
        // 成功しても失敗しても確認終了とする
        setCheckingStatus(false);
      }
    };

    checkUserStatus();
  }, [API_BASE]); // API_BASEが変わることは稀ですが依存配列に入れておきます

  // ★ 2. 決済ボタンが押された時の処理
  const handleCheckout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        alert('ログインが必要です。');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status === 401) {
        alert('セッションが切れました。再ログインしてください。');
        setLoading(false);
        return;
      }
      
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('決済ページの取得に失敗しました。');
        setLoading(false);
      }
    } catch (error) {
      console.error('Checkout Error:', error);
      alert('エラーが発生しました。');
      setLoading(false);
    }
  };

  // --- 表示の制御 ---

  // ケースA: まだ確認中の場合（一瞬のチラつき防止のため非表示、またはローディングアイコン）
  if (checkingStatus) {
    return (
      <div className="opacity-50 text-sm text-gray-500 py-3 px-4">
        ...
      </div>
    );
  }

  // ケースB: 既にProプランの場合
  if (isPro) {
    // ボタンの代わりにバッジを表示
    return (
      <div className="flex items-center gap-2 text-green-600 font-bold border border-green-600 px-6 py-3 rounded-full bg-green-50 shadow-sm cursor-default select-none">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Pro Plan Active
      </div>
    );
    // ※ もし完全に消したい場合は return null; に書き換えてください
  }

  // ケースC: Proプランではない（または未ログイン）場合
  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? '処理中...' : '30日間無料で試す (その後 ¥890/月)'}
    </button>
  );
}