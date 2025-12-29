import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
// 1. ここに追加
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "リプラボ | YouTubeコメント検索AIツール",
  description: "YouTubeのコメントから知りたい情報を検索する事ができます。",
  verification: {
    google: 'Ij5m_Y0y8Ddt2MSkn8wDN8KwG1-mLp4rDOQAF9tR', 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background text-white antialiased`}>
        {/* 背景のグリッドエフェクト */}
        <div className="fixed inset-0 z-[-1] bg-grid opacity-30 pointer-events-none" />
        
        <main className="min-h-screen pt-16">
          {children}
        </main>
      </body>
      
      {/* 2. ここに追加 (G-XXXXXXXXXX は自分のIDに書き換えてください) */}
      <GoogleAnalytics gaId="G-JMYZC94M1X" />
    </html>
  );
}