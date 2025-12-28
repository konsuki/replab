// src/components/CheckoutButton.jsx
'use client'; 

import React, { useState } from 'react';

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // ★ 1. ローカルストレージからトークンを取得
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        alert('ログインが必要です。');
        setLoading(false);
        return;
      }

      // 開発環境と本番環境でURLを切り替えるための環境変数があれば使う
      // なければ直接指定（開発中は localhost:8000）
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const response = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // ★ 2. 認証ヘッダーを追加
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