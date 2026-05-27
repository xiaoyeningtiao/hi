import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'hi, 我是小叶 — 读研路上有我陪伴',
  description: '一个面向科研生与考研人的情绪树洞与 AI 陪伴空间。深夜里，你不是一个人。',
  keywords: ['科研', '研究生', '考研', '树洞', '小叶', 'AI 陪伴'],
  openGraph: {
    title: 'hi, 我是小叶',
    description: '读研路上有我陪伴。',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FBFAF6',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="relative min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
