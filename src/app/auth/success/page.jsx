'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('認証情報を処理中...');

  useEffect(() => {
    // URLからトークンを取得
    const token = searchParams.get('token');

    if (token) {
      // 1. ローカルストレージに保存 (JWTの有効期限が切れるまでor削除するまで保持される)
      localStorage.setItem('accessToken', token);
      
      setStatus('ログイン成功！リダイレクトしています...');
      
      // 2. 少し待ってからトップページへ遷移
      setTimeout(() => {
        router.push('/'); 
      }, 1000);
    } else {
      setStatus('ログインエラー：トークンが見つかりませんでした。');
      // エラーの場合はログインページに戻すなどの処理
      setTimeout(() => {
         router.push('/auth/signin');
      }, 2000);
    }
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">ログイン処理中</h2>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
}

// Next.jsのApp RouterでuseSearchParamsを使う場合はSuspenseで囲む必要があります
export default function AuthSuccessPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}