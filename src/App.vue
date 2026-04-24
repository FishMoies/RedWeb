<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

import AppSkeleton from './components/AppSkeleton.vue'
import FirstScreen from './components/FirstScreen.vue'
import SecondScreen from './components/SecondScreen.vue'
import ThirdScreen from './components/ThirdScreen.vue'

import { useFontFace } from './composables/useFontFace'
import { usePreload } from './composables/usePreload'
import { useAudioPlayer } from './composables/useAudioPlayer'
import MusicPlayer from './components/MusicPlayer.vue'

// ===== 注入字体 =====
useFontFace()

// ===== 预加载管理 =====
const { loading, preloadCriticalAssets } = usePreload()

// ===== 音频播放器 =====
const { initPlayer, destroyPlayer } = useAudioPlayer()

// ===== 子组件模板 ref（用于滚动通信） =====
const secondScreenRef = ref(null)
const containerRef = ref(null)

// ===== 当前活跃面板索引 =====
const currentIndex = ref(-1)

// ===== 追踪 App 层级创建的 ScrollTrigger 实例（选择性销毁） =====
const appTriggers = []

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

// ===== GSAP ScrollTrigger 初始化（替代 fullpage.js） =====
const initScroll = async () => {
  await nextTick()

  requestAnimationFrame(() => {
    // 只销毁 App 层级创建的 ScrollTrigger，不波及 SecondScreen 内部 self-managed 的 trigger
    appTriggers.forEach(t => t.kill())
    appTriggers.length = 0

    const panels = gsap.utils.toArray('.panel')

    panels.forEach((panel, i) => {
      // 第二屏（index === 1）由自身管理横向滚动，完全隔离避免冲突
      if (i === 1) return

      const st = ScrollTrigger.create({
        trigger: panel,
        start: 'top 90%',
        end: 'top 10%',

        onEnter: () => handleEnter(i),
        onEnterBack: () => handleEnter(i),
      })

      appTriggers.push(st)
    })

    // 触发 ScrollTrigger 刷新确保位置计算准确
    ScrollTrigger.refresh()
    // 初始状态：第一个面板为活跃
    handleEnter(0)
  })
}

/**
 * 销毁 App 层级的 ScrollTrigger 实例
 */
const destroyScroll = () => {
  appTriggers.forEach(t => t.kill())
  appTriggers.length = 0
}

// ===== 生命周期 =====
onMounted(async () => {
  // ★ 尽早初始化音频播放器（创建音频实例 + 注册滚动/触摸监听），
  //   不等待字体/资源加载完成，确保用户首次滑动即触发背景音乐
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
    initScroll()
  }
})

onUnmounted(() => {
  destroyScroll()
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
  <div ref="container" class="scroll-container" :class="{ 'loading': loading }">
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

/* ===== GSAP 面板样式（替代 fullpage section） ===== */
.panel {
  min-height: 100vh;
  width: 100%;
  position: relative;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<style>
/* 全局字体优化 - @font-face 已在 useFontFace composable 中动态注入 */
* {
  font-display: swap;
}
</style>
