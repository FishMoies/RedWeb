<script setup>
/**
 * MusicPlayerPanel.vue
 *
 * 音乐播放器展开面板组件。
 * 包含歌曲信息、播放控制、音量调节。
 * 与 MusicPlayer 组合使用，通过 props/emits 通信。
 */
defineProps({
  songName: { type: String, default: '' },
  stateHint: { type: Object, default: () => ({}) },
  stateIcon: { type: Object, default: () => ({}) },
  state: { type: String, default: 'idle' },
  volume: { type: Number, default: 0.5 },
  isMuted: { type: Boolean, default: false },
  expanded: { type: Boolean, default: false }
})

const emit = defineEmits(['toggle-play', 'toggle-mute', 'volume-change'])

function handleVolumeChange(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left
  const pct = Math.max(0, Math.min(1, x / rect.width))
  emit('volume-change', pct)
}
</script>

<template>
  <div class="player-panel" :class="{ 'panel-visible': expanded }">
    <!-- 歌曲信息 -->
    <div class="panel-header">
      <span class="panel-note">🎵</span>
      <span class="panel-title">{{ songName }}</span>
      <span class="panel-status">{{ stateHint[state] || '' }}</span>
    </div>

    <!-- 播放控制 -->
    <div class="panel-controls">
      <button
        class="btn-play"
        :class="{ loading: state === 'loading' }"
        :disabled="state === 'loading'"
        @click="emit('toggle-play')"
        :aria-label="stateHint[state] || ''"
      >
        <span v-if="state === 'loading'" class="spinner" />
        <span v-else v-text="stateIcon[state] || '▶'" />
      </button>

      <!-- 音量控制 -->
      <div class="volume-group">
        <button
          class="btn-mute"
          @click="emit('toggle-mute')"
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
</template>

<style scoped>
.player-panel {
  opacity: 0;
  visibility: hidden;
  padding: 16px 16px 14px;
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
}

.player-panel.panel-visible {
  opacity: 1;
  visibility: visible;
  transition-delay: 0.08s;
}

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

.panel-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

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

@media (max-width: 640px) {
  .player-panel {
    padding: 14px 12px 12px;
  }
}

.btn-play:focus-visible,
.btn-mute:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}
</style>
