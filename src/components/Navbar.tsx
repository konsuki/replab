"use client";

import Link from "next/link";
import { Bot, Github } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#030712]/60 backdrop-blur-md supports-[backdrop-filter]:bg-[#030712]/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-white/10 group-hover:bg-blue-500/20 transition-colors">
            <Bot className="w-6 h-6 text-blue-500 group-hover:text-blue-400" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            YT Analysis <span className="text-blue-500">AI</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <Link href="#features" className="hover:text-white transition-colors">特徴</Link>
          <Link href="#tech" className="hover:text-white transition-colors">技術スタック</Link>
          <Link href="#use-cases" className="hover:text-white transition-colors">活用シーン</Link>
        </div>

        {/* CTA & Social */}
        <div className="flex items-center gap-4">
          <Link 
            href="https://github.com" 
            target="_blank"
            className="hidden sm:flex p-2 hover:bg-white/5 rounded-full transition-colors text-white"
          >
            <Github className="w-5 h-5" />
          </Link>
          {/* ここを修正: text-black を明示 */}
          <button className="px-4 py-2 bg-white text-black font-semibold rounded-full text-sm hover:bg-gray-200 transition-colors">
            Launch App
          </button>
        </div>
      </div>
    </nav>
  );
}