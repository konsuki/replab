'use client'; // Header等のインタラクティブ機能を使うため client directive 推奨

import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function LegalPage() {
  return (
    // flexカラムにして、コンテンツが短くてもフッターを最下部に配置する構成
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* 共通ヘッダー */}
      <Header />

      {/* メインコンテンツエリア */}
      {/* pt-24: ヘッダーの高さ分(h-16) + 余白 を確保して重なりを防ぐ */}
      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white shadow overflow-hidden sm:rounded-lg">
          
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold leading-6 text-gray-900">
              特定商取引法に基づく表記
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              法律に基づく運営者情報の開示
            </p>
          </div>
          
          <div>
            <dl>
              {/* 販売事業者名 */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">販売事業者名</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  勝又 悠希
                </dd>
              </div>

              {/* 代表者 */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">代表者</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  勝又 悠希
                </dd>
              </div>

              {/* 所在地 */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">所在地</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  消費者からの請求がある場合、遅滞なく開示いたします。
                </dd>
              </div>

              {/* 電話番号 */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">電話番号</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  消費者からの請求がある場合、遅滞なく開示いたします。
                </dd>
              </div>

              {/* メールアドレス */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">メールアドレス</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  0yama3111yk2@gmail.com
                </dd>
              </div>

              {/* 販売価格 */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">販売価格</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  890円（税込）/月
                </dd>
              </div>

              {/* 必要料金 */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">商品代金以外の必要料金</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  インターネット接続料金その他の電気通信回線の通信に関する費用はお客様にて別途ご負担いただく必要があります。
                </dd>
              </div>

              {/* お支払方法 */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">お支払方法</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  クレジットカード決済（Stripe）
                </dd>
              </div>

              {/* 支払時期 */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">代金の支払時期</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  ご利用のクレジットカード会社の締め日や契約内容により異なります。
                </dd>
              </div>

              {/* 引渡時期 */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">商品の引渡時期</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  決済完了後、直ちにご利用いただけます。
                </dd>
              </div>

              {/* 返品・キャンセル */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">返品・キャンセル</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  商品の性質上、返品・交換はお受けできません。
                </dd>
              </div>

              {/* 動作環境 */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">動作環境</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  Google Chrome（最新版）を推奨します。
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>

      {/* 共通フッター */}
      <Footer />
    </div>
  );
}