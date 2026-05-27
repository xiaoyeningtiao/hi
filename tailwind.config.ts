import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 主色系：温柔深夜
        cream: {
          50: '#FBFAF6',
          100: '#F6F3EB',
          200: '#EDE8DC',
        },
        // 浅粉
        blush: {
          50: '#FFF5F7',
          100: '#FFE5EC',
          200: '#FFD0DC',
          300: '#F4B6C2',
          400: '#E89AA8',
        },
        // 雾蓝
        mist: {
          50: '#F2F7FA',
          100: '#E2ECF3',
          200: '#CDDCE8',
          300: '#A8C2D4',
          400: '#7FA3BC',
        },
        // 雾紫（强调色）
        haze: {
          400: '#9B8AA6',
          500: '#7E6E89',
          600: '#5F526B',
        },
        ink: {
          50: '#F8F7F4',
          400: '#8A8590',
          500: '#6B6670',
          700: '#3F3B45',
          900: '#1F1C24',
        },
      },
      fontFamily: {
        // 在 globals.css 里通过 @import + CSS 变量使用
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 2px 24px -8px rgba(155, 138, 166, 0.12), 0 1px 4px -1px rgba(155, 138, 166, 0.06)',
        'float': '0 16px 48px -16px rgba(155, 138, 166, 0.18), 0 4px 12px -2px rgba(155, 138, 166, 0.08)',
        'glow-blush': '0 0 60px -10px rgba(244, 182, 194, 0.4)',
        'glow-mist': '0 0 60px -10px rgba(168, 194, 212, 0.4)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'breathe': 'breathe 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'orb-drift': 'orbDrift 20s ease-in-out infinite',
        'typing': 'typing 1.4s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        orbDrift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -20px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 30px) scale(0.95)' },
        },
        typing: {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%': { transform: 'translateY(-6px)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
