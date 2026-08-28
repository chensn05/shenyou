# 神游 · ShenYou

> 神话与历史的沉浸式学习探索应用

**在线体验**: [https://cowork.xiaohongshu.com/s/myth-planet](https://cowork.xiaohongshu.com/s/myth-planet)

---

## 这是什么

「神游」是一个面向青少年的神话与历史学习 Web 应用。在 3D 地球上探索全球神话故事，沿时间轴穿越五千年历史，收集神话人物图鉴，养成专属萌宠伙伴。

## 功能

- **3D 地球** — 点击星球上的文化标记，进入对应神话世界
- **神话故事** — 102 篇，覆盖 52 个国家/文化圈，每篇标注原始出处
- **历史长河** — 115 篇，从先秦到现代，含高中政治/经济/文化史专题
- **神话图鉴** — 48 位神话人物，读完故事自动解锁
- **地心探险** — 6 大文化圈的分层宇宙观可视化
- **萌宠养成** — 15 个品种 + 4 个神话伙伴，阅读时长兑换食物
- **随堂测验** — 每篇故事/历史附 3 道选择题，即时反馈

## 技术栈

- **前端**: Vue 3 + Vite 5 + TypeScript
- **3D**: Three.js（地球渲染）
- **存储**: localStorage（进度/宠物状态本地持久化）
- **部署**: 纯静态 SPA，无后端依赖

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
# 产物在 dist/
```

## 项目结构

```
src/
├── data/          # 内容数据（故事/人物/历史/宠物）
├── pages/         # 页面组件（Landing/Home/Story/Core/Pets/Codex/History）
├── store/         # 状态管理（进度/宠物）
├── three/         # Three.js 地球场景
└── utils/         # 工具函数
```

## License

MIT
