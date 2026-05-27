// 类型定义：所有跨模块共享的类型

// 树洞投稿
export interface Story {
  id: string;
  title: string;
  content: string;
  category?: StoryCategory;
  createdAt: string;  // ISO
  resonance?: number; // "我也是" 计数
}

export type StoryCategory = '致谢分析' | '想对导师说' | '科研日常' | '迷茫与未来';

// AI 聊天
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
  pending?: boolean;  // 是否在等待回复
}

// 求助卡片
export interface HelpCard {
  id: string;
  category: '实验方法' | '论文写作' | '答辩盲审' | '导师沟通' | '工具与AI';
  question: string;
  shortAnswer: string;
  douyinUrl?: string;
}

// 学术照风格
export interface PhotoStyle {
  id: string;
  name: string;
  desc: string;
  prompt: string;  // 调用图像生成 API 时的 prompt 模板
}

// 通用 API 响应
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}
