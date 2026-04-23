<script setup>
import { ref } from 'vue'
import { backgroundMp4, secondItemJpg } from '@/assets'

const mapRef = ref(null)

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
 * 由父组件（App.vue）通过 fullpage.js 的 afterLoad 回调调用
 */
const onSectionEnter = () => {
  const mapEl = mapRef.value
  if (!mapEl) return
  mapEl.onmousemove = handleMouseMove
  mapEl.onmouseleave = resetMap
}

/**
 * 离开第二屏时，清理鼠标事件
 * 由父组件（App.vue）通过 fullpage.js 的 onLeave 回调调用
 */
const onSectionLeave = () => {
  const mapEl = mapRef.value
  if (mapEl) {
    mapEl.onmousemove = null
    mapEl.onmouseleave = null
  }
}

defineExpose({ onSectionEnter, onSectionLeave })
</script>

<template>
  <div class="section">
    <div class="second-section-content">

      <!-- 第二屏视频背景 -->
      <video class="bg-video-second" autoplay muted loop playsinline>
        <source :src="backgroundMp4" type="video/mp4" />
      </video>

      <!-- 第二屏黑色蒙版 -->
      <div class="overlay-second"></div>

      <!-- 内容网格容器 -->
      <div class="second-grid-container">
        <!-- 文本内容区域 -->
        <div class="second-text-content">
          <h2
            v-motion
            :initial="{
              opacity: 1,
              color: '#FFFFFF'
            }"
            :visible="{
              color: '#C41D1D',
              transition: {
                delay: 1000,
                duration: 1500,
                ease: 'easeInOut'
              }
            }"
            class="second-title"
          >
            漫漫长征路
          </h2>
          <div class="second-text">
            <p>长征是土地革命战争时期，中国工农红军主力撤离长江南北各苏区，转战两年到达陕甘苏区的战略转移行动。</p>
            <p>长征是人类历史上的伟大奇迹，中央红军共进行了600余次战役战斗，期间共经过14个省，翻越18座大山，跨过24条大河，走过荒草地，翻过雪山，行程约二万五千里。</p>
            <p>长征精神是红军在1934-1936年长征期间形成的革命精神，以把民族利益高于一切、坚定理想信念、不惜一切牺牲、独立自主、艰苦奋斗及紧密团结为内核。</p>
          </div>
        </div>

        <!-- 地图容器 -->
        <div class="map-container">
          <img ref="mapRef" :src="secondItemJpg" class="map-image" />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.second-section-content {
  height: 100vh;
  background-color: #000000;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 第二屏网格容器 */
.second-grid-container {
  height: 100%;
  display: grid;
  grid-template-columns: minmax(300px, 1fr) minmax(400px, 1.2fr);
  grid-template-rows: 1fr;
  gap: clamp(20px, 4vw, 60px);
  align-items: center;
  justify-content: center;
  padding: clamp(20px, 3vw, 60px) clamp(20px, 5vw, 80px);
  max-width: 1800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

/* 文本内容区域 */
.second-text-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding-right: clamp(10px, 2vw, 30px);
  margin-top: -25vh;
}

.second-title {
  font-family: 'Huiwen', sans-serif;
  font-size: clamp(2.5rem, 4.5vw, 5rem);
  line-height: 1.2;
  /* 颜色由动画控制，不设置固定颜色 */
  margin-bottom: clamp(20px, 3vw, 40px);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.second-text {
  font-family: "Noto Serif SC", serif;
  font-size: 1.0vw;
  line-height: 1.6;
  color: #ffffff;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
}

.second-text p {
  margin-bottom: 5px;
  font-size: clamp(13px, 1.5vw, 30px);
}

.second-text p:last-child {
  margin-bottom: 0;
}

/* 地图容器 - 3D透视 */
.map-container {
  perspective: 1000px;
  width: 100%;
  height: 100%;
  max-height: 75vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
  margin-top: -20vh;
}

/* 地图图片 - 3D效果 */
.map-image {
  transform-style: preserve-3d;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow:
    0 20px 40px rgba(255, 255, 255, 0.3),
    0 0 60px rgba(255, 255, 255, 0.15);
  border-radius: clamp(8px, 1vw, 16px);
  width: 100%;
  height: auto;
  max-width: min(800px, 90%);
  max-height: 70vh;
  object-fit: contain;
  cursor: pointer;
}

.map-image:hover {
  box-shadow:
    0 40px 80px rgba(0,0,0,0.4);
}

/* 第二屏视频背景样式 */
.bg-video-second {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

/* 第二屏黑色蒙版样式 - 透明度70% */
.overlay-second {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7); /* 70%透明度 */
  z-index: 1;
}

/* 移动端适配 */
@media (max-width: 768px) {
  /* 移动端地图适配 */
  .map-container {
    width: 90%;
    height: 50%;
    margin-right: 0;
    margin-top: 80px;
  }

  .map-image {
    max-width: 100%;
    box-shadow:
      0 10px 20px rgba(0,0,0,0.2),
      0 0 30px rgba(0,0,0,0.1);
  }

  /* 移动端第二屏：隐藏背景视频，使用纯黑色背景 */
  .bg-video-second {
    display: none !important;
  }

  .second-section-content {
    background-color: #000000 !important; /* 纯黑色背景 */
  }

  .overlay-second {
    background: rgba(0, 0, 0, 0) !important; /* 完全透明，因为背景已经是黑色 */
  }

  /* 第二屏响应式调整 - 优化垂直水平居中 */
  .second-grid-container {
    display: flex !important;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 25px;
    padding: 30px 20px;
    height: 100%;
    width: 100%;
  }

  .second-text-content {
    padding-right: 0;
    text-align: center;
    margin-top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 95%;
  }

  .second-title {
    font-size: clamp(3rem, 12vw, 5.5rem); /* 进一步加大标题字号 */
    margin-bottom: 25px;
    line-height: 1.1;
  }

  .second-text {
    font-size: clamp(1.3rem, 5.5vw, 1.8rem); /* 进一步加大文本字号 */
    line-height: 1.7;
    max-width: 95%;
  }

  .map-container {
    max-height: 45vh;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .map-image {
    max-width: 95%;
    max-height: 45vh;
  }

  /* 在移动端隐藏第二屏图片 - 确保隐藏 */
  .map-container {
    display: none !important;
  }
}

/* 超宽屏适配 */
@media (min-width: 2000px) {
  .second-grid-container {
    max-width: 2000px;
    padding: 100px;
  }

  .second-title {
    font-size: 5rem;
  }

  .second-text {
    font-size: 1.8rem;
    line-height: 1.8;
  }
}

/* 超窄屏适配（平板竖屏） */
@media (max-width: 1024px) and (min-height: 1024px) {
  .second-grid-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    gap: 40px;
  }

  .map-container {
    max-height: 60vh;
  }
}

/* 极端宽高比适配 */
@media (max-aspect-ratio: 3/4) {
  .second-grid-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    gap: 30px;
  }

  .second-text-content {
    max-height: 40vh;
    overflow-y: auto;
  }

  .map-container {
    max-height: 40vh;
  }
}

@media (min-aspect-ratio: 16/9) {
  .second-grid-container {
    gap: clamp(40px, 6vw, 80px);
  }

  .second-title {
    font-size: clamp(3rem, 5vw, 6rem);
  }
}
</style>
