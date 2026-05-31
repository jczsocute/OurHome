# 🏠 我们的小家

一个温暖的恋爱纪念单页应用。以俯视视角的「温馨小屋」地图为核心，两位小人在房间中自主巡游、与家具互动、触发双人对话。右侧抽屉面板承载恋爱日记、小剧场、留言板等内容。

> 在线预览：[Netlify 部署地址](https://ourhome.netlify.app)

## ✨ 功能

- **🏠 温馨小屋地图** — 6 个房间（卧室、书房、客厅、浴室、厨房、走廊），像素风家具渲染
- **👦👧 人物自主巡游** — 两个小人按「房间巡游」算法自主走动：随机选房间 → 导航到房间内某点 → 局部徘徊 20~25 秒 → 进入下一个房间
- **🪑 家具互动** — 人物靠近家具时会触发互动，弹出与家具相关的气泡对话；每人有独立的互动冷却时间
- **💑 双人互动** — 当一人触发家具互动时，另一人会走过来，两人进行配对对话
- **🎯 点击操控** — 点击选中人物（高亮光效），再点击家具可让人物直接走过去互动
- **📖 恋爱日记** — 按标签、家具筛选的日记列表，支持展开阅读全文
- **🎭 小剧场** — 根据真实回忆生成的虚构番外故事，可随机切换
- **💌 留言板** — 访问者可以留下祝福，数据存储在 Supabase（待审核后展示）
- **💬 半透明气泡** — 人物/家具互动时显示的半透明对话气泡
- **❤️ 心动动画** — 两人靠近且有互动时出现的爱心飘浮动画
- **📱 响应式布局** — 宽屏右侧抽屉，窄屏底部弹出

## 🛠 技术栈

| 技术 | 用途 |
|------|------|
| [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | 前端框架 |
| [Vite 8](https://vitejs.dev/) | 构建工具 |
| [Tailwind CSS 4](https://tailwindcss.com/) | 样式方案 |
| [Supabase](https://supabase.com/) | 数据库（日记 / 留言 / 小剧场） |
| [Netlify](https://www.netlify.com/) | 静态托管部署 |

## 📁 项目结构

```
src/
├── main.tsx                   # 入口
├── App.tsx                    # 根组件，管理全局状态
├── index.css                  # 全局样式 + 动画 + 玻璃态工具类
│
├── components/
│   ├── HomeMap.tsx            # 核心：地图主界面，协调人物与家具
│   ├── Character.tsx          # 人物组件（含选中光效）
│   ├── SpeechBubble.tsx       # 对话气泡（支持家具/人物/双人样式）
│   ├── Furniture.tsx          # 家具渲染
│   ├── HeartAnimation.tsx     # 爱心飘浮动画
│   ├── TopNav.tsx             # 顶部导航栏
│   ├── SideDrawer.tsx         # 右侧/底部抽屉容器
│   ├── DiaryPanel.tsx         # 恋爱日记面板
│   ├── TheaterPanel.tsx       # 小剧场面板
│   ├── MessagePanel.tsx       # 留言板面板
│   └── AboutPanel.tsx         # 关于我们（纪念日计数器）
│
├── hooks/
│   ├── useRandomWalk.ts       # 人物巡游算法（状态机模式）
│   └── useLocalStorageMessages.ts  # localStorage 留言管理
│
├── data/
│   ├── rooms.ts               # 房间布局数据
│   ├── furniture.ts           # 家具数据（位置/大小/emoji）
│   ├── interactions.ts        # 家具互动对话（单人 + 双人配对）
│   ├── phrases.ts             # 随机漫步对话
│   └── mockData.ts            # 离线 mock 数据（Supabase 未配置时使用）
│
├── services/
│   ├── diaryService.ts        # 日记数据服务（Supabase + mock 回退）
│   ├── theaterService.ts      # 小剧场数据服务
│   └── messageService.ts      # 留言数据服务（Supabase + localStorage 回退）
│
├── lib/
│   └── supabase.ts            # Supabase 客户端初始化
│
└── types/
    └── index.ts               # 全局类型定义
```

## 🚀 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview
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

5. Netlify 会自动构建并部署，之后每次推送代码都会自动更新

## 📄 数据库表

| 表名 | 说明 | RLS 策略 |
|------|------|---------|
| `diaries` | 恋爱日记 | 公开日记所有人可读 |
| `messages` | 留言板 | 已审核的可读；任何人可插入 |
| `theaters` | 小剧场 | 所有人可读 |

详细建表语句见 `sql/schema.sql`。

## 📝 License

仅用于个人纪念用途。
