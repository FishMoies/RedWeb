<script setup>
/**
 * MusicPlayer.vue
 *
 * 轻量级背景音乐控制器浮窗
 * - 玻璃拟态（glassmorphism）设计
 * - 状态驱动 UI（idle / loading / playing / paused / blocked）
 * - 悬停展开 / 收起
 * - 音量控制
 */
import { ref } from 'vue'
import { useAudioPlayer } from '@/composables/useAudioPlayer'

// ===== 音频控制器 =====
const {
  state,
  volume,
  isMuted,
  isPlaying,
  isBlocked,
  songName,
  togglePlay,
  setVolume,
  toggleMute
} = useAudioPlayer()

// ===== 局部 UI 状态 =====
const expanded = ref(false)

/** 悬停时展开 */
function onMouseEnter() {
  expanded.value = true
}

/** 离开时收起 */
function onMouseLeave() {
  expanded.value = false
}

// ============================================================
//  音量拖拽处理
// ============================================================

/**
 * 通过点击或拖拽音量条设置音量
 */
function handleVolumeChange(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left
  const pct = Math.max(0, Math.min(1, x / rect.width))
  setVolume(pct)
}

// ============================================================
//  图标 & 文案辅助
// ============================================================

const stateIcon = {
  idle: '▶',
  loading: '⟳',
  playing: '⏸',
  paused: '▶',
  blocked: '🔇'
}

const stateHint = {
  idle: '播放音乐',
  loading: '加载中…',
  playing: '暂停',
  paused: '继续播放',
  blocked: '浏览器已阻止自动播放，点击解锁'
}
</script>

<template>
  <div
    class="music-player"
    :class="[`state-${state}`, { expanded }]"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    role="button"
    :aria-label="stateHint[state]"
    tabindex="0"
    @keydown.enter.prevent="togglePlay"
    @keydown.space.prevent="togglePlay"
  >
    <!-- ===== 折叠状态触发器 ===== -->
    <div class="player-trigger" @click="togglePlay">
      <!-- 播放时显示波形动画 -->
      <div v-if="isPlaying" class="trigger-waveform">
        <span v-for="i in 4" :key="i" class="trigger-bar" :style="{ animationDelay: `${i * 0.15}s` }" />
      </div>

      <!-- 非播放状态显示状态图标 -->
      <span v-else class="state-icon" v-text="stateIcon[state]" />

      <!-- blocked 状态的呼吸提示光晕 -->
      <div v-if="isBlocked" class="blocked-glow" />
    </div>

    <!-- ===== 展开面板 ===== -->
    <div class="player-panel">
      <!-- 歌曲信息 -->
      <div class="panel-header">
        <span class="panel-note">🎵</span>
        <span class="panel-title">{{ songName }}</span>
        <span class="panel-status">{{ stateHint[state] }}</span>
      </div>

      <!-- 播放控制 -->
      <div class="panel-controls">
        <!-- 主按钮：播放/暂停 -->
        <button
          class="btn-play"
          :class="{ loading: state === 'loading' }"
          :disabled="state === 'loading'"
          @click="togglePlay"
          :aria-label="stateHint[state]"
        >
          <span v-if="state === 'loading'" class="spinner" />
          <span v-else v-text="stateIcon[state]" />
        </button>

        <!-- 音量控制 -->
        <div class="volume-group">
          <button
            class="btn-mute"
            @click="toggleMute"
            :aria-label="isMuted ? '取消静音' : '静音'"
          >
            {{ isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊' }}
          </button>
          <div
            class="volume-track"
            @click="handleVolumeChange"
            @mousemove="(e) => e.buttons === 1 && handleVolumeChange(e)"
          >
            <div
              class="volume-fill"
              :style="{ width: `${(isMuted ? 0 : volume) * 100}%` }"
            />
            <div
              class="volume-thumb"
              :style="{ left: `${(isMuted ? 0 : volume) * 100}%` }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ================================================================
   音乐浮窗容器
   ================================================================ */
.music-player {
  /* 定位 — 固定在右下角 */
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 9999;

  /* 交互 */
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  /* 默认圆形触发器大小 */
  width: 48px;
  height: 48px;

  /* 过渡 */
  transition:
    width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    height 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    border-radius 0.3s ease;

  /* 玻璃拟态基础 */
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;

  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.18),
    0 1px 4px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);

  /* 字号基准 */
  font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  color: #fff;
}

