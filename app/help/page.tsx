'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Atmosphere } from '@/components/Atmosphere';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ExternalLink, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import type { HelpCard } from '@/lib/types';

const HELP_CARDS: HelpCard[] = [
  {
    id: 'h-pcr',
    category: '实验方法',
    question: 'qPCR 一直跑不出来，是不是我有问题',
    shortAnswer: '不是你的问题。先排除 primer 二聚体（看 melting curve），再检查 RNA 完整性。如果还是不行，把所有试剂的开封日期和批次记下来——80% 的问题在试剂上。',
    douyinUrl: 'https://www.douyin.com/',
  },
  {
    id: 'h-paper-revise',
    category: '论文写作',
    question: '导师说"重写"，但我不知道哪里要改',
    shortAnswer: '别急着重写。先打印出来读三遍：第一遍看逻辑（每段在说什么），第二遍看连接（段落之间通不通），第三遍看用词。多数"重写"的意思是"逻辑没立住"，不是文字问题。',
    douyinUrl: 'https://www.douyin.com/',
  },
  {
    id: 'h-blind',
    category: '答辩盲审',
    question: '盲审格式怎么自查',
    shortAnswer: '三件套：致谢里别出现学校 / 导师名（盲审版需删掉）；正文里别出现"本校"、"本人导师"；参考文献别只引导师自己的。三件做完，格式就过 90% 了。',
  },
  {
    id: 'h-supervisor',
    category: '导师沟通',
    question: '导师总让改，我快崩了',
    shortAnswer: '问自己一个问题：他改的是逻辑、文字、还是方向？如果是方向，立刻面对面聊，文字沟通会越改越偏。如果是文字，就每天改一小时，给自己设上限。',
  },
  {
    id: 'h-gpt',
    category: '工具与AI',
    question: 'GPT / 通义这些怎么用才不"AI 味"',
    shortAnswer: '把 AI 当成"高级搜索"和"语法检查器"，不要让它"写"——让它"问你问题"。比如让它说"你这段想表达什么？我帮你提五个问题，你回答完再合起来"。',
    douyinUrl: 'https://www.douyin.com/',
  },
  {
    id: 'h-lit',
    category: '论文写作',
    question: '文献综述写不出来怎么办',
    shortAnswer: '不是你没读够，是你没分类。挑 30 篇核心，按"问题—方法—结论"做表格，画一张时间线。综述就是讲一个"领域怎么走过来的"故事，不是文献的堆砌。',
  },
  {
    id: 'h-defense',
    category: '答辩盲审',
    question: '答辩前一晚失眠怎么办',
    shortAnswer: '我那晚也是。第二天还是过了。建议：(1) 别再看 ppt 了；(2) 把"自我介绍"那 30 秒背到不用脑子；(3) 答辩开始前去厕所深呼吸 1 分钟。剩下的交给当下。',
  },
  {
    id: 'h-stuck',
    category: '实验方法',
    question: '实验卡了三个月没进展',
    shortAnswer: '先停一下。问自己：是技术问题（参数没调对）还是方向问题（路本身走不通）？如果是后者，越早跟导师摊牌越好——硬撑只会让心情更差，结果也不会变好。',
  },
];

const CATS = ['全部', '实验方法', '论文写作', '答辩盲审', '导师沟通', '工具与AI'] as const;

export default function HelpPage() {
  const [filter, setFilter] = useState<typeof CATS[number]>('全部');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === '全部'
    ? HELP_CARDS
    : HELP_CARDS.filter(c => c.category === filter);

  return (
    <main className="relative min-h-screen">
      <Atmosphere />
      <Nav />

      <section className="relative pt-36 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-haze-400/40" />
              <span className="eyebrow">note 02 · 自救室</span>
            </div>
            <h1 className="display-cn text-4xl md:text-6xl text-ink-900 leading-tight text-balance">
              科研自救室。
            </h1>
            <p className="mt-6 text-ink-500 text-base md:text-lg max-w-2xl leading-relaxed">
              这里收着一些"那时候要是有人告诉我就好了"的事。<br />
              短答案 + 抖音详细版。
            </p>
          </motion.div>

          {/* 分类筛选 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 flex flex-wrap gap-2"
          >
            {CATS.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-5 py-2 rounded-full text-sm transition-all ${
                  filter === c
                    ? 'bg-ink-900 text-cream-50'
                    : 'glass-soft text-ink-500 hover:text-ink-700'
                }`}
              >
                {c}
              </button>
            ))}
          </motion.div>

          {/* 卡片网格 */}
          <div className="mt-10 grid md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((card, i) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
                >
                  <button
                    onClick={() => setExpanded(expanded === card.id ? null : card.id)}
                    className="w-full text-left glass-soft rounded-3xl p-6 md:p-7 transition-all hover:shadow-float hover:-translate-y-0.5 group"
                  >
                    <div className="flex items-baseline justify-between mb-4 gap-3">
                      <span className="text-xs text-haze-500 tracking-wide">
                        · {card.category}
                      </span>
                      <span className="display-en italic text-xs text-ink-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        tap to read
                      </span>
                    </div>
                    <h3 className="display-cn text-lg md:text-xl text-ink-900 leading-snug mb-4 text-balance">
                      {card.question}
                    </h3>
                    <AnimatePresence initial={false}>
                      {expanded === card.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-ink-700 text-[15px] leading-relaxed mt-2 mb-4 text-pretty">
                            {card.shortAnswer}
                          </p>
                          {card.douyinUrl && (
                            <a
                              href={card.douyinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 text-xs text-haze-600 hover:text-haze-500 transition-colors"
                            >
                              抖音上看详细版 <ExternalLink size={11} />
                            </a>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {expanded !== card.id && (
                      <p className="text-ink-400 text-sm leading-relaxed line-clamp-2">
                        {card.shortAnswer}
                      </p>
                    )}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* 还没找到答案？引导聊聊 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 p-8 md:p-10 rounded-4xl bg-gradient-to-br from-blush-100/60 to-mist-100/60 relative overflow-hidden"
          >
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="display-cn text-2xl md:text-3xl text-ink-900 leading-snug">
                  没找到你要问的？
                </h3>
                <p className="mt-3 text-ink-500">
                  直接和小叶学姐聊聊，她会回你。
                </p>
              </div>
              <Link
                href="/chat/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink-900 text-cream-50 text-sm hover:shadow-float transition-all"
              >
                <MessageCircle size={14} />
                开始聊聊
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
