# 🏠 我们的小家

一个温暖的恋爱纪念单页应用。以俯视视角的「温馨小屋」地图为核心，两位小人在 6 个房间中自主巡游、与 17 件家具互动、触发双人对话。右侧抽屉面板承载恋爱日记、小剧场、留言板等内容。

> 在线预览：[Netlify 部署地址](https://homeofus.netlify.app)

## ✨ 功能

- **🏠 温馨小屋地图** — 6 个房间（卧室、书房、客厅、浴室、厨房、走廊），17 件emoji家具
- **👦👧 人物自主巡游** — 基于 runId 机制的稳定状态机，按「房间巡游」算法自主走动
- **🪑 家具互动** — 人物靠近家具时触发带冷却时间的互动对话
- **💑 双人互动** — 一人触发家具互动时，另一人走过来进行配对对话
- **🎯 点击操控** — 点击选中人物（高亮光效），再点击家具可操控走过去互动
- **📖 恋爱日记** — 按标签、家具筛选的日记列表，展开阅读，骨架屏加载
- **🎭 小剧场** — 根据真实回忆生成的虚构番外故事，可随机切换
- **💌 留言板** — 访客留言通过 Netlify Function 提交，含速率限制和 XSS 过滤
- **💬 半透明气泡** — 人物/家具互动时的半透明对话气泡
- **❤️ 心动动画** — 两人靠近且有互动时出现的爱心飘浮动画
- **📱 响应式布局** — 宽屏右侧抽屉，窄屏底部弹出
- **🛡️ 容错设计** — ErrorBoundary 全局异常捕获，Supabase 离线时自动回退 mock 数据

## 🛠 技术栈

| 技术 | 用途 |
|------|------|
| [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | 前端框架 |
| [Vite 8](https://vitejs.dev/) | 构建工具 |
| [Tailwind CSS 4](https://tailwindcss.com/) | 样式方案 |
| [Supabase](https://supabase.com/) | 数据库（日记 / 留言 / 小剧场） |
| [Netlify](https://www.netlify.com/) | 静态托管 + Serverless Functions |
| Netlify Functions | 留言提交 API（速率限制 + 安全过滤） |

## 📁 项目结构

```
OurHome/
├── netlify/
│   └── functions/
│       └── submit-message.ts   # Serverless Function：留言提交 API
├── sql/
│   └── schema.sql              # Supabase 建表 + RLS 策略
├── src/
│   ├── main.tsx                # 入口（含 ErrorBoundary）
│   ├── App.tsx                 # 根组件，管理全局状态
│   ├── index.css               # 全局样式 + 动画 + 玻璃态工具类
│   ├── config.ts               # 集中配置（纪念日、storage key 等）
│   │
│   ├── components/
│   │   ├── HomeMap.tsx         # 核心：地图主界面，协调人物与家具
│   │   ├── Character.tsx       # 人物组件（含选中光效）
│   │   ├── SpeechBubble.tsx    # 对话气泡（家具/人物/双人样式）
│   │   ├── Furniture.tsx       # 家具渲染
│   │   ├── HeartAnimation.tsx  # 爱心飘浮动画
│   │   ├── TopNav.tsx          # 顶部导航栏（左侧 🏠 固定，右侧按钮可滑动）
│   │   ├── SideDrawer.tsx      # 右侧/底部抽屉容器
│   │   ├── DiaryPanel.tsx      # 恋爱日记面板
│   │   ├── TheaterPanel.tsx    # 小剧场面板
│   │   ├── MessagePanel.tsx    # 留言板面板
│   │   ├── AboutPanel.tsx      # 关于我们（实时纪念日计数器）
│   │   └── ErrorBoundary.tsx   # 全局错误边界
│   │
│   ├── hooks/
│   │   └── useRandomWalk.ts    # 人物巡游算法（runId 机制防并行泄漏）
│   │
│   ├── data/
│   │   ├── rooms.ts            # 房间布局数据
│   │   ├── furniture.ts        # 家具数据 + FURNITURE_NAMES 映射
│   │   ├── interactions.ts     # 家具互动对话（单人 + 双人配对）
│   │   ├── phrases.ts          # 随机漫步对话
│   │   └── mockData.ts         # 离线 mock 数据
│   │
│   ├── services/
│   │   ├── diaryService.ts     # 日记数据服务（Supabase + mock 回退）
│   │   ├── theaterService.ts   # 小剧场数据服务
│   │   └── messageService.ts   # 留言数据服务（Function → Supabase → localStorage）
│   │
│   ├── lib/
│   │   └── supabase.ts         # Supabase 客户端初始化
│   │
│   └── types/
│       └── index.ts            # 全局类型定义
│
├── netlify.toml                # Netlify 部署 + Functions 路由配置
└── package.json
```

## 🚀 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（前端 + Functions）
netlify dev

# 或仅启动前端（留言提交回退到直接写入 Supabase）
npm run dev

# 生产构建
npm run build
```

开发服务器默认运行在 `http://localhost:5173`。

## 🔧 环境变量

在项目根目录创建 `.env` 文件：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> 不配置 Supabase 也可以正常运行——应用会自动回退到内置 mock 数据和 localStorage。

## 📦 部署到 Netlify

1. 在 [Supabase SQL Editor](https://supabase.com/dashboard) 中执行 `sql/schema.sql` 建表
2. 将项目推送到 GitHub
3. 在 Netlify 中导入仓库，自动识别 `netlify.toml` 配置
4. 在 Netlify **Site settings → Environment variables** 中添加：

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | 你的 Supabase 项目 URL |
| `VITE_SUPABASE_ANON_KEY` | 你的 Supabase 匿名密钥 |
| `SUPABASE_SERVICE_ROLE_KEY` | 你的 Supabase service_role 密钥（用于 Function 写入） |

5. Netlify 会自动构建并部署，之后每次推送代码都会自动更新

## 📄 数据库表

| 表名 | 说明 | RLS 策略 |
|------|------|---------|
| `diaries` | 恋爱日记 | 公开日记所有人可读 |
| `messages` | 留言板 | 所有人可读已审核留言；写入仅通过 Netlify Function（service_role key） |
| `theaters` | 小剧场 | 所有人可读 |

详细建表语句见 `sql/schema.sql`。

## 🏗️ 架构设计

```
浏览器（React SPA）
  ├─ 读取日记/剧场/留言 ──→ Supabase（anon key，RLS 保护）
  ├─ 提交留言 ──→ Netlify Function ──→ Supabase（service_role key）
  │               ├─ 速率限制（同 IP 每分钟 5 条）
  │               ├─ XSS 过滤
  │               └─ 长度校验
  └─ 离线回退 ──→ mockData + localStorage
```

- **人物巡游**：基于 `runId` 机制，每次新动作递增 ID，旧周期回调自动无害化退出，杜绝定时器泄漏导致的并行行走
- **数据服务**：Supabase → mock 数据 → localStorage 三级回退，确保离线可用
- **配置中心**：`config.ts` 统一管理纪念日日期、storage key、表名等常量

## 🐛 调试模式

按 `Ctrl + D` 开启调试模式，人物头顶实时显示当前生效的定时器数量。

## 📝 License

仅用于个人纪念用途。
