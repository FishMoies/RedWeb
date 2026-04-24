<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { backgroundMp4, secondItemJpg } from '@/assets'

gsap.registerPlugin(ScrollTrigger)

const mapRef = ref(null)
const spiritRef = ref(null)
const spiritVisible = ref(false)
let spiritObserver = null

// ===== 3D 鼠标视差交互 =====

/**
 * 鼠标移动时实现 3D 视差旋转效果
 */
const handleMouseMove = (e) => {
  const mapEl = mapRef.value
  if (!mapEl) return

  const rect = mapEl.getBoundingClientRect()

  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const offsetX = (x - centerX) / centerX
  const offsetY = (y - centerY) / centerY

  // 限制旋转角度在 -25 到 25 度之间，防止过度旋转
  const rotateY = Math.max(-25, Math.min(25, offsetX * 5))   // 左右旋转
  const rotateX = Math.max(-25, Math.min(25, -offsetY * 5))  // 上下倾斜

  mapEl.style.transform = `
    perspective(1000px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    scale(1.05)
  `
}

/**
 * 鼠标离开时重置地图变换
 */
const resetMap = () => {
  const mapEl = mapRef.value
  if (mapEl) {
    mapEl.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `
  }
}

/**
 * 第二屏成为活动页面时，绑定鼠标事件实现 3D 效果
 */
const onSectionEnter = () => {
  const mapEl = mapRef.value
  if (!mapEl) return
  mapEl.onmousemove = handleMouseMove
  mapEl.onmouseleave = resetMap
}

/**
 * 离开第二屏时，清理鼠标事件
 */
const onSectionLeave = () => {
  const mapEl = mapRef.value
  if (mapEl) {
    mapEl.onmousemove = null
    mapEl.onmouseleave = null
  }
}

// ===== GSAP 横向滚动驱动（物理缓动方案） =====
/**
 * 使用 gsap.ticker + lerp 实现带惯性的平滑缓动效果，
 * 替代直接的 scrub 绑定，手感接近 iOS 原生惯性滚动。
 *
 * 移动端适配：触摸滚动速度远快于鼠标滚轮，因此使用更高的 lerp 系数，
 * 确保水平动画能及时跟上垂直滚动，避免出现空白区域。
 */

let horizontalTrigger = null
let tickerFn = null

// 物理缓动状态
let currentProgress = 0  // 当前插值进度（被 lerp 平滑追赶）
let targetProgress = 0   // 目标进度（由 ScrollTrigger 直接驱动）

onMounted(() => {
  const container = document.querySelector('.horizontal-content')
  if (!container) return

  // ---- 检测移动端：触摸设备或窄视口 ----
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768

  // 每次刷新时重新计算滚动距离（适配视口变化，如地址栏隐藏/旋转屏幕）
  let scrollDistance = 0
  const calcScrollDistance = () => {
    const vw = window.innerWidth
    const tw = container.scrollWidth
    return tw - vw
  }

  scrollDistance = calcScrollDistance()

  // 如果滚动距离为 0 或负值（内容不够宽），不创建动画，避免 pin 冲突
  if (scrollDistance <= 0) return

  // lerp 系数：移动端用 0.3 快速响应，桌面端 0.1 保持顺滑惯性手感
  const lerpFactor = isMobile ? 0.3 : 0.1

  // ---- ScrollTrigger：只负责追踪进度 + pin 住容器 ----
  horizontalTrigger = ScrollTrigger.create({
    id: 'second-screen-horizontal',
    trigger: '.horizontal-wrapper',
    start: 'top top',
    end: () => `+=${scrollDistance}`,

    pin: true,
    pinSpacing: true,
    invalidateOnRefresh: true,

    // 每一帧更新目标进度
    onUpdate: (self) => {
      targetProgress = self.progress

      // 移动端快速滚动时，当 progress 接近边界直接对齐，消除尾部延迟
      if (isMobile && (self.progress >= 0.995 || self.progress <= 0.005)) {
        currentProgress = self.progress
      }
    },

    // 刷新时重新计算滚动距离，适配布局/视口变化
    onRefresh: () => {
      scrollDistance = calcScrollDistance()
    },
  })

  // ---- gsap.ticker：负责用 lerp 做物理缓动 + 驱动水平位移 ----
  tickerFn = () => {
    // 使用适配的 lerp 系数向目标进度插值缓动
    currentProgress += (targetProgress - currentProgress) * lerpFactor

    // 当插值足够接近目标时，直接对齐以避免浮点残差抖动
    if (Math.abs(currentProgress - targetProgress) < 0.0001) {
      currentProgress = targetProgress
    }

    // 应用水平位移
    gsap.set(container, {
      x: -currentProgress * scrollDistance,
    })
  }
  gsap.ticker.add(tickerFn)

  // 延迟刷新确保图片/视频加载后布局稳定
  setTimeout(() => {
    ScrollTrigger.refresh()
  }, 300)

  // ===== IntersectionObserver：第四屏进入视口时触发动画 =====
  const spiritEl = spiritRef.value
  if (spiritEl) {
    spiritObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          spiritVisible.value = true
          spiritObserver.disconnect() // 触发一次后即断开
        }
      },
      { threshold: 0.3 }
    )
    spiritObserver.observe(spiritEl)
  }
})

onUnmounted(() => {
  // 移除 ticker
  if (tickerFn) {
    gsap.ticker.remove(tickerFn)
    tickerFn = null
  }

  // 定向销毁 ScrollTrigger
  if (horizontalTrigger) {
    horizontalTrigger.kill()
    horizontalTrigger = null
  }

  // 断开 IntersectionObserver
  if (spiritObserver) {
    spiritObserver.disconnect()
    spiritObserver = null
  }
})

defineExpose({ onSectionEnter, onSectionLeave })
</script>

<template>
  <div class="horizontal-wrapper">
    <!-- 第二屏视频背景 -->
    <video class="bg-video-second" autoplay muted loop playsinline>
      <source :src="backgroundMp4" type="video/mp4" />
    </video>

    <!-- 第二屏黑色蒙版 -->
    <div class="overlay-second"></div>

    <!-- 横向滚动内容容器 -->
    <div class="horizontal-content">

      <!-- 第1屏：标题 -->
      <div class="item">
        <div class="item-content title-item">
          <h2 class="second-title">漫漫长征路</h2>
          <p class="second-subtitle">人类历史上的伟大奇迹</p>
        </div>
      </div>

      <!-- 第2屏：文本介绍 -->
      <div class="item">
        <div class="item-content text-item">
          <p style="text-align: center;">长征是土地革命战争时期，中国工农红军主力撤离长江南北各苏区，转战两年到达陕甘苏区的战略转移行动。</p>
        </div>
      </div>

      <!-- 第3屏：地图（带 3D 交互），左侧数据网格 + 右侧地图各占50% -->
      <div class="item">
        <div class="item-content map-item">
          <div class="map-text">
            <h2 class="second-title" style="font-size: clamp(2rem, 3vw, 3.5rem); margin-bottom: clamp(12px, 1.5vw, 20px); text-align: center;">苍山如海 残阳如血</h2>
            <div class="map-stats-grid">
              <div class="stat-card">
                <span class="stat-number">14</span>
                <span class="stat-unit">个</span>
                <span class="stat-label">途经省份</span>
              </div>
              <div class="stat-card">
                <span class="stat-number">18</span>
                <span class="stat-unit">座</span>
                <span class="stat-label">翻越大山</span>
              </div>
              <div class="stat-card">
                <span class="stat-number">24</span>
                <span class="stat-unit">条</span>
                <span class="stat-label">跨过江河</span>
              </div>
              <div class="stat-card">
                <span class="stat-number">600<small>+</small></span>
                <span class="stat-unit">次</span>
                <span class="stat-label">战役战斗</span>
              </div>
              <div class="stat-card">
                <span class="stat-number">700<small>+</small></span>
                <span class="stat-unit">座</span>
                <span class="stat-label">攻占县城</span>
              </div>
              <div class="stat-card">
                <span class="stat-number">430<small>+</small></span>
                <span class="stat-unit">人</span>
                <span class="stat-label">干部牺牲</span>
              </div>
              <div class="stat-card">
                <span class="stat-number">25000</span>
                <span class="stat-unit">里</span>
                <span class="stat-label">行军里程</span>
              </div>
              <div class="stat-card">
                <span class="stat-number"><30</span>
                <span class="stat-unit">岁</span>
                <span class="stat-label">平均年龄</span>
              </div>
            </div>
          </div>
          <div class="map-container">
            <img ref="mapRef" :src="secondItemJpg" class="map-image" />
          </div>
        </div>
      </div>

      <!-- 第4屏：长征精神在现代的体现 -->
      <div class="item">
        <div ref="spiritRef" class="item-content spirit-item" :class="{ visible: spiritVisible }">
          <!-- 标题区 -->
          <div class="spirit-header">
            <h2 class="spirit-title">长征精神&nbsp;<span class="spirit-highlight">薪火相传</span></h2>
            <p class="spirit-subtitle">新时代的长征路，精神永续</p>
          </div>

          <!-- 四张卡片：2x2 网格 -->
          <div class="spirit-grid">
            <!-- 卡片1：航天逐梦 -->
            <div class="spirit-card">
              <div class="spirit-card-icon">🚀</div>
              <h3 class="spirit-card-title">航天逐梦</h3>
              <p class="spirit-card-desc">
                从"两弹一星"到载人航天，从北斗组网到火星探测，中国航天人用数十年走完了西方数百年的路——这是通向星辰大海的新长征。
              </p>
            </div>

            <!-- 卡片2：脱贫攻坚 -->
            <div class="spirit-card">
              <div class="spirit-card-icon">🏔️</div>
              <h3 class="spirit-card-title">脱贫攻坚</h3>
              <p class="spirit-card-desc">
                近一亿农村贫困人口全部脱贫，832个贫困县全部摘帽。这场人类减贫史上的奇迹，正是"一切为了人民"长征精神的当代实践。
              </p>
            </div>

            <!-- 卡片3：逆行无畏 -->
            <div class="spirit-card">
              <div class="spirit-card-icon">🛡️</div>
              <h3 class="spirit-card-title">逆行无畏</h3>
              <p class="spirit-card-desc">
                疫情面前，白衣执甲、逆行出征。没有从天而降的英雄，只有挺身而出的凡人——"不怕牺牲、英勇奋斗"的旗帜从未倒下。
              </p>
            </div>

            <!-- 卡片4：自主创新 -->
            <div class="spirit-card">
              <div class="spirit-card-icon">💡</div>
              <h3 class="spirit-card-title">自主创新</h3>
              <p class="spirit-card-desc">
                芯片突围、人工智能、量子计算……面对"卡脖子"困境，新时代科研工作者正以"自力更生、艰苦奋斗"的信念，攀登科技长征路。
              </p>
            </div>
          </div>

          <!-- 底部引语 -->
          <p class="spirit-footer">每一代人都有每一代人的长征路，每一代人都要走好自己的长征路。</p>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* ===== 横向滚动外层容器 ===== */
.horizontal-wrapper {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: #000000;
}

/* ===== 横向滚动内容 ===== */
.horizontal-content {
  display: flex;
  height: 100%;
  position: relative;
  z-index: 2;
}

/* ===== 横向每一屏 ===== */
.item {
  min-width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* ===== 内容卡片通用 ===== */
.item-content {
  padding: clamp(20px, 4vw, 60px);
  max-width: 90%;
  width: 100%;
}

/* ===== 标题屏 ===== */
.title-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.second-title {
  font-family: 'Huiwen', sans-serif;
  font-size: clamp(3rem, 6vw, 6rem);
  line-height: 1.2;
  color: #C41D1D;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  margin: 0;
}

.second-subtitle {
  font-family: "Noto Serif SC", serif;
  font-size: clamp(1.2rem, 2.5vw, 2.5rem);
  line-height: 1.4;
  color: #ffffff;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
  opacity: 0.8;
}

/* ===== 文本屏 ===== */
.text-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  max-width: 80%;
}

.text-item p {
  font-family: "Noto Serif SC", serif;
  font-size: clamp(14px, 1.8vw, 28px);
  line-height: 1.8;
  color: #ffffff;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
  margin: 0;
}

/* ===== 地图屏：文本与地图各占50% ===== */
.map-item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: clamp(16px, 3vw, 40px);
  height: 100%;
  padding: 0 clamp(16px, 3vw, 40px);
  box-sizing: border-box;
}

/* 文本区域：左半部分 50% */
.map-text {
  flex: 0 0 50%;
  max-width: 50%;
  padding-right: clamp(12px, 2vw, 24px);
  box-sizing: border-box;

  font-family: "Noto Serif SC", serif;
  font-size: clamp(14px, 1.6vw, 24px);
  line-height: 1.8;
  color: #ffffff;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
  text-align: justify;
}

/* 地图容器：右半部分 50% */
.map-container {
  flex: 0 0 50%;
  max-width: 50%;
  padding-left: clamp(12px, 2vw, 24px);
  box-sizing: border-box;

  perspective: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.map-image {
  transform-style: preserve-3d;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow:
    0 20px 40px rgba(255, 255, 255, 0.3),
    0 0 60px rgba(255, 255, 255, 0.15);
  border-radius: clamp(8px, 1vw, 16px);
  width: 100%;
  height: auto;
  max-height: 70vh;
  object-fit: contain;
  cursor: pointer;
}

.map-image:hover {
  box-shadow:
    0 40px 80px rgba(0, 0, 0, 0.4);
}

/* ===== 数据统计网格（嵌入第3屏左侧50%区域） ===== */
.map-stats-grid {
  display: grid;
  grid-template-columns: repeat(2,1fr);
  gap: clamp(8px, 1vw, 14px);
  width: 100%;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: clamp(12px, 2vw, 24px) clamp(8px, 1.5vw, 16px);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: clamp(8px, 1vw, 16px);
  backdrop-filter: blur(4px);
  transition: transform 0.3s ease, background 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.14);
}

.stat-number {
  font-family: 'Huiwen', sans-serif;
  font-size: clamp(1.8rem, 3vw, 3.5rem);
  line-height: 1;
  color: #C41D1D;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.stat-number small {
  font-size: 0.5em;
  vertical-align: super;
}

.stat-unit {
  font-family: "Noto Serif SC", serif;
  font-size: clamp(11px, 1vw, 16px);
  color: rgba(255, 255, 255, 0.6);
  line-height: 1;
}

.stat-label {
  font-family: "Noto Serif SC", serif;
  font-size: clamp(12px, 1.2vw, 18px);
  color: #ffffff;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
  line-height: 1.4;
}

/* ===== 视频背景 ===== */
.bg-video-second {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

/* ===== 黑色蒙版 ===== */
.overlay-second {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1;
}

/* ===== 移动端适配 ===== */
@media (max-width: 768px) {
  .bg-video-second {
    display: none !important;
  }

  .horizontal-wrapper {
    background-color: #000000 !important;
  }

  .overlay-second {
    background: rgba(0, 0, 0, 0) !important;
  }

  .item-content {
    max-width: 95%;
    padding: 20px;
  }

  .text-item {
    max-width: 95%;
  }

  .text-item p {
    font-size: clamp(14px, 4vw, 20px);
  }

  .second-title {
    font-size: clamp(2.5rem, 10vw, 4rem);
  }

  .second-subtitle {
    font-size: clamp(1rem, 4vw, 1.5rem);
  }

  /* 地图屏移动端：纵向排列各占50% */
  .map-item {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    height: 100%;
  }

  .map-text {
    flex: 0 0 auto;
    max-width: 100%;
    width: 100%;
    padding-right: 0;
    font-size: clamp(13px, 3.5vw, 18px);
    line-height: 1.6;
    text-align: left;
    max-height: 45vh;
    overflow-y: auto;
  }

  .map-container {
    flex: 0 0 auto;
    max-width: 100%;
    width: 100%;
    padding-left: 0;
    display: flex !important;
  }

  .map-image {
    max-height: 40vh;
    width: auto;
    max-width: 100%;
  }

  /* 第3屏左侧网格移动端适配 */
  .map-stats-grid {
    gap: 8px;
  }

  .stat-card {
    padding: 10px 6px;
  }

  .stat-number {
    font-size: clamp(1.2rem, 6vw, 1.8rem);
  }
}

/* ===== 模糊渐入动画 ===== */
@keyframes fadeInBlurUp {
  from {
    opacity: 0;
    filter: blur(10px);
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }
}

/* ===== 第4屏：长征精神薪火相传 ===== */
/* 默认所有动画处于暂停状态，等待 IntersectionObserver 触发 */
.spirit-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: clamp(16px, 2.5vw, 36px);
  height: 100%;
  padding: clamp(20px, 4vw, 60px);
  box-sizing: border-box;
}

/* 标题区：默认可见，仅在 .visible 时播放渐入动画 */
.spirit-header {
  text-align: center;
  margin-bottom: clamp(4px, 1vw, 12px);
}

.spirit-item.visible .spirit-header {
  animation: fadeInBlurUp 0.8s ease-out both;
}

.spirit-title {
  font-family: 'Huiwen', sans-serif;
  font-size: clamp(2.2rem, 4.5vw, 4.5rem);
  line-height: 1.3;
  color: #ffffff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  margin: 0 0 clamp(8px, 1vw, 16px);
}

.spirit-highlight {
  color: #C41D1D;
}

.spirit-subtitle {
  font-family: "Noto Serif SC", serif;
  font-size: clamp(0.95rem, 1.8vw, 1.8rem);
  color: rgba(255, 255, 255, 0.75);
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
  margin: 0;
  letter-spacing: 0.15em;
}

/* 卡片网格：2x2 */
.spirit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(10px, 1.5vw, 24px);
  width: 100%;
  max-width: 1100px;
}

/* 单张卡片：带交错延迟动画 */
.spirit-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: clamp(6px, 0.8vw, 12px);
  padding: clamp(16px, 2.5vw, 32px) clamp(12px, 2vw, 24px);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: clamp(10px, 1.2vw, 18px);
  backdrop-filter: blur(4px);
  transition: transform 0.4s ease, background 0.4s ease, box-shadow 0.4s ease;
}

/* 四张卡片：进入视口时依次渐入 */
.spirit-item.visible .spirit-card {
  animation: fadeInBlurUp 0.7s ease-out both;
}
.spirit-item.visible .spirit-card:nth-child(1) { animation-delay: 0.15s; }
.spirit-item.visible .spirit-card:nth-child(2) { animation-delay: 0.30s; }
.spirit-item.visible .spirit-card:nth-child(3) { animation-delay: 0.45s; }
.spirit-item.visible .spirit-card:nth-child(4) { animation-delay: 0.60s; }

.spirit-card:hover {
  transform: translateY(-6px);
  background: rgba(255, 255, 255, 0.12);
  box-shadow:
    0 12px 30px rgba(196, 29, 29, 0.15),
    0 0 60px rgba(196, 29, 29, 0.05);
}

/* 卡片图标 */
.spirit-card-icon {
  font-size: clamp(2rem, 3.5vw, 3.8rem);
  line-height: 1;
  margin-bottom: clamp(2px, 0.3vw, 6px);
  filter: drop-shadow(0 2px 8px rgba(255, 255, 255, 0.2));
}

/* 卡片标题 */
.spirit-card-title {
  font-family: 'Huiwen', sans-serif;
  font-size: clamp(1.1rem, 1.8vw, 2rem);
  line-height: 1.3;
  color: #C41D1D;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
  margin: 0;
}

/* 卡片描述 */
.spirit-card-desc {
  font-family: "Noto Serif SC", serif;
  font-size: clamp(0.75rem, 1.1vw, 1.1rem);
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  margin: 0;
  max-width: 95%;
}

/* 底部引语 */
.spirit-footer {
  font-family: "Noto Serif SC", serif;
  font-size: clamp(0.85rem, 1.3vw, 1.3rem);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.55);
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
  text-align: center;
  margin: clamp(4px, 0.5vw, 12px) 0 0;
  max-width: 80%;
  font-style: italic;
  letter-spacing: 0.1em;
}

.spirit-item.visible .spirit-footer {
  animation: fadeInBlurUp 0.8s ease-out both;
  animation-delay: 0.75s;
}

/* 第4屏移动端适配 */
@media (max-width: 768px) {
  /* 网格改为1列 */
  .spirit-grid {
    grid-template-columns: 1fr;
    gap: 10px;
    max-width: 95%;
  }

  .spirit-card {
    padding: 14px 16px;
    gap: 6px;
  }

  .spirit-card-icon {
    font-size: clamp(1.6rem, 8vw, 2.4rem);
  }

  .spirit-card-title {
    font-size: clamp(1rem, 5vw, 1.4rem);
  }

  .spirit-card-desc {
    font-size: clamp(0.72rem, 3.5vw, 0.95rem);
    line-height: 1.6;
  }

  .spirit-footer {
    max-width: 95%;
    font-size: clamp(0.78rem, 3.5vw, 1rem);
  }

  .spirit-header {
    margin-bottom: 4px;
  }
}
</style>
