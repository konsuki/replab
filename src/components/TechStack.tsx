"use client";

import { motion } from "framer-motion";
import { Code2, Cpu, Database, Globe, Layers, Lock, Server, Zap } from "lucide-react";

// 技術スタックデータ
const techItems = [
  {
    name: "Gemini 2.5 Flash",
    category: "AI Model",
    description: "高速推論と高いトークン効率を誇るGoogleの最新モデル。",
    icon: <Cpu className="w-6 h-6" />,
    color: "group-hover:text-blue-400",
    borderColor: "group-hover:border-blue-500/50",
    glow: "group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)]",
  },
  {
    name: "Next.js 16",
    category: "Frontend Framework",
    description: "App RouterとServer Actionsによる最新のアーキテクチャ。",
    icon: <Layers className="w-6 h-6" />,
    color: "group-hover:text-white",
    borderColor: "group-hover:border-white/50",
    glow: "group-hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]",
  },
  {
    name: "FastAPI",
    category: "Backend API",
    description: "Pythonベースの爆速非同期処理によるAPIバックエンド。",
    icon: <Zap className="w-6 h-6" />,
    color: "group-hover:text-teal-400",
    borderColor: "group-hover:border-teal-500/50",
    glow: "group-hover:shadow-[0_0_30px_-5px_rgba(45,212,191,0.4)]",
  },
  {
    name: "YouTube Data API v3",
    category: "Data Source",
    description: "公式APIを活用し、コメントデータを安全かつ確実に取得。",
    icon: <Database className="w-6 h-6" />,
    color: "group-hover:text-red-500",
    borderColor: "group-hover:border-red-500/50",
    glow: "group-hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.4)]",
  },
  {
    name: "React 19 & TS 5",
    category: "Core Library",
    description: "型安全性と最新のフック機能を活用した堅牢な実装。",
    icon: <Code2 className="w-6 h-6" />,
    color: "group-hover:text-cyan-400",
    borderColor: "group-hover:border-cyan-500/50",
    glow: "group-hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.4)]",
  },
  {
    name: "Google Cloud Run",
    category: "Infrastructure",
    description: "コンテナベースのサーバーレス環境でスケーラビリティを確保。",
    icon: <Server className="w-6 h-6" />,
    color: "group-hover:text-yellow-400",
    borderColor: "group-hover:border-yellow-500/50",
    glow: "group-hover:shadow-[0_0_30px_-5px_rgba(250,204,21,0.4)]",
  },
];

export default function TechStack() {
  return (
    <section id="tech" className="py-24 relative overflow-hidden">
      {/* 背景の装飾: コードのようなライン */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-tech" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="1" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-tech)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* --- ヘッダー --- */}
        <div className="mb-16 md:flex md:items-end md:justify-between">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-primary font-medium tracking-wider uppercase mb-4 text-sm"
            >
              Technology Stack
            </motion.h2>
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              最新技術で構築された、<br />
              <span className="text-white">堅牢かつ高速なアーキテクチャ。</span>
            </motion.h3>
          </div>
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm md:text-right mt-4 md:mt-0 max-w-xs"
          >
            現時点で最もモダンな開発環境を採用し、<br />
            パフォーマンスと信頼性を最大化しています。
          </motion.p>
        </div>

        {/* --- 技術カードグリッド --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {techItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative p-6 rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 ${item.borderColor} ${item.glow}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-white/5 transition-colors ${item.color}`}>
                  {item.icon}
                </div>
                <span className="text-xs font-mono text-gray-500 border border-white/10 px-2 py-1 rounded">
                  {item.category}
                </span>
              </div>
              
              <h4 className={`text-lg font-bold mb-2 transition-colors ${item.color}`}>
                {item.name}
              </h4>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* --- セキュリティ・信頼性バッジ (横長バー) --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-gradient-to-r from-surface to-surface/50 border border-white/10 p-1"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:px-12 rounded-xl bg-black/40 backdrop-blur-md">
            <div className="p-4 rounded-full bg-green-500/10 text-green-400">
              <Lock className="w-8 h-8" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-lg font-bold text-white mb-1">Enterprise Grade Security</h4>
              <p className="text-gray-400 text-sm">
                APIキーはバックエンドで厳重に管理。CORS設定により許可されたオリジンのみ通信を許可する安全設計です。
              </p>
            </div>
            <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {/* 架空のセキュリティ認証ロゴなどを並べるイメージ */}
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-bold">HTTPS</span>
              </div>
              <div className="flex items-center gap-1">
                 <div className="w-4 h-4 border-2 border-current rounded-full flex items-center justify-center text-[8px] font-bold">C</div>
                 <span className="text-xs font-bold">MIT License</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}