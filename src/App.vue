<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { createScrollNavigation } from '@/animations/scrollNavigationAnimation'

import AppSkeleton from './components/AppSkeleton.vue'
import FirstScreen from './components/FirstScreen.vue'
import SecondScreen from './components/SecondScreen.vue'
import ThirdScreen from './components/ThirdScreen.vue'
import MusicPlayer from './components/MusicPlayer.vue'

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
  // ★ 尽早初始化音频播放器（创建音频实例 + 注册滚动/触摸监听）
  initPlayer()

  const loadingTimeout = setTimeout(() => {
    console.warn('加载超时，强制显示内容')
    loading.value = false
  }, 8000)

  try {
    // 等待字体加载完成
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // 预加载关键资源（视频、图片）
    await preloadCriticalAssets()

    // 延迟一小段时间确保平滑过渡
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

// loading 完成后初始化音频播放器
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

  // 确保第二屏鼠标事件被清理
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

  <!-- 底部信息栏：备案号与联系邮箱 -->
  <footer class="site-footer">
    <div class="footer-inner">
      <a
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noopener noreferrer"
        class="footer-link"
      >
        湘ICP备2026014314号-1
      </a>
      <span class="footer-separator">|</span>
      <a
        href="mailto:xisiyao0529@gmail.com"
        class="footer-link"
      >
        xisiyao0529@gmail.com
      </a>
    </div>
  </footer>

  <!-- 音乐浮窗播放器 -->
  <MusicPlayer />
</template>

<style scoped>
body {
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
}

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

/* 骨架屏隐藏状态 */
.skeleton-container.hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

/* 滚动容器 */
.scroll-container {
  animation: fadeIn 0.5s ease;
}

/* 滚动容器加载状态 */
.scroll-container.loading {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

/* ===== GSAP 面板样式 ===== */
.panel {
  min-height: 100vh;
  width: 100%;
  position: relative;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ===== 底部信息栏 ===== */
.site-footer {
  width: 100%;
  background-color: #1a1a1a;
  padding: clamp(10px, 1.5vh, 20px) 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.footer-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(6px, 1vw, 16px);
  flex-wrap: wrap;
}

.footer-link {
  font-family: "Noto Serif SC", "PingFang SC", serif;
  font-size: clamp(0.65rem, 0.85vw, 1rem);
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.25s ease;
  white-space: nowrap;
}

.footer-link:hover {
  color: #ffffff;
}

.footer-separator {
  color: rgba(255, 255, 255, 0.35);
  font-size: clamp(0.65rem, 0.85vw, 1rem);
  user-select: none;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .site-footer {
    padding: 10px 12px;
  }

  .footer-link {
    font-size: 0.7rem;
  }

  .footer-separator {
    font-size: 0.7rem;
  }
}
</style>

<style>
/* 全局字体优化 - @font-face 已在 useFontFace composable 中动态注入 */
* {
  font-display: swap;
}
</style>
