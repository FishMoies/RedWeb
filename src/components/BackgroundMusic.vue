<script setup>
import { onMounted, onUnmounted } from 'vue'
import { bgMusic } from '@/assets'

/** 背景音乐实例 */
let audio = null

/**
 * 尝试播放背景音乐，若被浏览器自动播放策略阻止，
 * 则等待用户首次交互（点击、触摸、滚轮）后播放
 */
function tryPlay() {
  if (audio) return

  audio = new Audio(bgMusic)
  audio.loop = true
  audio.volume = 0.5

  const playPromise = audio.play()

  if (playPromise !== undefined) {
    playPromise.catch(() => {
      console.warn('⚠️ 背景音乐自动播放被浏览器阻止，等待用户首次交互后播放')

      const resumeOnce = () => {
        audio.play().catch(e => console.error('背景音乐播放失败:', e))
        document.removeEventListener('click', resumeOnce)
        document.removeEventListener('touchstart', resumeOnce)
        document.removeEventListener('wheel', resumeOnce)
      }
      document.addEventListener('click', resumeOnce)
      document.addEventListener('touchstart', resumeOnce)
      document.addEventListener('wheel', resumeOnce, { passive: true })
    })
  }
}

/** 停止并释放背景音乐资源 */
function stop() {
  if (audio) {
    audio.pause()
    audio = null
  }
}

onMounted(() => {
  tryPlay()
})

onUnmounted(() => {
  stop()
})
</script>

<template>
  <!-- 背景音乐组件为纯逻辑组件，不渲染任何 UI 元素 -->
</template>
