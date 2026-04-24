/**
 * useAudioPlayer
 *
 * 全局唯一的音频播放器 composable。
 *
 * 状态机：idle → loading → playing → paused → blocked
 *
 * 职责：
 * - 创建并管理全局唯一的 Audio 实例（单例）
 * - 状态管理（播放/暂停/加载/阻塞）
 * - 音量控制 & 静音
 * - 自动播放策略处理
 * - 状态持久化（localStorage）
 * - 路由切换不重置（音频实例挂载在模块作用域）
 */
import { ref, computed, readonly, watch } from 'vue'
import { bgMusic } from '@/assets'

// ============================================================
//  模块级变量 —— 全局单例
// ============================================================

/** 全局唯一的 Audio 实例 */
let audio = null

/** 标记当前 composable 是否已初始化 */
let initialized = false

// ============================================================
//  持久化键名
// ============================================================

const STORAGE_KEY_VOLUME = 'redweb_music_volume'
const STORAGE_KEY_ENABLED = 'redweb_music_enabled'

// ============================================================
//  可复用的状态（所有调用者共享同一份引用）
// ============================================================

/** @type {'idle'|'loading'|'playing'|'paused'|'blocked'} */
const state = ref('idle')

/** 音量 0~1 */
const volume = ref(loadVolume())

/** 静音 */
const isMuted = ref(false)

/** 歌曲名称 */
const songName = ref('死别')

// ============================================================
//  辅助函数：localStorage 读写
// ============================================================

function loadVolume() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_VOLUME)
    if (saved !== null) {
      const v = parseFloat(saved)
      return v >= 0 && v <= 1 ? v : 0.5
    }
  } catch { /* 无痕模式可能抛出异常 */ }
  return 0.5
}

function saveVolume(v) {
  try {
    localStorage.setItem(STORAGE_KEY_VOLUME, String(v))
  } catch { /* ignore */ }
}

function loadEnabled() {
  try {
    return localStorage.getItem(STORAGE_KEY_ENABLED) === 'true'
  } catch {
    return false
  }
}

function saveEnabled(val) {
  try {
    localStorage.setItem(STORAGE_KEY_ENABLED, val ? 'true' : 'false')
  } catch { /* ignore */ }
}

// ============================================================
//  核心逻辑
// ============================================================

/** 检查浏览器是否允许自动播放（通过短暂播放测试） */
function checkAutoplaySupport() {
  return new Promise((resolve) => {
    const tester = new Audio()
    tester.volume = 0.001
    tester.src = bgMusic

    const timeout = setTimeout(() => {
      tester.pause()
      resolve(false)
    }, 1000)

    tester.play()
      .then(() => {
        clearTimeout(timeout)
        tester.pause()
        resolve(true)
      })
      .catch(() => {
        clearTimeout(timeout)
        resolve(false)
      })
  })
}

/**
 * 内部初始化音频实例（懒加载）
 * 不直接暴露给外部，由 play / toggle 按需触发
 */
function ensureAudio() {
  if (audio) return

  audio = new Audio(bgMusic)
  audio.loop = true
  audio.preload = 'auto'
  audio.volume = volume.value

  // 监听 audio 事件
  audio.addEventListener('play', () => {
    state.value = 'playing'
  })

  audio.addEventListener('pause', () => {
    state.value = 'paused'
  })

  audio.addEventListener('waiting', () => {
    state.value = 'loading'
  })

  audio.addEventListener('canplay', () => {
    if (state.value === 'loading') {
      state.value = 'paused'
    }
  })

  audio.addEventListener('ended', () => {
    // loop 模式理论上不会触发，但保留兜底
    state.value = 'paused'
  })
}

/**
 * 尝试播放，处理 autoplay 限制
 * 返回 true 表示播放成功，false 表示被阻塞
 */
async function tryPlay() {
  if (!audio) ensureAudio()

  if (audio.src !== bgMusic) {
    audio.src = bgMusic
    audio.load()
  }

  try {
    state.value = 'loading'
    await audio.play()
    state.value = 'playing'
    saveEnabled(true)
    return true
  } catch (err) {
    if (err.name === 'NotAllowedError') {
      // 被浏览器自动播放策略阻止
      state.value = 'blocked'
      saveEnabled(false)
      return false
    }
    // 其他错误
    console.error('音频播放失败:', err)
    state.value = 'idle'
    return false
  }
}

// ============================================================
//  暴露的方法
// ============================================================

/**
 * 播放 / 恢复播放
 * 如果处于 blocked 状态，会在用户交互上下文中重新尝试
 */
async function play() {
  // 如果已处于 playing 状态，不做任何事
  if (state.value === 'playing') return

  // blocked → 重新尝试（此时应在用户手势上下文中）
  if (state.value === 'blocked') {
    await tryPlay()
    return
  }

  await tryPlay()
}

