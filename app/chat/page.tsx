'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Atmosphere } from '@/components/Atmosphere';
import { Nav } from '@/components/Nav';
import { Send, Moon, Sun } from 'lucide-react';
import { sendChatMessage } from '@/lib/api/chat';
import type { ChatMessage } from '@/lib/types';

// 预设对话场景 - 让用户进入更顺
const SCENES = [
  { label: '今天又被否定了', prompt: '今天导师又说我不行。我做了那么多，他还是觉得不够。' },
  { label: '实验做不下去', prompt: '实验已经卡了三周了，我不知道该怎么办。' },
  { label: '想转行又不甘心', prompt: '我有点想退学了，但又觉得三年都白费了。' },
  { label: '只是想说说话', prompt: '今天没什么事，只是想找人说说话。' },
];

const GREETING = `嗯，你来了。

不用着急说什么。先坐一会儿，或者直接打字也行——
我都在。`;

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'greet',
      role: 'assistant',
      content: GREETING,
      createdAt: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, streamingText]);

  // 自适应高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  async function send(text?: string) {
    const content = (text || input).trim();
    if (!content || thinking) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content,
      createdAt: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setThinking(true);
    setStreamingText('');

    let accumulated = '';
    const reply = await sendChatMessage([...messages, userMsg], {
      onChunk: (chunk) => {
        accumulated += chunk;
        setStreamingText(accumulated);
      },
    });

    setMessages(prev => [...prev, {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: reply,
      createdAt: Date.now(),
    }]);
    setStreamingText('');
    setThinking(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <main className={`relative min-h-screen transition-colors duration-700 ${
      darkMode ? 'bg-ink-900' : ''
    }`}>
      {!darkMode && <Atmosphere />}
      {darkMode && <DarkAtmosphere />}
      <Nav />

      <div className="relative max-w-3xl mx-auto px-4 md:px-6 pt-28 pb-32 min-h-screen flex flex-col">
        {/* 顶部小标题 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              darkMode ? 'bg-mist-100/10' : 'bg-gradient-to-br from-blush-200 to-mist-200'
            }`}>
              <span className={`display-en text-sm ${darkMode ? 'text-mist-200' : 'text-haze-600'}`}>叶</span>
            </div>
            <div>
              <h1 className={`display-cn text-lg leading-none ${darkMode ? 'text-cream-50' : 'text-ink-900'}`}>
                小叶学姐
              </h1>
              <p className={`text-xs mt-1 flex items-center gap-1.5 ${darkMode ? 'text-ink-400' : 'text-ink-400'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                在线
              </p>
            </div>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              darkMode ? 'bg-mist-100/10 text-cream-50' : 'glass-soft text-ink-500 hover:text-ink-700'
            }`}
            aria-label="切换深夜模式"
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </motion.div>

        {/* 消息流 */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-5 pb-4">
          {messages.map((m) => (
            <Bubble key={m.id} message={m} dark={darkMode} />
          ))}
          
          {/* 流式输出中 */}
          {streamingText && (
            <Bubble
              message={{
                id: 'streaming',
                role: 'assistant',
                content: streamingText,
                createdAt: Date.now(),
              }}
              dark={darkMode}
              streaming
            />
          )}
          
          {/* 思考中（流还没开始） */}
          {thinking && !streamingText && (
            <ThinkingIndicator dark={darkMode} />
          )}
        </div>

        {/* 场景预设（仅初始时显示） */}
        {messages.length === 1 && !thinking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-6"
          >
            <p className={`text-xs mb-3 ${darkMode ? 'text-ink-400' : 'text-ink-400'}`}>
              或者从这里开始 ——
            </p>
            <div className="flex flex-wrap gap-2">
              {SCENES.map(s => (
                <button
                  key={s.label}
                  onClick={() => send(s.prompt)}
                  className={`px-4 py-2 text-xs rounded-full transition-all ${
                    darkMode
                      ? 'bg-mist-100/10 text-cream-50 hover:bg-mist-100/20'
                      : 'glass-soft text-ink-700 hover:shadow-soft'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* 输入框 */}
        <div className={`sticky bottom-6 mt-4 rounded-3xl p-3 flex items-end gap-2 transition-all ${
          darkMode ? 'glass-dark' : 'glass shadow-float'
        }`}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            placeholder="说点什么…"
            className={`flex-1 bg-transparent outline-none resize-none text-[15px] leading-relaxed px-3 py-2 max-h-[140px] ${
              darkMode ? 'text-cream-50 placeholder:text-ink-400' : 'text-ink-900 placeholder:text-ink-400'
            }`}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || thinking}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30 ${
              darkMode
                ? 'bg-cream-50 text-ink-900'
                : 'bg-ink-900 text-cream-50'
            } hover:scale-105 active:scale-95`}
            aria-label="发送"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </main>
  );
}

// 聊天气泡
function Bubble({ message, dark, streaming }: { message: ChatMessage; dark: boolean; streaming?: boolean }) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] md:max-w-[75%] px-5 py-3.5 rounded-3xl text-[15px] leading-relaxed whitespace-pre-wrap text-pretty ${
          isUser
            ? dark
              ? 'bg-cream-50 text-ink-900 rounded-br-lg'
              : 'bg-ink-900 text-cream-50 rounded-br-lg'
            : dark
              ? 'glass-dark text-cream-50 rounded-bl-lg'
              : 'bg-white/70 backdrop-blur-md text-ink-900 rounded-bl-lg border border-white/60'
        }`}
      >
        {message.content}
        {streaming && (
          <span className="inline-block w-1 h-4 ml-0.5 align-middle bg-current animate-pulse" />
        )}
      </div>
    </motion.div>
  );
}

// 思考指示器
function ThinkingIndicator({ dark }: { dark: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className={`px-5 py-4 rounded-3xl rounded-bl-lg flex items-center gap-1.5 ${
        dark ? 'glass-dark' : 'bg-white/70 backdrop-blur-md border border-white/60'
      }`}>
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-cream-50' : 'bg-haze-400'}`}
            style={{
              animation: 'typing 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// 深色模式的氛围
function DarkAtmosphere() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-ink-900">
      <motion.div
        className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(155, 138, 166, 0.25) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(168, 194, 212, 0.18) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
