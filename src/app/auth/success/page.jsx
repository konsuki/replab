'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * 環境変数からベースパスを取得
 * 開発環境 (localhost:3000) では空文字 ""
 * 本番環境 (GitHub Pages) では "/my-gh-pages-test" と設定します
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('認証情報を処理中...');

  useEffect(() => {
    // URLのクエリパラメータからトークンを取得
    const token = searchParams.get('token');

    if (token) {
      // 1. ローカルストレージにトークンを保存
      localStorage.setItem('accessToken', token);
      
      setStatus('ログイン成功！リダイレクトしています...');
      
      // 2. 少し待ってからトップページへ遷移
      // GitHub Pagesの場合は /my-gh-pages-test/ へ移動するように構成
      setTimeout(() => {
        router.push(`${BASE_PATH}/`); 
      }, 1000);
    } else {
      setStatus('ログインエラー：トークンが見つかりませんでした。');
      
      // エラーの場合はログインページに戻す
      setTimeout(() => {
         router.push(`${BASE_PATH}/auth/signin`);
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

/**
 * Next.jsのApp Routerでは、useSearchParamsを使うコンポーネントは
 * Suspense境界で囲む必要があります。
 */
export default function AuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-10 text-center text-gray-500">読み込み中...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}