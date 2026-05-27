/**
 * API 接入配置中心
 * 
 * ⚠️ 静态导出部署到 GitHub Pages 时，环境变量必须以 NEXT_PUBLIC_ 开头才能在浏览器使用。
 * 但 API Key 绝不能放前端！正确做法：
 *   1. 阿里云函数计算 FC / Vercel Functions 部署一个代理后端，把真实 Key 保存在那里
 *   2. 前端环境变量只填代理 URL
 * 
 * 后续接入步骤：
 *   1. 把 .env.example 复制为 .env.local
 *   2. 填入你的代理 URL（不是阿里云原始 URL）
 *   3. 实现 lib/api/ 下的具体调用函数
 */

export const API_CONFIG = {
  // AI 对话代理（指向你的阿里云函数计算 endpoint）
  CHAT_PROXY_URL: process.env.NEXT_PUBLIC_CHAT_PROXY_URL || '',
  
  // 图像生成代理（通义万相）
  IMAGE_PROXY_URL: process.env.NEXT_PUBLIC_IMAGE_PROXY_URL || '',
  
  // 投稿后端（可以用 Supabase / 阿里云表格存储代理）
  STORIES_API_URL: process.env.NEXT_PUBLIC_STORIES_API_URL || '',
  
  // 默认模型
  CHAT_MODEL: process.env.NEXT_PUBLIC_CHAT_MODEL || 'qwen-max',
  IMAGE_MODEL: process.env.NEXT_PUBLIC_IMAGE_MODEL || 'wanx-v1',
};

// 是否启用真实 API（未配置时走 mock）
export const isApiConfigured = {
  chat: !!API_CONFIG.CHAT_PROXY_URL,
  image: !!API_CONFIG.IMAGE_PROXY_URL,
  stories: !!API_CONFIG.STORIES_API_URL,
};
