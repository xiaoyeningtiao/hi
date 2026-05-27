'use client';

import { motion } from 'framer-motion';

/**
 * 氛围背景：浮动的渐变光晕
 * 营造"深夜电子房间"的温柔氛围感
 */
export function Atmosphere() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* 浅粉光球 - 左上 */}
      <motion.div
        className="orb"
        style={{
          width: '520px',
          height: '520px',
          top: '-180px',
          left: '-120px',
          background: 'radial-gradient(circle, rgba(255, 208, 220, 0.7) 0%, rgba(255, 229, 236, 0.3) 50%, transparent 70%)',
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* 雾蓝光球 - 右上 */}
      <motion.div
        className="orb"
        style={{
          width: '600px',
          height: '600px',
          top: '-200px',
          right: '-180px',
          background: 'radial-gradient(circle, rgba(168, 194, 212, 0.5) 0%, rgba(226, 236, 243, 0.25) 50%, transparent 70%)',
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 30, -20, 0],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* 雾紫光球 - 下方 */}
      <motion.div
        className="orb"
        style={{
          width: '700px',
          height: '700px',
          bottom: '-300px',
          left: '20%',
          background: 'radial-gradient(circle, rgba(155, 138, 166, 0.25) 0%, rgba(155, 138, 166, 0.08) 50%, transparent 70%)',
        }}
        animate={{
          x: [0, -30, 40, 0],
          y: [0, -40, 20, 0],
        }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* 细微的网格纹理叠层 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(155, 138, 166, 0.06) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
          opacity: 0.5,
        }}
      />
    </div>
  );
}
