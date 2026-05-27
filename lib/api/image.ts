import { API_CONFIG, isApiConfigured } from '../config';
import type { PhotoStyle } from '../types';

/**
 * 学术人生照风格定义
 * prompt 用于阿里云通义万相（wanx-v1）或图生图模型
 */
export const PHOTO_STYLES: PhotoStyle[] = [
  {
    id: 'nature-cover',
    name: 'Nature 封面风',
    desc: '把你放上世界顶刊的封面',
    prompt: 'magazine cover style, Nature journal aesthetic, scientific illustration with elegant typography, sophisticated lighting, editorial photography, masterpiece quality',
  },
  {
    id: 'defense',
    name: '硕士答辩风',
    desc: '答辩现场的庄重感',
    prompt: 'master degree defense ceremony, academic gown, university hall background, warm lighting, formal portrait, dignified atmosphere',
  },
  {
    id: 'lab-coat',
    name: '白大褂实验风',
    desc: '认真做实验的样子',
    prompt: 'scientist in white lab coat, modern laboratory background, scientific equipment, focused expression, professional documentary photography',
  },
  {
    id: 'campus-summer',
    name: '夏日校园风',
    desc: '毕业季的光晕',
    prompt: 'graduation portrait, sunlight through trees, campus background, nostalgic film photography, summer afternoon golden hour',
  },
  {
    id: 'poster-academic',
    name: '学术海报风',
    desc: '组会汇报海报的质感',
    prompt: 'academic poster design, scientific infographic style, grid layout, sans-serif typography, charts and diagrams aesthetic',
  },
  {
    id: 'wechat-literary',
    name: '朋友圈文艺风',
    desc: '温柔的、可以发圈的',
    prompt: 'soft film photography, dreamy atmosphere, pastel tones, literary aesthetic, gentle natural light, Japanese minimalism',
  },
];

/**
 * 生成对应文案（朋友圈用）
 */
export function getCaptionForStyle(styleId: string): string {
  const captions: Record<string, string[]> = {
    'nature-cover': [
      '今天的我也在为人类知识边界做一点点贡献。\n（虽然只是离心机里的一个 epp 管）',
      '把自己 P 上 Nature 封面这件事，也算是一种自我激励。',
    ],
    'defense': [
      '答辩前一晚做的梦。\n醒来后还是要面对真实的 ppt。',
      '如果一切顺利，明年这时候。',
    ],
    'lab-coat': [
      '白大褂下面其实穿着睡衣。\n科研生的秘密。',
      'PCR 跑通的那一刻，世界都温柔了。',
    ],
    'campus-summer': [
      '校园里走过的每一段路，后来都成了想念。',
      '夏天又来了。距离毕业还有 ___ 天。',
    ],
    'poster-academic': [
      'My research in one frame.',
      '当成果只能压缩成一张 A0 时。',
    ],
    'wechat-literary': [
      '深夜的实验室也有它温柔的时刻。',
      '今天，到这里。',
    ],
  };
  const list = captions[styleId] || ['今天的小日子。'];
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * 调用图像生成 API
 * 
 * 通义万相 API 一般是异步任务：
 *   1. POST 提交任务，拿到 task_id
 *   2. 轮询任务状态
 *   3. 完成后返回图片 URL
 * 
 * 这里假设你的代理后端已经封装好了同步返回。
 */
export async function generatePhoto(input: {
  imageBase64: string;     // 用户上传的原图（base64）
  styleId: string;
}): Promise<{ ok: boolean; imageUrl?: string; caption?: string; error?: string }> {
  const style = PHOTO_STYLES.find(s => s.id === input.styleId);
  if (!style) return { ok: false, error: '风格不存在' };

  const caption = getCaptionForStyle(input.styleId);

  // Mock：未配置 API 时返回原图 + 文案
  if (!isApiConfigured.image) {
    await new Promise(r => setTimeout(r, 2400));
    return {
      ok: true,
      imageUrl: input.imageBase64,
      caption,
    };
  }

  try {
    const res = await fetch(API_CONFIG.IMAGE_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: API_CONFIG.IMAGE_MODEL,
        image: input.imageBase64,
        prompt: style.prompt,
        // 通义万相图生图常用参数：
        // strength, n, size 等，按你的代理接口约定
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return {
      ok: true,
      imageUrl: json.imageUrl || json.output?.results?.[0]?.url,
      caption,
    };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}
