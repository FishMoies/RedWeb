# 指间长征路，青春云礼赞

<p align="center">
  <img src="./readmepublic/1.png" alt="项目预览" width="720" />
</p>

<p align="center">
  <a href="https://github.com/FishMoies/RedWeb/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?logo=github" alt="License" /></a>
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3.5-green?logo=vue.js" alt="Vue" /></a>
  <a href="https://gsap.com/"><img src="https://img.shields.io/badge/GSAP-3.15-88CE02?logo=greensock" alt="GSAP" /></a>
  <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite" alt="Vite" /></a>
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
| **核心框架** | [Vue 3.5](https://vuejs.org/) | 渐进式前端框架（Composition API + `<script setup>`） |
| **构建工具** | [Vite 8](https://vite.dev/) | 极速开发服务器与生产构建 |
| **动画引擎** | [GSAP 3.15](https://gsap.com/) | 高性能动画库（ScrollTrigger + gsap.ticker 驱动全屏/横向滚动/物理缓动） |
| **交互动画** | [@vueuse/motion 3.0](https://motion.vueuse.org/) | 声明式滚动触发动画（模板内置 v-motion 指令） |
| **部署** | [gh-pages](https://github.com/tschaub/gh-pages) | GitHub Pages 一键部署 |

---

## 功能特性

### 全屏面板滚动导航
`scrollNavigationAnimation` 模块通过 GSAP ScrollTrigger 遍历所有 `.panel` 元素，为每个面板创建独立的 `start: 'top 90%'` / `end: 'top 10%'` 触发器，在 `onEnter` 和 `onEnterBack` 回调中驱动当前活跃面板索引。第二屏（索引 1）因自身管理横向滚动被显式排除，其滚动完全由 `horizontalScrollAnimation` 托管——ScrollTrigger 通过 `pin: true` 钉住容器，配合 `gsap.ticker` 的 lerp 物理缓动实现平滑的水平位移。

### 横向时间轴滚动
`horizontalScrollAnimation` 模块使用 `ScrollTrigger.create()` 将第二屏容器 `pin` 在视口中，通过 `end: () => +=${scrollDistance}` 动态计算滚动终点。每帧通过 `gsap.ticker` 执行 lerp 插值（桌面端系数 0.1 保持惯性手感，移动端 0.3 快速响应），驱动 `gsap.set(container, { x })` 实现水平位移。内置 `IntersectionObserver`（threshold 0.3）监听精神卡片区域进入视口时，触发 `useSpiritReveal().show()` 播放入场动画。

### 3D 鼠标视差交互
`useMouseParallax` composable 通过计算鼠标在元素内的相对偏移量（距中心点的归一化比值），生成限幅后的 `rotateX` / `rotateY`（最大 ±25°），与 `perspective(1000px)` 和 `scale(1.05)` 组合为 CSS `transform`，营造三维悬浮感。鼠标移出时通过 `onmouseleave` 平滑复位到 `rotateX(0) rotateY(0) scale(1)`。

### 背景音乐播放器
`useAudioPlayer` 采用模块级闭包单例模式——`audio` 实例与 `initialized` 标记位于模块作用域，所有调用者共享同一份响应式状态。初始化时通过 `checkAutoplaySupport()` 使用`静默 Audio` 探测浏览器 autoplay 策略；若被阻止，立即在 `wheel`（桌面端）和 `touchstart`（移动端）上注册 `{ once: true }` 一次性监听器，在用户手势上下文中**同步调用** `audio.play()`（非 async），确保浏览器正确识别用户手势。状态机覆盖 `idle → loading → playing → paused → blocked` 五种状态，`volume` 和 `isMuted` 通过 `localStorage` 持久化（键名 `redweb_music_volume` / `redweb_music_enabled`），`try-catch` 兜底处理无痕模式异常。

### 设备自适应
`useDeviceDetect` 融合两层检测：模块顶层同步执行 `navigator.userAgent` 正则匹配（`MOBILE_UA_REGEX` / `TABLET_UA_REGEX`），避免初始化闪烁；`windowWidth` 通过 `resize` 事件响应式追踪，与 768px 断点比较。综合结果 `isMobile = isMobileByUA || isMobileByScreen` 取并集，`detectionSource` 计算属性精确标定判定来源（`ua` / `screen` / `both` / `neither`）。同时通过 `DeviceDetectPlugin`（Vue 插件）将检测结果注入全局 `$device`，供模板直接访问。

### 资源预加载与骨架屏
`usePreload` 在 `onMounted` 中并行预加载 4 类关键资源：背景视频（`<video>`）、首屏图片与第二屏展示图（`<img>`）、自定义 Huiwen 字体（`FontFace API`）。使用 `Promise.allSettled` 收集结果，单个资源失败不阻塞整体流程。字体通过 `useFontFace` 在 `<head>` 中注入 `@font-face` 规则（`font-display: swap`）。加载期间 `loading` 响应式变量控制骨架屏（`AppSkeleton`）显示，8 秒超时 `setTimeout` 兜底强制展示内容，`loading` 变为 `false` 后延迟 300ms 初始化 `ScrollTrigger` 确保 DOM 布局稳定。

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