/** 暂停 */
function pause() {
  if (audio && state.value === 'playing') {
    audio.pause()
    // pause 事件会自动设置 state
  }
}

/** 切换播放/暂停 */
async function togglePlay() {
  if (state.value === 'playing') {
    pause()
  } else {
    await play()
  }
}

/**
 * 设置音量
 * @param {number} v 0~1
 */
function setVolume(v) {
  const clamped = Math.max(0, Math.min(1, v))
  volume.value = clamped
  saveVolume(clamped)
  if (audio) {
    audio.volume = clamped
  }
}

/** 切换静音 */
function toggleMute() {
  isMuted.value = !isMuted.value
  if (audio) {
    audio.muted = isMuted.value
  }
}

// ------------------------------------------------------------
//  响应式副作用
// ------------------------------------------------------------

// 当音量响应式变化时同步到 audio 实例
watch(volume, (val) => {
  if (audio) {
    audio.volume = val
  }
})

// ============================================================
//  初始化函数（在 App.vue 的 onMounted 中调用）
// ============================================================

/**
 * 初始化音频播放器：
 * 1. 创建 Audio 实例
 * 2. 立即注册 wheel/touchstart 监听（不等待 autoplay 检测结果，
 *    避免 1s 检测窗口内用户已经开始滑动）
 * 3. 尝试自动播放（部分浏览器可能放行同源音频）
 * 4. 若被阻止，监听器触发时在用户手势上下文中同步调用 audio.play()
 *
 * 关键点：在事件回调中直接同步调用 audio.play()，而不是 async 函数，
 * 确保浏览器能正确识别用户手势上下文。
 */
async function initPlayer() {
  if (initialized) return
  initialized = true

  // 预先创建 audio 实例
  ensureAudio()

  // ---- 立即注册滚动/触摸监听（抢在 autoplay 检测之前） ----
  let resumeFired = false

  const resumeOnInteraction = () => {
    if (resumeFired) return
    resumeFired = true

    window.removeEventListener('wheel', resumeOnInteraction)
    window.removeEventListener('touchstart', resumeOnInteraction)

    // 仅在 blocked 状态下恢复（避免重复播放）
    if (state.value !== 'blocked') return

    // ★ 同步调用 audio.play()，确保在用户手势上下文中执行
    state.value = 'loading'
    audio.play()
      .then(() => {
        state.value = 'playing'
        saveEnabled(true)
      })
      .catch((err) => {
        if (err.name === 'NotAllowedError') {
          // 极少数情况：手势上下文仍被拒绝，维持 blocked
          state.value = 'blocked'
        } else {
          console.error('音频播放失败:', err)
          state.value = 'idle'
        }
      })
  }

  // 桌面端：鼠标滚轮滚动时触发
  window.addEventListener('wheel', resumeOnInteraction, { passive: true, once: true })
  // 移动端：触摸屏幕时触发（滑动操作必然以 touchstart 开始）
  window.addEventListener('touchstart', resumeOnInteraction, { passive: true, once: true })

  // ---- 再尝试自动播放（部分浏览器可能放行） ----
  const supported = await checkAutoplaySupport()
  if (supported) {
    // 自动播放成功 → 标记为已触发，防止后续滚动重复播放
    resumeFired = true
    window.removeEventListener('wheel', resumeOnInteraction)
    window.removeEventListener('touchstart', resumeOnInteraction)
    await tryPlay()
  } else {
    // 自动播放被阻止 → 保持 blocked 状态，等待用户滚动/触摸时恢复
    state.value = 'blocked'
    // resumeOnInteraction 已就绪，用户一滑动即可恢复
  }
}

/**
 * 释放资源（在 App.vue 的 onUnmounted 中调用）
 */
function destroyPlayer() {
  if (audio) {
    audio.pause()
    audio.src = ''
    audio.load()
    audio = null
  }
  initialized = false
  state.value = 'idle'
}

// ============================================================
//  导出
// ============================================================

/**
 * 使用方式：
 * ```
 * const player = useAudioPlayer()
 * player.initPlayer()
 * player.togglePlay()
 * ```
 */
export function useAudioPlayer() {
  return {
    // 响应式状态（只读投影）
    state: readonly(state),
    volume: readonly(volume),
    isMuted: readonly(isMuted),
    songName: readonly(songName),

    // 计算属性
    isPlaying: computed(() => state.value === 'playing'),
    isBlocked: computed(() => state.value === 'blocked'),

    // 方法
    togglePlay,
    play,
    pause,
    setVolume,
    toggleMute,
    initPlayer,
    destroyPlayer
  }
}
