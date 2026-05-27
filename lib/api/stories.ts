import { API_CONFIG, isApiConfigured } from '../config';
import type { Story } from '../types';

/**
 * 提交一条树洞
 * 
 * 静态站点没有数据库，建议接入：
 * - Supabase（最简单，免费额度够用）
 * - 阿里云函数计算 + 表格存储 OTS
 * - Cloudflare D1
 * 
 * ⚠️ 投稿后端务必：
 * 1. 调用阿里云内容安全 API 做敏感词过滤
 * 2. 进入人工审核队列，审核通过后才公开展示
 * 3. 限流（同 IP 一天最多 N 条）
 */
export async function submitStory(input: {
  title: string;
  content: string;
  category?: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!isApiConfigured.stories) {
    // 本地 mock：写入 localStorage
    await new Promise(r => setTimeout(r, 600));
    const id = `local-${Date.now()}`;
    const story: Story = {
      id,
      title: input.title,
      content: input.content,
      category: input.category as Story['category'],
      createdAt: new Date().toISOString(),
      resonance: 0,
    };
    const existing = JSON.parse(localStorage.getItem('xiaoye-stories') || '[]');
    localStorage.setItem('xiaoye-stories', JSON.stringify([story, ...existing]));
    return { ok: true, id };
  }

  try {
    const res = await fetch(API_CONFIG.STORIES_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return { ok: true, id: json.id };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

/**
 * 获取树洞列表（已审核通过的）
 */
export async function getStories(): Promise<Story[]> {
  if (!isApiConfigured.stories) {
    if (typeof window === 'undefined') return SAMPLE_STORIES;
    const local = JSON.parse(localStorage.getItem('xiaoye-stories') || '[]') as Story[];
    return [...local, ...SAMPLE_STORIES];
  }

  try {
    const res = await fetch(`${API_CONFIG.STORIES_API_URL}?status=approved`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return SAMPLE_STORIES;
  }
}

/**
 * 共鸣（"我也是"）计数
 */
export async function resonateStory(id: string): Promise<void> {
  if (!isApiConfigured.stories) {
    const stored = JSON.parse(localStorage.getItem('xiaoye-resonance') || '{}');
    stored[id] = (stored[id] || 0) + 1;
    localStorage.setItem('xiaoye-resonance', JSON.stringify(stored));
    return;
  }
  await fetch(`${API_CONFIG.STORIES_API_URL}/${id}/resonate`, { method: 'POST' });
}

// 示范数据
const SAMPLE_STORIES: Story[] = [
  {
    id: 's-001',
    title: '今天又被退了',
    content: '改了 18 版的 introduction，今天导师说"重写吧"。从他办公室出来，我没回工位，去了一趟洗手间，但其实没有想哭，就是站在镜子前发呆了五分钟。',
    category: '想对导师说',
    createdAt: '2026-05-20T22:14:00Z',
    resonance: 142,
  },
  {
    id: 's-002',
    title: '关于致谢',
    content: '我想在致谢里写：感谢三年里所有忍住没冲我发火的人。包括我自己。',
    category: '致谢分析',
    createdAt: '2026-05-19T01:32:00Z',
    resonance: 287,
  },
  {
    id: 's-003',
    title: '凌晨两点的实验室',
    content: '今晚 PCR 又失败了。整层楼就剩我一个人，离心机的声音回响着。突然觉得也没什么好崩溃的——明天再来一次嘛。',
    category: '科研日常',
    createdAt: '2026-05-18T02:11:00Z',
    resonance: 89,
  },
  {
    id: 's-004',
    title: '想问问自己',
    content: '如果当时没读研，现在的我会更快乐吗？我不知道。但我知道，如果我没坚持到现在，我永远不会原谅自己。',
    category: '迷茫与未来',
    createdAt: '2026-05-17T23:45:00Z',
    resonance: 203,
  },
];
