'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '/stories/', label: '树洞', en: 'Notes' },
  { href: '/help/', label: '自救室', en: 'Help' },
  { href: '/chat/', label: '聊聊', en: 'Chat' },
  { href: '/photo/', label: '人生照', en: 'Frame' },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        <div className={`mx-auto max-w-6xl px-6 transition-all duration-500`}>
          <div className={`flex items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
            scrolled ? 'glass shadow-soft' : ''
          }`}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-blush-200 to-mist-200 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blush-300/50 to-mist-300/50 animate-breathe" />
                <span className="relative display-en text-haze-600 text-sm font-medium">叶</span>
              </div>
              <span className="display-cn text-ink-700 text-base tracking-wide">小叶</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((l) => {
                const active = pathname.startsWith(l.href.replace(/\/$/, ''));
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`relative px-4 py-2 text-sm transition-colors rounded-full ${
                      active ? 'text-haze-600' : 'text-ink-500 hover:text-ink-700'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 bg-blush-100/70 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-full hover:bg-blush-100/50 transition-colors"
              aria-label="菜单"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-x-0 top-20 z-40 mx-4 md:hidden"
        >
          <div className="glass rounded-3xl p-4 shadow-float">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between py-3 px-3 rounded-2xl hover:bg-blush-100/40 transition-colors"
              >
                <span className="text-ink-700">{l.label}</span>
                <span className="display-en text-xs text-ink-400">{l.en}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}
