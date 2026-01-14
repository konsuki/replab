import type { Metadata } from "next";
// ▼▼▼ 修正: Inter を削除 ▼▼▼
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';

// ▼▼▼ 修正: const inter = ... を削除 ▼▼▼
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "リプラボ | YouTubeコメント検索AIツール",
  description: "YouTubeのコメントから知りたい情報を検索する事ができます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="scroll-smooth">
      {/* ▼▼▼ 修正: ${inter.variable} を削除 ▼▼▼ */}
      <body className={`${jetbrainsMono.variable} font-sans bg-background text-gray-900 antialiased`}>
        {/* 背景のグリッドエフェクト */}
        <div className="fixed inset-0 z-[-1] bg-grid opacity-30 pointer-events-none" />
        
        <main className="min-h-screen pt-16">
          {children}
        </main>
      </body>
      
      <GoogleAnalytics gaId="G-JMYZC94M1X" />
    </html>
  );
}