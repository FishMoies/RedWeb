<script setup>
/**
 * MusicPlayer.vue
 *
 * 轻量级背景音乐控制器浮窗
 * - 玻璃拟态（glassmorphism）设计
 * - 状态驱动 UI（idle / loading / playing / paused / blocked）
 * - 悬停展开 / 收起
 * - 使用 MusicPlayerPanel 子组件管理展开面板
 */
import { ref } from 'vue'
import { useAudioPlayer } from '@/composables/useAudioPlayer'
import MusicPlayerPanel from './player/MusicPlayerPanel.vue'

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

function onMouseEnter() {
  expanded.value = true
}

function onMouseLeave() {
  expanded.value = false
}

function onVolumeChange(val) {
  setVolume(val)
}

// ===== 图标 & 文案辅助 =====
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
    <!-- 折叠状态触发器 -->
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

    <!-- 展开面板 -->
    <MusicPlayerPanel
      :song-name="songName"
      :state-hint="stateHint"
      :state-icon="stateIcon"
      :state="state"
      :volume="volume"
      :is-muted="isMuted"
      :expanded="expanded"
      @toggle-play="togglePlay"
      @toggle-mute="toggleMute"
      @volume-change="onVolumeChange"
    />
  </div>
</template>

<style scoped>
.music-player {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 9999;

  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  width: 48px;
  height: 48px;

  transition:
    width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    height 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    border-radius 0.3s ease;

  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;

  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.18),
    0 1px 4px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);

  font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  color: #fff;
}

/* 展开状态 */
.music-player.expanded {
  width: 260px;
  height: auto;
  border-radius: 16px;
  cursor: default;
}

/* 触发器 */
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

/* 触发器波形动画 */
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

/* blocked 呼吸光晕 */
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

/* 暗色主题适配 */
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

/* 移动端适配 */
@media (max-width: 640px) {
  .music-player {
    right: 16px;
    bottom: 16px;
  }

  .music-player.expanded {
    width: 220px;
  }
}

/* 无障碍 */
.music-player:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.6);
  outline-offset: 4px;
}
</style>
