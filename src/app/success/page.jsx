import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">購入ありがとうございます！</h2>
        <p className="text-gray-600 mb-8">
          決済が完了しました。Pro機能が解放されています。
        </p>
        <Link 
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
        >
          ツールへ戻る
        </Link>
      </div>
    </div>
  );
}