/* ================================================================
   展开状态
   ================================================================ */
.music-player.expanded {
  width: 260px;
  height: auto;
  border-radius: 16px;
  cursor: default;
}

/* ================================================================
   触发器（折叠状态可见）
   ================================================================ */
.player-trigger {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  z-index: 2;
}

.state-icon {
  position: relative;
  z-index: 2;
  font-size: 18px;
  line-height: 1;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3));
  transition: transform 0.2s ease;
}

.music-player:not(.expanded) .player-trigger:hover .state-icon {
  transform: scale(1.15);
}

/* --- 触发器波形动画（播放时替换图标） --- */
.trigger-waveform {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  height: 20px;
}

.trigger-bar {
  display: block;
  width: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.8);
  animation: triggerWave 0.6s ease-in-out infinite alternate;
}

.trigger-bar:nth-child(1) { height: 10px; }
.trigger-bar:nth-child(2) { height: 16px; }
.trigger-bar:nth-child(3) { height: 12px; }
.trigger-bar:nth-child(4) { height: 8px; }

@keyframes triggerWave {
  0% {
    transform: scaleY(0.6);
    background: rgba(255, 255, 255, 0.5);
  }
  100% {
    transform: scaleY(1);
    background: rgba(255, 255, 255, 0.95);
  }
}

/* ================================================================
   blocked 呼吸光晕
   ================================================================ */
.blocked-glow {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 200, 50, 0.25) 0%, transparent 70%);
  animation: blockedPulse 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes blockedPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

/* ================================================================
   展开面板
   ================================================================ */
.player-panel {
  opacity: 0;
  visibility: hidden;
  padding: 16px 16px 14px;
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
}

.expanded .player-panel {
  opacity: 1;
  visibility: visible;
  transition-delay: 0.08s;
}

/* --- 头部：歌名 --- */
.panel-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  white-space: nowrap;
  overflow: hidden;
}

.panel-note {
  font-size: 16px;
  flex-shrink: 0;
}

.panel-title {
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.3px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(255, 255, 255, 0.92);
}

.panel-status {
  margin-left: auto;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

/* --- 控制区 --- */
.panel-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 播放按钮 */
.btn-play {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.15s ease;
}

.btn-play:hover {
  background: rgba(255, 255, 255, 0.28);
}

.btn-play:active {
  transform: scale(0.92);
}

.btn-play:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-play.loading span {
  display: flex;
}

/* 加载旋转器 */
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* --- 音量组 --- */
.volume-group {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-mute {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  transition: transform 0.15s ease;
}

.btn-mute:hover {
  transform: scale(1.15);
}

.volume-track {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.15);
  position: relative;
  cursor: pointer;
  transition: height 0.2s ease;
}

.volume-track:hover {
  height: 6px;
}

.volume-fill {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.9));
  transition: width 0.1s ease;
}

.volume-thumb {
  position: absolute;
  top: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  transform: translate(-50%, -50%);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.volume-track:hover .volume-thumb {
  opacity: 1;
}

/* ================================================================
   暗色主题适配
   ================================================================ */
@media (prefers-color-scheme: dark) {
  .music-player {
    background: rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow:
      0 4px 24px rgba(0, 0, 0, 0.4),
      0 1px 4px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }
}

/* ================================================================
   移动端适配
   ================================================================ */
@media (max-width: 640px) {
  .music-player {
    right: 16px;
    bottom: 16px;
  }

  .music-player.expanded {
    width: 220px;
  }

  .player-panel {
    padding: 14px 12px 12px;
  }
}

/* ================================================================
   无障碍：聚焦样式
   ================================================================ */
.music-player:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.6);
  outline-offset: 4px;
}

.btn-play:focus-visible,
.btn-mute:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}
</style>
