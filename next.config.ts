import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // 静的ファイルとして出力する設定
  output: 'export',

  // ★ここを追加：リポジトリ名を指定（先頭に / を忘れないこと）
  basePath: '/replab',

  // GitHub Pages用：画像最適化サーバーを無効化
  images: {
    unoptimized: true,
  },
};

export default nextConfig;