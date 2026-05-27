'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Atmosphere } from '@/components/Atmosphere';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Upload, Download, RefreshCw, Copy, Check, Sparkles } from 'lucide-react';
import { PHOTO_STYLES, generatePhoto, getCaptionForStyle } from '@/lib/api/image';

export default function PhotoPage() {
  const [imageData, setImageData] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>(PHOTO_STYLES[0].id);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ imageUrl: string; caption: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setImageData(e.target?.result as string);
    reader.readAsDataURL(file);
    setResult(null);
  }

  async function handleGenerate() {
    if (!imageData || generating) return;
    setGenerating(true);
    const res = await generatePhoto({ imageBase64: imageData, styleId: selectedStyle });
    setGenerating(false);
    if (res.ok && res.imageUrl) {
      setResult({ imageUrl: res.imageUrl, caption: res.caption || '' });
    }
  }

  function regenerateCaption() {
    setResult(r => r ? { ...r, caption: getCaptionForStyle(selectedStyle) } : null);
  }

  async function copyCaption() {
    if (!result?.caption) return;
    await navigator.clipboard.writeText(result.caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function reset() {
    setImageData(null);
    setResult(null);
  }

  return (
    <main className="relative min-h-screen">
      <Atmosphere />
      <Nav />

      <section className="relative pt-36 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* 标题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-haze-400/40" />
              <span className="eyebrow">note 04 · 人生照</span>
            </div>
            <h1 className="display-cn text-4xl md:text-6xl text-ink-900 leading-tight text-balance">
              你的学术人生照。
            </h1>
            <p className="mt-6 text-ink-500 text-base md:text-lg max-w-2xl leading-relaxed">
              一张日常照 + 一种风格，<br />
              生成可以发朋友圈的"另一种自己"。
            </p>
          </motion.div>

          {/* 主操作区 */}
          <div className="mt-16 grid lg:grid-cols-2 gap-8">
            {/* 左：上传 + 风格选择 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="space-y-6"
            >
              {/* 上传区 */}
              <div className="glass rounded-4xl p-6 md:p-8 shadow-soft">
                <p className="eyebrow mb-4">step 01</p>
                <h2 className="display-cn text-xl text-ink-900 mb-5">选一张照片</h2>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFile(e.target.files?.[0] || null)}
                  className="hidden"
                />

                {!imageData ? (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full aspect-[4/3] rounded-3xl border-2 border-dashed border-haze-400/30 bg-white/30 hover:bg-white/50 hover:border-haze-400/50 transition-all flex flex-col items-center justify-center gap-3 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blush-100 to-mist-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload size={16} className="text-haze-600" />
                    </div>
                    <p className="text-ink-500 text-sm">点击上传，或拖入此处</p>
                    <p className="text-ink-400 text-xs">JPG / PNG · 建议小于 5MB</p>
                  </button>
                ) : (
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageData} alt="uploaded" className="w-full h-full object-cover" />
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <span className="px-4 py-2 rounded-full bg-white/90 text-ink-900 text-sm">
                        换一张
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* 风格选择 */}
              <div className="glass rounded-4xl p-6 md:p-8 shadow-soft">
                <p className="eyebrow mb-4">step 02</p>
                <h2 className="display-cn text-xl text-ink-900 mb-5">选一种风格</h2>

                <div className="grid grid-cols-2 gap-2.5">
                  {PHOTO_STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStyle(s.id)}
                      className={`relative text-left p-4 rounded-2xl transition-all ${
                        selectedStyle === s.id
                          ? 'bg-ink-900 text-cream-50'
                          : 'bg-white/60 text-ink-700 hover:bg-white'
                      }`}
                    >
                      <div className="font-medium text-sm display-cn">{s.name}</div>
                      <div className={`text-xs mt-1 ${
                        selectedStyle === s.id ? 'text-cream-50/60' : 'text-ink-400'
                      }`}>
                        {s.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 生成按钮 */}
              <button
                onClick={handleGenerate}
                disabled={!imageData || generating}
                className="w-full py-5 rounded-3xl bg-ink-900 text-cream-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-float hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <Sparkles size={14} className="animate-spin" />
                    <span className="display-cn">正在生成…</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span className="display-cn">生成我的人生照</span>
                  </>
                )}
              </button>
            </motion.div>

            {/* 右：结果展示 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="glass rounded-4xl p-6 md:p-8 shadow-soft sticky top-28">
                <p className="eyebrow mb-4">step 03</p>
                <h2 className="display-cn text-xl text-ink-900 mb-5">结果</h2>

                <AnimatePresence mode="wait">
                  {!result && !generating && (
                    <motion.div
                      key="empty"
                      exit={{ opacity: 0 }}
                      className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-blush-50 to-mist-50 flex flex-col items-center justify-center text-center p-6"
                    >
                      <div className="display-cn text-ink-400 text-lg mb-2">还没有生成</div>
                      <div className="text-ink-400 text-sm">
                        上传一张照片，<br />然后让小叶把它变成另一种样子。
                      </div>
                    </motion.div>
                  )}

                  {generating && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-blush-100/60 via-mist-100/60 to-cream-100/60 flex flex-col items-center justify-center relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                      <div className="relative flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full border-2 border-haze-400/30 border-t-haze-500 animate-spin" />
                        <p className="display-cn text-ink-700">正在生成中…</p>
                        <p className="text-xs text-ink-400">通常需要 10–30 秒</p>
                      </div>
                    </motion.div>
                  )}

                  {result && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-float">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={result.imageUrl} alt="generated" className="w-full h-full object-cover" />
                      </div>

                      {/* 文案区 */}
                      <div className="mt-5 p-5 rounded-2xl bg-cream-50/80 border border-haze-400/10">
                        <div className="flex items-baseline justify-between mb-2">
                          <span className="eyebrow">朋友圈文案</span>
                          <button
                            onClick={regenerateCaption}
                            className="text-xs text-ink-400 hover:text-ink-700 inline-flex items-center gap-1 transition-colors"
                          >
                            <RefreshCw size={11} /> 换一句
                          </button>
                        </div>
                        <p className="display-cn text-ink-900 text-[15px] leading-relaxed whitespace-pre-wrap">
                          {result.caption}
                        </p>
                      </div>

                      {/* 操作按钮 */}
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          onClick={copyCaption}
                          className="py-3 rounded-2xl bg-white/60 hover:bg-white text-ink-700 text-sm transition-all inline-flex items-center justify-center gap-2"
                        >
                          {copied ? <><Check size={12} />已复制</> : <><Copy size={12} />复制文案</>}
                        </button>
                        <a
                          href={result.imageUrl}
                          download="xiaoye-photo.jpg"
                          className="py-3 rounded-2xl bg-ink-900 text-cream-50 text-sm transition-all hover:shadow-float inline-flex items-center justify-center gap-2"
                        >
                          <Download size={12} />保存图片
                        </a>
                      </div>

                      <button
                        onClick={reset}
                        className="w-full mt-3 py-2 text-xs text-ink-400 hover:text-ink-700 transition-colors"
                      >
                        生成另一张
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* 小贴士 */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center text-xs text-ink-400 max-w-md mx-auto"
          >
            照片仅用于本次生成，不会被保存或上传到任何公开位置。
          </motion.p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
