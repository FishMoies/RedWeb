# 指间长征路，青春云礼赞

<p align="center">
  <img src="./readmepublic/1.png" alt="项目预览" width="720" />
</p>

<p align="center">
  <a href="https://github.com/FishMoies/RedWeb/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?logo=github" alt="License" /></a>
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3.5-green?logo=vue.js" alt="Vue" /></a>
  <a href="https://gsap.com/"><img src="https://img.shields.io/badge/GSAP-3.15-88CE02?logo=greensock" alt="GSAP" /></a>
  <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite" alt="Vite" /></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Backend-Supabase-blueviolet?logo=supabase" alt="Supabase" /></a>
  <img src="https://img.shields.io/badge/Status-已停止维护-lightgrey" alt="Status" />
  <img src="https://img.shields.io/badge/Made%20with-%E2%9D%A4%20Determination%20and%20Vue.js-white" alt="Made with determination" />
</p>

> **"指间长征路，青春云礼赞"** —— 新媒体作品大赛参赛作品  
> 这不仅是一份竞赛作品，更是一个基于 Vue 3 构建的全屏滚动展示网站模板。欢迎自由使用、改造、二次开发。

---

## 目录

- [项目简介](#项目简介)
- [技术栈](#技术栈)
- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [许可证提示](#许可证提示)
- [开发贡献](#开发贡献)
- [一些感想](#一些感想)

---

## 项目简介

本项目以 **"长征精神"** 为核心叙事主题，通过全屏滚动、横向时间轴、3D 视差交互、背景音乐等多媒体手段，打造沉浸式的红色文化展示体验。

项目采用 **Vue 3 Composition API + Vite 8** 构建。前端核心动画依赖 **GSAP (ScrollTrigger)**，视觉交互丰富；同时内置了 **骨架屏加载、音频自动播放策略、设备响应式适配** 等生产级实践，适合作为进阶 Vue 项目的学习参考。

---

## 技术栈

| 类别 | 技术 | 用途 |
|------|------|------|
| **核心框架** | [Vue 3](https://vuejs.org/) | 渐进式前端框架（Composition API + `<script setup>`） |
| **构建工具** | [Vite 8](https://vite.dev/) | 极速开发服务器与生产构建 |
| **动画引擎** | [GSAP 3.15](https://gsap.com/) | 高性能动画库（ScrollTrigger 驱动全屏/横向滚动） |
| **交互动画** | [@vueuse/motion](https://motion.vueuse.org/) | 声明式滚动触发动画 |
| **后端** | [Supabase](https://supabase.com/) | BaaS 后端服务 |
| **部署** | [gh-pages](https://github.com/tschaub/gh-pages) | GitHub Pages 一键部署 |

---

## 功能特性

### 全屏面板滚动导航
基于 GSAP ScrollTrigger 实现页面级面板切换导航，自动驱动当前活跃面板索引变化。第二屏因自身管理横向滚动，会被排除在面板滚动之外，由独立的滚动托管逻辑负责。

### 横向时间轴滚动
第二屏集成了带物理惯性的横向滚动效果，利用 lerp 缓动算法配合 gsap.ticker 实现流畅的拖拽感。时间轴节点依次展示长征历史事件，当滚动到最右侧的精神卡片区域时，IntersectionObserver 会自动触发精神卡片的入场动画。

### 3D 鼠标视差交互
第二屏的长征地图区域实现了 3D 鼠标视差效果，鼠标移动时元素会产生 `rotateX`、`rotateY` 和 `scale` 的组合变换，配合 `perspective(1000px)` 视场深度营造出立体悬浮感。鼠标移出时平滑复位，体验流畅自然。

### 背景音乐播放器
全局唯一的 Audio 实例以单例模式运行，贯穿整个应用生命周期。播放器实现了完善的自动播放策略处理：页面初始化时自动检测浏览器 autoplay 支持情况，若被阻止则通过监听 `wheel`（桌面端）和 `touchstart`（移动端）事件在用户手势上下文中同步恢复播放。状态机涵盖 `idle → loading → playing → paused → blocked` 五种状态，支持音量控制、静音切换、播放状态和音量值的 `localStorage` 持久化。

### 设备自适应
同时基于 User-Agent 正则匹配和屏幕宽度（默认 768px 断点）进行双重设备检测，任一条件满足即判定为移动端。综合判断结果会标记判定来源（`ua` / `screen` / `both` / `neither`），便于按需调整交互策略。全局 CSS 跟随系统 `prefers-color-scheme` 自动切换明暗主题。

### 资源预加载与骨架屏
首屏加载时通过 `usePreload` 并行预加载关键资源（背景视频、首屏图片、第二屏展示图、自定义字体），所有资源加载完毕后才展示主内容，避免资源竞态导致的白屏闪烁。加载过程中显示骨架屏占位，并设置 8 秒超时兜底，确保极端网络下用户仍能正常浏览。

---

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/FishMoies/RedWeb.git
cd RedWeb

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建产物
npm run preview

# 部署到 GitHub Pages
npm run deploy
```

### 环境要求

- **Node.js** >= 18
- **npm** >= 8

---

## 项目结构

```
RedWeb/
├── public/                     # 静态资源（favicon）
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── animations/             # GSAP 动画模块
│   │   ├── horizontalScrollAnimation.js   # 第二屏横向滚动动画
│   │   └── scrollNavigationAnimation.js   # 页面级面板导航动画
│   ├── assets/                 # 静态资源统一入口
│   │   └── index.js            # Vite 编译时资源映射
│   ├── components/             # Vue 组件
│   │   ├── AppSkeleton.vue     # 全局骨架屏
│   │   ├── FirstScreen.vue     # 第一屏（首屏）
│   │   ├── SecondScreen.vue    # 第二屏（横向滚动）
│   │   ├── ThirdScreen.vue     # 第三屏（结束屏）
│   │   ├── MusicPlayer.vue     # 音乐播放器浮窗
│   │   ├── layout/
│   │   │   └── SiteFooter.vue  # 底部信息栏
│   │   ├── player/
│   │   │   └── MusicPlayerPanel.vue  # 播放器面板
│   │   ├── second/
│   │   │   ├── SectionTitle.vue      # 第二屏标题区
│   │   │   ├── SectionIntro.vue      # 第二屏简介区
│   │   │   ├── SectionTimeline.vue   # 时间轴
│   │   │   ├── SectionMap.vue        # 交互地图（3D 视差）
│   │   │   └── SectionSpirit.vue     # 长征精神卡片
│   │   └── skeleton/           # 骨架屏子组件
│   ├── composables/            # 组合式函数
│   │   ├── useAudioPlayer.js   # 音频播放器（单例）
│   │   ├── useDeviceDetect.js  # 设备检测
│   │   ├── useFontFace.js      # 字体注入
│   │   ├── useMouseParallax.js # 3D 鼠标视差
│   │   ├── usePreload.js       # 资源预加载
│   │   ├── useSpiritReveal.js  # 精神卡片展示控制
│   │   └── useTimelineReveal.js# 时间轴可见性检测
│   ├── plugins/
│   │   └── deviceDetect.js     # 设备检测 Vue 插件
│   ├── App.vue                 # 根组件
│   ├── main.js                 # 入口文件
│   └── style.css               # 全局样式（含明暗主题）
├── readmepublic/               # README 配图
├── index.html                  # HTML 入口
├── vite.config.js              # Vite 配置
├── package.json
└── README.md
```

---

## 许可证提示

该项目的源代码根据 MIT 许可证授权。但请注意，[`src/assets/`](src/assets/) 目录包含从第三方版权财产中提取的示例资源材料（图片、音频、视频、字体），**仅供演示之用**。这些资源**不受 MIT 许可证保护**。

如果您打算移植、重新分发或商业使用此项目，**必须用自己的资产替换这些受版权保护的材料**，以避免法律侵权。

> 请注意，该项目的部分代码和素材包含 AI 生成内容，请仔细鉴别，并自行规避相关法律风险。

详情请参阅 [LICENSE](LICENSE)。

---

## 开发贡献

欢迎提交 Issue 或 Pull Request 来完善这个学习模板

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

---

## 一些感想

> 这个项目作为比赛作品已经提交，所以不会在后续进行进一步维护。

开发该项目的起因起源于我的上一个项目：[Overwatch-Gaming](https://github.com/FishMoies/Overwatch-Gaming)。简单来说，那是一个基础的商业化展示网站，不包含任何后端程序，只能起到展示的作用。

如果你想要找一些前后端协同开发的 Vue 案例，那么我建议你看看我的上一个项目：其结合了基础的帖子系统和账户系统，以及使用了各种入门级别的后端技术；同时这个项目也使用了一点点即时动画，欢迎大家借鉴与批评指正。

这个项目主要是为了完善我的作品集而参加比赛编写的项目，你可以理解为练手项目。但是实际上，这个项目的开发过程非常曲折。
第一次我使用了`vueanim`和`fullpage`系统，但是后面因为`fullpage`对滚轮事件的强绑定，我就改为了使用`gsap`。我首先做了一个复刻`fullpage`的组件，但是后来发现如果想要实现，还是要很大程度上依附强绑定，所以我换成了监测滚轮事件的方式实现动画。  
另外，我其实接触`gsap`没有多长时间，所以很多动画依旧使用css+js的方式实现。  
这个项目已经结档，不会再在后续进行更新和维护，也不会接收处理Issues和PR请求。请酌情使用。

---

<p align="center">
  <sub>Built with ❤️ and Vue.js</sub>
</p>
