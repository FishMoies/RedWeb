<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import fullpage from 'fullpage.js'
import 'fullpage.js/dist/fullpage.css'

import AppSkeleton from './components/AppSkeleton.vue'
import FirstScreen from './components/FirstScreen.vue'
import SecondScreen from './components/SecondScreen.vue'
import ThirdScreen from './components/ThirdScreen.vue'

import { useFontFace } from './composables/useFontFace'
import { usePreload } from './composables/usePreload'

// ===== 注入字体 =====
useFontFace()

// ===== 预加载管理 =====
const { loading, preloadCriticalAssets } = usePreload()

// ===== 子组件模板 ref（用于 fullpage 回调通信） =====
const secondScreenRef = ref(null)

// ===== fullpage 实例 =====
let fpInstance = null

/**
 * 安全初始化 fullpage.js
 */
const initFullpage = async () => {
  await nextTick()

  requestAnimationFrame(() => {
    if (fpInstance) {
      fpInstance.destroy('all')
      fpInstance = null
    }

    fpInstance = new fullpage('#fullpage', {
      autoScrolling: true,
      navigation: true,
      scrollOverflow: false,
      fitToSection: true,
      licenseKey: 'gplv3-license',

      afterLoad(origin, destination, direction) {
        // 通知第二屏：进入活动状态，绑定 3D 鼠标事件
        const secondScreen = secondScreenRef.value
        if (secondScreen) {
          secondScreen.onSectionEnter()
        }
      },

      onLeave(origin, destination, direction) {
        // 通知第二屏：离开活动状态，清理 3D 鼠标事件
        const secondScreen = secondScreenRef.value
        if (secondScreen) {
          secondScreen.onSectionLeave()
        }
      }
    })
  })
}

/**
 * 强制销毁 fullpage 实例
 */
const destroyFullpage = () => {
  if (fpInstance) {
    fpInstance.destroy('all')
    fpInstance = null
  }
}

// ===== 生命周期 =====
onMounted(async () => {
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

// 监听 loading 变化，初始化 fullpage（唯一入口）
watch(loading, (val) => {
  if (!val) {
    initFullpage()
  }
})

onUnmounted(() => {
  destroyFullpage()

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

  <!-- 实际内容 -->
  <div id="fullpage" :class="{ 'loading': loading }">
    <FirstScreen />
    <SecondScreen ref="secondScreenRef" />
    <ThirdScreen />
    <div class="section" />
  </div>
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

/* fullpage 容器 */
#fullpage {
  animation: fadeIn 0.5s ease;
}

/* fullpage 加载状态 */
#fullpage.loading {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
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
