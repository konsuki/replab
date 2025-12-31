// src/components/Footer.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // 追加: 現在のパスを取得するフック

export const Footer = () => {
  const pathname = usePathname(); // 現在のURLパスを取得

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* 製品 */}
          <div>
            <h4 className="font-bold mb-4 text-gray-100">Product</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><Link href="/#features" className="hover:text-white transition-colors">機能一覧</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">APIドキュメント</a></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">料金プラン</Link></li>
            </ul>
          </div>

          {/* リソース */}
          <div>
            <h4 className="font-bold mb-4 text-gray-100">Resources</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">ブログ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">コミュニティ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">ヘルプセンター</a></li>
            </ul>
          </div>

          {/* 会社・法的情報 */}
          <div>
            <h4 className="font-bold mb-4 text-gray-100">Company</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li>
                {/* 現在のページが '/replab/legal' の場合のみ黄色く、それ以外はグレーにする */}
                <Link 
                  href="/replab/legal" 
                  className={`transition-colors ${
                    pathname === '/replab/legal' 
                      ? 'text-yellow-400 font-bold' 
                      : 'hover:text-white'
                  }`}
                >
                  特定商取引法に基づく表記
                </Link>
              </li>
              <li><a href="/replab/legal" className="hover:text-white transition-colors">利用規約</a></li>
              <li><a href="#" className="hover:text-white transition-colors">プライバシー</a></li>
            </ul>
          </div>

          {/* SNSなど */}
          <div>
            <h4 className="font-bold mb-4 text-gray-100">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">𝕏</a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">🐙</a>
            </div>
          </div>
        </div>
         
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} YouTube Comment Analyzer. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with ❤️ using Next.js & Gemini</p>
        </div>
      </div>
    </footer>
  );
};