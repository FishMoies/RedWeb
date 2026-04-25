<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { createScrollNavigation } from '@/animations/scrollNavigationAnimation'

import AppSkeleton from './components/AppSkeleton.vue'
import FirstScreen from './components/FirstScreen.vue'
import SecondScreen from './components/SecondScreen.vue'
import ThirdScreen from './components/ThirdScreen.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import SiteFooter from './components/layout/SiteFooter.vue'

import { useFontFace } from './composables/useFontFace'
import { usePreload } from './composables/usePreload'
import { useAudioPlayer } from './composables/useAudioPlayer'

// ===== 注入字体 =====
useFontFace()

// ===== 预加载管理 =====
const { loading, preloadCriticalAssets } = usePreload()

// ===== 音频播放器 =====
const { initPlayer, destroyPlayer } = useAudioPlayer()

// ===== 子组件模板 ref（用于滚动通信） =====
const secondScreenRef = ref(null)

// ===== 当前活跃面板索引 =====
const currentIndex = ref(-1)

let destroyScrollNavigation = null

/**
 * 面板切换处理器
 * 当进入某个面板时，通知 SecondScreen 绑定/清理 3D 鼠标事件
 */
const handleEnter = (index) => {
  currentIndex.value = index
  const secondScreen = secondScreenRef.value
  if (!secondScreen) return

  if (index === 1) {
    secondScreen.onSectionEnter()
  } else {
    secondScreen.onSectionLeave()
  }
}

// ===== 生命周期 =====
onMounted(async () => {
  initPlayer()

  const loadingTimeout = setTimeout(() => {
    console.warn('加载超时，强制显示内容')
    loading.value = false
  }, 8000)

  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    await preloadCriticalAssets()

    setTimeout(() => {
      loading.value = false
      clearTimeout(loadingTimeout)
    }, 500)
  } catch (error) {
    console.error('加载过程中出错:', error)
    loading.value = false
    clearTimeout(loadingTimeout)
  }
})

watch(loading, (val) => {
  if (!val) {
    setTimeout(() => {
      initPlayer()
    }, 300)
  }
})

// 监听 loading 变化，初始化 ScrollTrigger（唯一入口）
watch(loading, (val) => {
  if (!val) {
    nextTick(() => {
      requestAnimationFrame(() => {
        destroyScrollNavigation = createScrollNavigation({
          panelSelector: '.panel',
          excludeIndex: 1,
          onEnter: handleEnter
        })
      })
    })
  }
})

onUnmounted(() => {
  if (destroyScrollNavigation) {
    destroyScrollNavigation()
    destroyScrollNavigation = null
  }
  destroyPlayer()

  const secondScreen = secondScreenRef.value
  if (secondScreen) {
    secondScreen.onSectionLeave()
  }
})
</script>

<template>
  <!-- 骨架屏 -->
  <div :class="{ 'skeleton-container': true, 'hidden': !loading }">
    <AppSkeleton />
  </div>

  <!-- 实际内容：GSAP 面板容器 -->
  <div class="scroll-container" :class="{ 'loading': loading }">
    <section class="panel">
      <FirstScreen />
    </section>
    <section class="panel">
      <SecondScreen ref="secondScreenRef" />
    </section>
    <section class="panel">
      <ThirdScreen />
    </section>
  </div>

  <!-- 底部信息栏 -->
  <SiteFooter />

  <!-- 音乐浮窗播放器 -->
  <MusicPlayer />
</template>

<style scoped>
/* 骨架屏容器 */
.skeleton-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 9999;
  background-color: #0a0a0a;
  overflow: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.skeleton-container.hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

/* 滚动容器 */
.scroll-container {
  animation: fadeIn 0.5s ease;
}

.scroll-container.loading {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

/* GSAP 面板样式 */
.panel {
  min-height: 100vh;
  width: 100%;
  position: relative;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>

<style>
/* 全局字体优化 */
* {
  font-display: swap;
}
</style>
