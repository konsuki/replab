"use client";

import { motion } from "framer-motion";
import { Briefcase, LineChart, MessageCircle, ArrowRight, Video } from "lucide-react";

const useCases = [
  {
    role: "Video Marketers",
    title: "視聴者の潜在ニーズを発掘",
    description: "コメント欄は宝の山です。AI検索で「欲しい」「買いたい」「悩み」などのキーワードを抽出し、次の商品開発や企画のヒントを得られます。",
    icon: <Briefcase className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    delay: 0,
  },
  {
    role: "Content Creators",
    title: "ファンとのエンゲージメント強化",
    description: "「質問」や「リクエスト」だけを瞬時にフィルタリング。Q&A動画のネタ探しや、濃いファンへの返信漏れを防ぎ、コミュニティを活性化します。",
    icon: <Video className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    delay: 0.1,
  },
  {
    role: "Research Analysts",
    title: "競合動画の定性分析",
    description: "競合チャンネルの動画に寄せられた批判や要望を分析。数値（再生数）だけでは見えない、視聴者のリアルな感情をデータ化します。",
    icon: <LineChart className="w-6 h-6" />,
    color: "from-orange-500 to-red-500",
    delay: 0.2,
  },
];

export default function UseCases() {
  return (
    <section id="use-cases" className="py-24 relative">
      <div className="container mx-auto px-4">
        
        {/* --- ヘッダー --- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-medium tracking-wider uppercase mb-4 text-sm"
          >
            Target Audience
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            あらゆるプロフェッショナルの<br />
            <span className="text-white">分析時間を「ゼロ」に。</span>
          </motion.h3>
        </div>

        {/* --- カードグリッド --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {useCases.map((item, index) => (
            <motion.div
              key={item.role}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: item.delay }}
              className="group relative p-1 rounded-3xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              {/* ホバー時のグラデーション枠 */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10`} />
              
              <div className="h-full bg-[#0a0a0a] rounded-[22px] p-8 border border-white/10 group-hover:border-transparent transition-colors relative overflow-hidden">
                
                {/* 背景装飾 */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-10 blur-2xl rounded-full pointer-events-none`} />

                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
                      {item.role}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold mb-4 group-hover:text-primary-glow transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-1">
                    {item.description}
                  </p>

                  <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-white transition-colors cursor-pointer">
                    Read usage guide <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- 最終CTA (Call To Action) --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden text-center py-20 px-4"
        >
          {/* 背景の光るエフェクト */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-3xl" />
          <div className="absolute inset-0 bg-grid opacity-20" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-4xl font-bold mb-6">
              埋もれた声を聞く準備は<br />できていますか？
            </h3>
            <p className="text-gray-400 mb-10 text-lg">
              登録不要。URLを入力するだけで、<br />
              あなたの動画分析が劇的に変わります。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                無料で分析を始める
              </button>
              <button className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-white font-medium flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                お問い合わせ
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}