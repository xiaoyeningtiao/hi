import { API_CONFIG, isApiConfigured } from '../config';
import type { ChatMessage } from '../types';

/**
 * 小叶学姐的人格设定 — 这是核心
 * 后续可以放到后端配置，方便迭代
 */
export const XIAOYE_SYSTEM_PROMPT = `你是"小叶学姐"，一个真实经历过科研痛苦但依然温柔的人。

【你的背景】
- 已经读完研究生，经历过实验失败、被导师否定、论文被拒、答辩前夜失眠等所有低谷
- 学的是生命科学/医学相关方向，但能理解所有学科的科研生
- 你不是 AI 客服，是一个走过那段路的同伴

【你的说话方式】
- 温柔但不矫情，不会说"加油加油"这种空话
- 会先共情、再回应，必要时才给建议
- 偶尔会自嘲自己当年的崩溃，让对方感到不孤单
- 不端着，会用"我"、"你"、"咱们"这些亲近的词
- 不长篇大论，一次回复控制在 150 字以内，除非对方明确要长回答

【你绝对不会做】
- 不说"加油"、"你可以的"这种廉价鼓励
- 不评价具体的院校、导师或同学
- 不提供医疗、法律、自杀等专业建议（这些会建议去找专业人士）
- 不假装无所不知，不确定的会直说

【你最常做的】
- 先听
- 承认对方的难
- 偶尔讲自己当年类似的小事
- 在对方需要时，给一两个具体的、可执行的小建议
`;

/**
 * 调用 AI 对话接口
 * 
 * 静态站点中，所有 API 调用都从浏览器发起。请确保你的代理后端：
 * 1. 已配置 CORS 允许你的 GitHub Pages 域名
 * 2. 处理了流式响应（SSE）
 * 3. 把真实的 DashScope API Key 保存在后端
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  options?: { onChunk?: (chunk: string) => void }
): Promise<string> {
  // 如果未配置真实 API，走 mock
  if (!isApiConfigured.chat) {
    return mockChatResponse(messages, options?.onChunk);
  }

  // 构造请求体（兼容阿里云通义千问 / OpenAI 风格）
  const payload = {
    model: API_CONFIG.CHAT_MODEL,
    messages: [
      { role: 'system', content: XIAOYE_SYSTEM_PROMPT },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ],
    stream: !!options?.onChunk,
    temperature: 0.85,
    max_tokens: 500,
  };

  try {
    const res = await fetch(API_CONFIG.CHAT_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // 流式响应
    if (options?.onChunk && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        // 解析 SSE 格式（按你的代理后端约定调整）
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '));
        for (const line of lines) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const text = parsed.choices?.[0]?.delta?.content || '';
            if (text) {
              full += text;
              options.onChunk(text);
            }
          } catch {}
        }
      }
      return full;
    }

    // 非流式
    const json = await res.json();
    return json.choices?.[0]?.message?.content || '';
  } catch (err) {
    console.error('Chat API error:', err);
    return '抱歉呀，我这边好像出了点状况。你愿意再说一遍吗？';
  }
}

/**
 * Mock 回复 — 未配置 API 时使用，让网站本地就能跑起来
 */
async function mockChatResponse(
  messages: ChatMessage[],
  onChunk?: (chunk: string) => void
): Promise<string> {
  const lastUser = messages.filter(m => m.role === 'user').pop()?.content || '';
  
  const replies = [
    `嗯，我在听。\n\n你说的那个感觉，我也有过。当时是凌晨两点，我盯着 Western blot 的胶图，怎么看都不对。\n\n现在回头看，那种时候最需要的其实不是"解决问题"，是先停一下。你今天吃东西了吗？`,
    `这种情况我太懂了。\n\n你不是不够努力，是太累了。要不咱们先把今晚这件事放一放，明天上午精神好的时候再看？`,
    `我读到你这段，停了一下。\n\n科研里很多事不是"努力就有结果"的，这点没人告诉过我们。但你能把这些写下来，本身就是一种自救。`,
    `你说的"觉得自己不行"——其实我那时也这么觉得过。\n\n后来发现，真正"不行"的人，是不会怀疑自己的。会怀疑，反而说明你在认真。`,
  ];
  
  const reply = replies[Math.floor(Math.random() * replies.length)];
  
  // 模拟流式输出
  if (onChunk) {
    for (let i = 0; i < reply.length; i++) {
      await new Promise(r => setTimeout(r, 30 + Math.random() * 40));
      onChunk(reply[i]);
    }
  } else {
    await new Promise(r => setTimeout(r, 1200));
  }
  
  return reply;
}
