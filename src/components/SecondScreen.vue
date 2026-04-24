<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { backgroundMp4 } from '@/assets'
import { createHorizontalScroll } from '@/animations/horizontalScrollAnimation'

import SectionTitle from './second/SectionTitle.vue'
import SectionIntro from './second/SectionIntro.vue'
import SectionMap from './second/SectionMap.vue'
import SectionSpirit from './second/SectionSpirit.vue'

const mapRef = ref(null)
const spiritRef = ref(null)

let destroyHorizontalScroll = null

/**
 * 第二屏成为活动页面时，绑定 3D 鼠标事件
 */
const onSectionEnter = () => {
  if (mapRef.value) {
    mapRef.value.onSectionEnter()
  }
}

/**
 * 离开第二屏时，清理 3D 鼠标事件
 */
const onSectionLeave = () => {
  if (mapRef.value) {
    mapRef.value.onSectionLeave()
  }
}

onMounted(() => {
  destroyHorizontalScroll = createHorizontalScroll({
    containerSelector: '.horizontal-content',
    wrapperSelector: '.horizontal-wrapper',
    spiritOptions: {
      selector: '#spirit-section',
      threshold: 0.3,
      onVisible: () => {
        if (spiritRef.value) {
          spiritRef.value.show()
        }
      }
    }
  })
})

onUnmounted(() => {
  if (destroyHorizontalScroll) {
    destroyHorizontalScroll()
    destroyHorizontalScroll = null
  }
  onSectionLeave()
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
        <SectionTitle />
      </div>

      <!-- 第2屏：文本介绍 -->
      <div class="item">
        <SectionIntro />
      </div>

      <!-- 第3屏：地图 + 3D 交互 -->
      <div class="item">
        <SectionMap ref="mapRef" />
      </div>

      <!-- 第4屏：长征精神 -->
      <div class="item" id="spirit-section">
        <SectionSpirit ref="spiritRef" />
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
}
</style>
