# Todo App - 个人任务管理

一个功能全面的个人任务管理 Web 应用，采用 Next.js 全栈架构。

## 功能特性

- 任务管理：创建、编辑、删除、状态切换
- 标签系统：自定义标签、颜色标记
- 日历视图：按日期查看任务
- 数据统计：完成率、趋势图表
- 搜索筛选：按状态、优先级、标签筛选
- 响应式：支持桌面和移动端

## 技术栈

- **前端**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **UI 组件**: shadcn/ui
- **状态管理**: Zustand
- **图表**: Recharts
- **日历**: react-big-calendar
- **数据库**: SQLite (Prisma ORM)
- **认证**: NextAuth.js

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

### 初始化数据库

```bash
npx prisma migrate dev
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
├── app/              # Next.js 页面路由
│   ├── (auth)/       # 认证相关页面
│   └── (main)/       # 主应用页面
│       ├── calendar/ # 日历视图
│       ├── settings/ # 设置页面
│       └── stats/    # 数据统计
├── components/       # React 组件
├── lib/              # 工具函数和数据库客户端
├── store/            # Zustand 状态管理
├── prisma/           # 数据库 Schema 和迁移
└── types/            # TypeScript 类型定义
```

## 部署

### Vercel 部署

1. Push 代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 完成部署

## License

MIT
