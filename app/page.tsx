'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Atmosphere } from '@/components/Atmosphere';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ArrowUpRight, Moon } from 'lucide-react';

const modules = [
  {
    href: '/stories/',
    eyebrow: 'NOTE 01',
    title: '写给导师，但没发出去的话',
    desc: '把那些不能说的，悄悄放在这里。匿名树洞，没有评判。',
    accent: 'from-blush-100/80 to-blush-50/40',
    chip: '树洞 · 致谢分析',
  },
  {
    href: '/help/',
    eyebrow: 'NOTE 02',
    title: '科研自救室',
    desc: '实验做崩了、文献没头绪、盲审被难住了，先来这里坐一会。',
    accent: 'from-mist-100/80 to-mist-50/40',
    chip: '常见问题 · 抖音同步',
  },
  {
    href: '/chat/',
    eyebrow: 'NOTE 03',
    title: '和小叶学姐聊聊',
    desc: '不是客服，是一个走过那段路的人。能听你说话，也会回你。',
    accent: 'from-cream-100/80 to-cream-50/40',
    chip: 'AI 对话 · 深夜模式',
  },
  {
    href: '/photo/',
    eyebrow: 'NOTE 04',
    title: '你的学术人生照',
    desc: '把日常照片变成 Nature 封面、答辩留念、白大褂实验照。',
    accent: 'from-blush-100/60 via-mist-100/60 to-cream-100/60',
    chip: '生成式 · 朋友圈文案',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Home() {
  return (
    <main className="relative">
      <Atmosphere />
      <Nav />

      {/* ========== Hero ========== */}
      <section className="relative pt-40 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* 顶部小标 */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="h-px w-12 bg-haze-400/40" />
            <span className="eyebrow">a quiet space, since 2026</span>
          </motion.div>

          {/* 主标题 */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="display-cn text-5xl md:text-7xl lg:text-8xl leading-[1.15] text-ink-900 text-balance"
          >
            hi, 我是<span className="relative inline-block">
              <span className="relative z-10 px-2">小叶</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blush-200/60 to-mist-200/40 rounded-2xl -z-0 animate-breathe" />
            </span>
            <br />
            <span className="display-en italic text-ink-700">
              读研路上，
            </span>
            <span className="text-ink-700">有我陪伴。</span>
          </motion.h1>

          {/* 副标题 */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 text-lg md:text-xl text-ink-500 leading-relaxed max-w-2xl text-pretty"
          >
            实验失败、论文焦虑、导师压力、未来迷茫——
            <br className="hidden md:block" />
            这里你不是一个人。
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/chat/"
              className="group relative inline-flex items-center gap-2 px-7 py-4 rounded-full bg-ink-900 text-cream-50 text-sm tracking-wide transition-all hover:shadow-float hover:-translate-y-0.5"
            >
              <Moon size={14} className="opacity-70" />
              和小叶学姐聊聊
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/stories/"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-full glass text-ink-700 text-sm tracking-wide transition-all hover:shadow-soft hover:-translate-y-0.5"
            >
              投稿一段心事
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 opacity-60" />
            </Link>
            <Link
              href="/photo/"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-full text-ink-500 text-sm tracking-wide transition-all hover:text-ink-700"
            >
              生成学术人生照
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 opacity-60" />
            </Link>
          </motion.div>

          {/* 装饰：分隔的细线 + 小字 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.2 }}
            className="mt-24 flex items-center gap-4 text-ink-400"
          >
            <div className="h-px flex-1 bg-haze-400/15" />
            <span className="display-en italic text-sm">scroll, slowly</span>
            <div className="h-px flex-1 bg-haze-400/15" />
          </motion.div>
        </div>
      </section>

      {/* ========== 四模块入口 ========== */}
      <section className="relative px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          {/* section 小标 */}
          <div className="mb-12 flex items-baseline justify-between flex-wrap gap-4">
            <div>
              <div className="eyebrow mb-3">four rooms</div>
              <h2 className="display-cn text-3xl md:text-4xl text-ink-700">
                四个安静的房间。
              </h2>
            </div>
            <p className="text-ink-400 text-sm max-w-xs">
              每一个都为你准备好了。<br />可以从任何一个进入。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {modules.map((m, i) => (
              <motion.div
                key={m.href}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
              >
                <Link
                  href={m.href}
                  className="group relative block rounded-4xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
                >
                  {/* 渐变底色 */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${m.accent}`} />
                  {/* 玻璃层 */}
                  <div className="relative glass-soft p-8 md:p-10 min-h-[280px] flex flex-col justify-between transition-shadow duration-500 group-hover:shadow-float">
                    <div>
                      <div className="flex items-start justify-between mb-8">
                        <span className="eyebrow">{m.eyebrow}</span>
                        <div className="w-9 h-9 rounded-full bg-white/60 backdrop-blur flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
                          <ArrowUpRight size={15} className="text-ink-700" />
                        </div>
                      </div>
                      <h3 className="display-cn text-2xl md:text-[1.7rem] leading-snug text-ink-900 text-balance mb-4">
                        {m.title}
                      </h3>
                      <p className="text-ink-500 text-[15px] leading-relaxed text-pretty">
                        {m.desc}
                      </p>
                    </div>
                    <div className="mt-8 pt-5 border-t border-white/40 flex items-center gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-haze-400/60" />
                      <span className="text-xs text-ink-400 tracking-wide">{m.chip}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 氛围引言 ========== */}
      <section className="relative px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="display-cn text-2xl md:text-3xl text-ink-700 leading-relaxed text-balance"
          >
            &ldquo;实验做不出来的那个晚上，<br />
            我也是在台阶上坐了很久，<br />
            才回到工位继续改 protocol 的。&rdquo;
          </motion.blockquote>
          <div className="mt-8 display-en italic text-ink-400 text-sm">— 小叶</div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
