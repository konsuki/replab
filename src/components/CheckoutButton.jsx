'use client'; // 必須

import React, { useState } from 'react';

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // FastAPIのエンドポイントを指定
      // ※開発環境のポート(8000)に合わせてください
      const response = await fetch('http://localhost:8000/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
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