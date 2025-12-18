import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "YouTube Comment Analysis Tool | AI Powered",
  description: "Analyze YouTube comments instantly with Gemini AI.",
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
    </html>
  );
}