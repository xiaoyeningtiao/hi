'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Atmosphere } from '@/components/Atmosphere';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Heart, Send, Sparkles, Check } from 'lucide-react';
import { submitStory, getStories, resonateStory } from '@/lib/api/stories';
import type { Story, StoryCategory } from '@/lib/types';

const CATEGORIES: StoryCategory[] = ['想对导师说', '致谢分析', '科研日常', '迷茫与未来'];

export default function StoriesPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<StoryCategory>('想对导师说');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [resonated, setResonated] = useState<Set<string>>(new Set());

  useEffect(() => {
    getStories().then(setStories);
    const r = new Set<string>(JSON.parse(localStorage.getItem('xiaoye-my-resonance') || '[]'));
    setResonated(r);
  }, []);

  async function handleSubmit() {
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    const res = await submitStory({
      title: title.trim() || '没有标题',
      content: content.trim(),
      category,
    });
    setSubmitting(false);
    if (res.ok) {
      setSubmitted(true);
      setTimeout(() => {
        setTitle('');
        setContent('');
        setSubmitted(false);
        getStories().then(setStories);
      }, 3000);
    }
  }

  async function handleResonate(id: string) {
    if (resonated.has(id)) return;
    await resonateStory(id);
    const next = new Set(resonated);
    next.add(id);
    setResonated(next);
    localStorage.setItem('xiaoye-my-resonance', JSON.stringify([...next]));
    setStories(s => s.map(st => st.id === id ? { ...st, resonance: (st.resonance || 0) + 1 } : st));
  }

  return (
    <main className="relative min-h-screen">
      <Atmosphere />
      <Nav />

      <section className="relative pt-36 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* 标题区 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-haze-400/40" />
              <span className="eyebrow">note 01 · 树洞</span>
            </div>
            <h1 className="display-cn text-4xl md:text-6xl text-ink-900 leading-tight text-balance">
              写给导师，<br />但没发出去的话。
            </h1>
            <p className="mt-6 text-ink-500 text-base md:text-lg max-w-2xl leading-relaxed">
              你可以是匿名的。<br />
              你不需要写得漂亮。它只是被收起来，安静地放在这里。
            </p>
          </motion.div>

          {/* 投稿表单 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-14"
          >
            <div className="glass rounded-4xl p-6 md:p-8 shadow-soft">
              {/* 分类标签 */}
              <div className="flex flex-wrap gap-2 mb-5">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                      category === c
                        ? 'bg-ink-900 text-cream-50'
                        : 'bg-white/60 text-ink-500 hover:bg-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="给这段话一个名字（可选）"
                className="w-full bg-transparent text-xl md:text-2xl display-cn placeholder:text-ink-400/60 text-ink-900 outline-none mb-4 pb-3 border-b border-haze-400/15"
                maxLength={40}
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="把想说的，一点点写下来。这里没有评分，也没有人会催你。"
                rows={7}
                className="w-full bg-transparent text-base md:text-[17px] leading-relaxed text-ink-700 placeholder:text-ink-400/60 outline-none resize-none"
                maxLength={1000}
              />

              <div className="flex items-center justify-between mt-5 pt-5 border-t border-haze-400/10">
                <span className="text-xs text-ink-400">
                  {content.length} / 1000 · 匿名
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!content.trim() || submitting}
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink-900 text-cream-50 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-float hover:-translate-y-0.5"
                >
                  {submitting ? '正在收下…' : (
                    <>
                      投递
                      <Send size={14} className="opacity-70 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 投递成功提示 */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 flex items-center gap-3 px-5 py-4 rounded-2xl bg-blush-50/80 backdrop-blur"
                >
                  <div className="w-7 h-7 rounded-full bg-blush-200 flex items-center justify-center">
                    <Check size={14} className="text-haze-600" />
                  </div>
                  <p className="text-ink-700 display-cn">
                    你的情绪已经被收到。
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ============ 已收到的话 ============ */}
      <section className="relative px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <div className="eyebrow mb-2">已经收到的</div>
              <h2 className="display-cn text-2xl md:text-3xl text-ink-700">
                这里有 {stories.length} 段心事。
              </h2>
            </div>
            <Sparkles size={16} className="text-haze-400 animate-shimmer" />
          </div>

          <div className="space-y-4">
            {stories.map((s, i) => (
              <motion.article
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: Math.min(i * 0.05, 0.3) }}
                className="group glass-soft rounded-3xl p-6 md:p-8 transition-all hover:shadow-float hover:-translate-y-0.5"
              >
                <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 text-xs text-haze-500">
                    <span className="w-1 h-1 rounded-full bg-haze-400" />
                    {s.category || '未分类'}
                  </span>
                  <time className="display-en italic text-xs text-ink-400">
                    {formatDate(s.createdAt)}
                  </time>
                </div>
                {s.title && s.title !== '没有标题' && (
                  <h3 className="display-cn text-xl md:text-2xl text-ink-900 mb-3 leading-snug text-balance">
                    {s.title}
                  </h3>
                )}
                <p className="text-ink-700 leading-relaxed whitespace-pre-wrap text-[15px] md:text-base text-pretty">
                  {s.content}
                </p>
                <div className="mt-5 pt-4 border-t border-haze-400/10 flex items-center justify-between">
                  <button
                    onClick={() => handleResonate(s.id)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all ${
                      resonated.has(s.id)
                        ? 'bg-blush-100 text-haze-600'
                        : 'text-ink-400 hover:bg-blush-50'
                    }`}
                  >
                    <Heart
                      size={12}
                      fill={resonated.has(s.id) ? 'currentColor' : 'none'}
                      className="transition-all"
                    />
                    {resonated.has(s.id) ? '我也是了' : '我也是'} · {s.resonance || 0}
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return '刚刚';
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} 天前`;
  return `${d.getMonth() + 1}.${d.getDate()}`;
}
