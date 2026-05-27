# hi, 我是小叶 ◜

一个面向科研生、考研人的情绪树洞 + AI 陪伴网站。  
*A quiet space for grad students, since 2026.*

---

## ✦ 这是什么

四个安静的房间：

| 模块 | 路径 | 功能 |
|---|---|---|
| **树洞** | `/stories` | 匿名投稿，"想对导师说但没发出去的话"，附「我也是」共鸣机制 |
| **自救室** | `/help` | 科研常见问题卡片 + 抖音视频对接 |
| **聊聊** | `/chat` | 和小叶学姐人格 AI 对话，支持深夜模式、流式输出 |
| **人生照** | `/photo` | 上传照片生成 Nature 封面 / 答辩 / 实验室等学术风格 + 朋友圈文案 |

---

## ✦ 技术栈

- **Next.js 14** + App Router
- **TypeScript**
- **Tailwind CSS** + 自定义设计 token
- **Framer Motion** 用于微动画
- **静态导出**（`output: 'export'`）部署到 GitHub Pages

---

## ✦ 本地运行

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

> 首次运行时所有 API 走 mock 模式（不需要配密钥也能完整体验）。

---

## ✦ 部署到 GitHub Pages

### 情况 A：用户主页仓库（推荐）

仓库名为 `xiaoyeningtiao.github.io`，部署后访问 `https://xiaoyeningtiao.github.io`：

1. 创建仓库 `xiaoyeningtiao.github.io`
2. 推送本项目代码到 `main` 分支
3. 仓库 Settings → Pages → Source 选择 **GitHub Actions**
4. 第一次 push 后会自动触发 `.github/workflows/deploy.yml` 构建并部署
5. 等绿勾后访问你的域名

### 情况 B：项目仓库

仓库名为其他（比如 `xiaoye-site`），部署后访问 `https://xiaoyeningtiao.github.io/xiaoye-site`：

修改 `.github/workflows/deploy.yml` 里的 `GITHUB_REPO: ''` 为 `GITHUB_REPO: 'xiaoye-site'`，其他步骤同上。

---

## ✦ 接入真实 AI（关键）

⚠️ **GitHub Pages 是纯静态托管，不能跑后端代码。** API Key 一旦写进前端就会泄露。

### 推荐方案：阿里云函数计算 FC 作代理

**1. 写一个函数（Node.js / Python）**

伪代码（Node.js）：

```javascript
// 阿里云函数计算 - 对话代理
exports.handler = async (req, resp) => {
  // CORS（很重要）
  resp.setHeader('Access-Control-Allow-Origin', 'https://xiaoyeningtiao.github.io');
  resp.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  resp.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return resp.send('');
  
  const body = JSON.parse(req.body);
  
  // 调用 DashScope（通义千问）
  const aliRes = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}`,  // 在 FC 环境变量里配置
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  
  // 流式转发
  resp.setHeader('Content-Type', 'text/event-stream');
  aliRes.body.pipe(resp);
};
```

**2. 在阿里云 FC 控制台**

- 创建函数 → 上传代码
- 环境变量里设置 `DASHSCOPE_API_KEY = 你的真实密钥`
- 触发器选 HTTP，拿到调用 URL

**3. 在本项目设置环境变量**

把 FC 的 URL 加到 GitHub 仓库的 Secrets：

```
Settings → Secrets and variables → Actions → New repository secret
NEXT_PUBLIC_CHAT_PROXY_URL = https://your-fc-endpoint.aliyuncs.com/chat
NEXT_PUBLIC_IMAGE_PROXY_URL = https://your-fc-endpoint.aliyuncs.com/image
```

下次 push 自动用真实 API。

### 图像生成（通义万相）

接入方式相同。万相 API 通常是异步任务：
- POST 提交任务 → 拿 `task_id`
- 轮询任务状态
- 完成后返回图片 URL

代理后端把这三步封装成一个同步调用即可。

### 树洞数据库

最省事的方案是 **Supabase**：

1. supabase.com 创建项目
2. 建表 `stories(id, title, content, category, status, created_at, resonance)`
3. RLS 策略：未登录只能 insert，approved 状态的可 select
4. 把 URL 写到 `NEXT_PUBLIC_STORIES_API_URL`

---

## ✦ 内容审核（必须！）

树洞和 AI 对话都建议接 **阿里云内容安全 API**（`green` 服务）。

在你的代理后端的请求拦截层调用，违规直接拒绝。

---

## ✦ 项目结构

```
xiaoye-website/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页
│   ├── globals.css         # 全局样式 & 字体
│   ├── stories/page.tsx    # 树洞
│   ├── help/page.tsx       # 自救室
│   ├── chat/page.tsx       # AI 聊天
│   └── photo/page.tsx      # 人生照
├── components/
│   ├── Atmosphere.tsx      # 渐变背景氛围
│   ├── Nav.tsx             # 导航栏
│   └── Footer.tsx
├── lib/
│   ├── config.ts           # API 配置中心
│   ├── types.ts            # 共享类型
│   └── api/
│       ├── chat.ts         # 对话 API + 小叶人格 prompt
│       ├── stories.ts      # 投稿 API
│       └── image.ts        # 图像生成 API + 风格定义
├── .github/workflows/
│   └── deploy.yml          # 自动部署
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## ✦ 设计语言

- **配色**：浅粉 `#FFE5EC` / 雾蓝 `#E2ECF3` / 米白 `#FBFAF6` / 雾紫 `#9B8AA6`
- **字体**：标题用霞鹜文楷（手写温度感）+ Fraunces（衬线英文）；正文用 Noto Sans SC
- **质感**：毛玻璃 + 渐变光晕 + 大圆角（最大 2.5rem）+ 颗粒噪点
- **动画**：呼吸、缓慢漂浮、staggered 入场

---

## ✦ 下一步可加的功能

- [ ] 共鸣墙：把"我也是"数最高的树洞做成首页轮播
- [ ] 学姐回信：定期挑投稿用 AI 生成温柔回信
- [ ] 时光信箱：给未来的自己写一封信
- [ ] 致谢解读器：粘贴致谢，AI 分析情感和关键人物
- [ ] 微信公众号同步发布

---

陪伴本身就是答案。
