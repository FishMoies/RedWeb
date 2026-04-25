<script setup>
import { ref } from 'vue'
import { useDeviceDetect } from '@/composables/useDeviceDetect'
import { useTimelineReveal } from '@/composables/useTimelineReveal'

const timelineRef = ref(null)
const { isMobile } = useDeviceDetect()
const { visible } = useTimelineReveal(timelineRef, { threshold: 0.25 })

/**
 * 7个长征关键历史事件
 */
const timelineEvents = [
  {
    year: '1934.10',
    title: '瑞金出发',
    icon: '🚩',
    desc: '中央红军8.6万余人从江西瑞金出发长征',
    color: '#C41D1D'
  },
  {
    year: '1934.12',
    title: '湘江战役',
    icon: '💔',
    desc: '长征中最惨烈的一战，从8.6万人锐减至3万余人。',
    color: '#8B0000'
  },
  {
    year: '1935.01',
    title: '遵义会议',
    icon: '📜',
    desc: '确立毛泽东的领导地位，挽救了党和红军。',
    color: '#D4A017'
  },
  {
    year: '1935.05',
    title: '飞夺泸定桥',
    icon: '🌉',
    desc: '红四团22名突击队员奔袭铁索，突破天险大渡河。',
    color: '#B8860B'
  },
  {
    year: '1935.08',
    title: '过草地',
    icon: '🌾',
    desc: '穿越松潘草地，气候恶劣、沼泽遍布、断粮断炊。',
    color: '#556B2F'
  },
  {
    year: '1935.10',
    title: '抵达陕北',
    icon: '🏁',
    desc: '中央红军到达陕北吴起镇。',
    color: '#C41D1D'
  },
  {
    year: '1936.10',
    title: '会宁会师',
    icon: '🤝',
    desc: '三大主力红军在甘肃会宁胜利会师。',
    color: '#FFD700'
  }
]
</script>

<template>
  <div
    ref="timelineRef"
    class="timeline-wrapper"
    :class="{ visible }"
  >
    <!-- 标题区（移动端隐藏） -->
    <div v-if="!isMobile" class="timeline-header">
      <h2 class="timeline-main-title">长征大事记</h2>
      <p class="timeline-subtitle">从瑞金到会宁 · 两万五千里的征程</p>
    </div>

    <!-- 时间轴轨道 -->
    <div class="timeline-track">
      <!-- 年份徽标层 -->
      <div class="timeline-years">
        <div
          v-for="(event, i) in timelineEvents"
          :key="i"
          class="year-node"
        >
          <span class="year-badge">{{ event.year }}</span>
          <div class="year-connector" />
        </div>
      </div>

      <!-- 中轴线 + 圆点层 -->
      <div class="timeline-rail-layer">
        <div class="timeline-rail" />
        <div
          v-for="(event, i) in timelineEvents"
          :key="i"
          class="rail-dot"
          :style="{ '--dot-color': event.color }"
        >
          <span class="dot-icon">{{ event.icon }}</span>
        </div>
      </div>

      <!-- 事件卡片层 -->
      <div class="timeline-cards">
        <div
          v-for="(event, i) in timelineEvents"
          :key="i"
          class="card-node"
        >
          <div class="card-connector" />
          <div class="event-card">
            <h3 class="card-title">{{ event.title }}</h3>
            <p class="card-desc">{{ event.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端竖向时间轴 -->
    <div v-if="isMobile" class="timeline-vertical">
      <div
        v-for="(event, i) in timelineEvents"
        :key="i"
        class="tv-item"
        :style="{ '--tv-delay': i * 0.12 + 's' }"
      >
        <div class="tv-dot-col">
          <span class="tv-year">{{ event.year }}</span>
          <div class="tv-dot-wrap">
            <div
              class="tv-dot"
              :style="{ '--dot-color': event.color }"
            >
              <span class="tv-icon">{{ event.icon }}</span>
            </div>
            <div v-if="i < timelineEvents.length - 1" class="tv-line" />
          </div>
        </div>
        <div class="tv-content-col">
          <h3 class="tv-title">{{ event.title }}</h3>
          <p class="tv-desc">{{ event.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== 外层容器 ===== */
.timeline-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(20px, 3vw, 48px);
  box-sizing: border-box;
  gap: clamp(16px, 3vh, 40px);
}

/* ===== 标题区 ===== */
.timeline-header {
  text-align: center;
}

.timeline-main-title {
  font-family: 'Huiwen', sans-serif;
  font-size: clamp(2rem, 4vw, 4rem);
  line-height: 1.3;
  color: #ffffff;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
  margin: 0 0 clamp(4px, 0.6vw, 10px);
}

.timeline-subtitle {
  font-family: 'Noto Serif SC', serif;
  font-size: clamp(0.85rem, 1.4vw, 1.4rem);
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.2em;
  margin: 0;
}

.timeline-wrapper.visible .timeline-main-title {
  animation: fadeSlideIn 0.7s ease-out both;
}
.timeline-wrapper.visible .timeline-subtitle {
  animation: fadeSlideIn 0.7s ease-out both;
  animation-delay: 0.15s;
}

/* ===== 时间轴轨道 ===== */
.timeline-track {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  gap: 0;
}

/* ===== 年份徽标层 ===== */
.timeline-years {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: clamp(8px, 1.5vw, 24px);
  padding-bottom: 12px;
}

.year-node {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.year-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  background: rgba(196, 29, 29, 0.15);
  border: 1px solid rgba(196, 29, 29, 0.35);
  border-radius: 14px;
  font-family: 'Noto Serif SC', serif;
  font-size: clamp(0.7rem, 0.85vw, 0.95rem);
  font-weight: 600;
  color: #C41D1D;
  white-space: nowrap;
  letter-spacing: 0.05em;
  backdrop-filter: blur(4px);
}

.year-connector {
  width: 2px;
  height: clamp(12px, 1.5vh, 20px);
  background: linear-gradient(to bottom, #C41D1D, rgba(196, 29, 29, 0.3));
}

/* ===== 中轴线 + 圆点层 ===== */
.timeline-rail-layer {
  position: relative;
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: clamp(8px, 1.5vw, 24px);
}

.timeline-rail {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 3px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(196, 29, 29, 0.2) 8%,
    rgba(196, 29, 29, 0.8) 30%,
    rgba(196, 29, 29, 1) 50%,
    rgba(196, 29, 29, 0.8) 70%,
    rgba(196, 29, 29, 0.2) 92%,
    transparent 100%
  );
  transform: translateY(-50%);
  border-radius: 2px;
  box-shadow: 0 0 20px rgba(196, 29, 29, 0.3);
}

.rail-dot {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  min-width: 0;
}

.rail-dot::before {
  content: '';
  width: clamp(28px, 3.2vw, 44px);
  height: clamp(28px, 3.2vw, 44px);
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    var(--dot-color, #C41D1D),
    color-mix(in srgb, var(--dot-color, #C41D1D) 70%, #000)
  );
  border: 2px solid rgba(255, 255, 255, 0.35);
  box-shadow:
    0 0 16px var(--dot-color, #C41D1D),
    0 0 40px rgba(196, 29, 29, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot-icon {
  position: absolute;
  font-size: clamp(0.85rem, 1.2vw, 1.4rem);
  line-height: 1;
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.3));
  pointer-events: none;
}

/* ===== 事件卡片层 ===== */
.timeline-cards {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: clamp(8px, 1.5vw, 24px);
  padding-top: 12px;
}

.card-node {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.card-connector {
  width: 2px;
  height: clamp(12px, 1.5vh, 20px);
  background: linear-gradient(to top, rgba(255, 255, 255, 0.3), transparent);
}

.event-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
  padding: clamp(8px, 1vw, 16px) clamp(6px, 0.8vw, 14px);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: clamp(6px, 0.8vw, 12px);
  backdrop-filter: blur(4px);
  width: 100%;
  max-width: clamp(80px, 12vw, 160px);
  box-sizing: border-box;
  transition: transform 0.4s ease, background 0.4s ease, box-shadow 0.4s ease;
}

.event-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 24px rgba(196, 29, 29, 0.15);
}

.card-title {
  font-family: 'Huiwen', sans-serif;
  font-size: clamp(0.8rem, 1vw, 1.2rem);
  line-height: 1.3;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
}

.card-desc {
  font-family: 'Noto Serif SC', serif;
  font-size: clamp(0.55rem, 0.65vw, 0.78rem);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== 入场动画 ===== */
.timeline-wrapper.visible .timeline-rail {
  animation: railGrow 0.8s ease-out both;
  animation-delay: 0.1s;
  transform-origin: center center;
}

@keyframes railGrow {
  from {
    transform: translateY(-50%) scaleX(0);
    opacity: 0;
  }
  to {
    transform: translateY(-50%) scaleX(1);
    opacity: 1;
  }
}

.timeline-wrapper.visible .rail-dot {
  animation: dotBounceIn 0.5s ease-out both;
}

.timeline-wrapper.visible .rail-dot:nth-child(1) { animation-delay: 0.20s; }
.timeline-wrapper.visible .rail-dot:nth-child(2) { animation-delay: 0.30s; }
.timeline-wrapper.visible .rail-dot:nth-child(3) { animation-delay: 0.40s; }
.timeline-wrapper.visible .rail-dot:nth-child(4) { animation-delay: 0.50s; }
.timeline-wrapper.visible .rail-dot:nth-child(5) { animation-delay: 0.60s; }
.timeline-wrapper.visible .rail-dot:nth-child(6) { animation-delay: 0.70s; }
.timeline-wrapper.visible .rail-dot:nth-child(7) { animation-delay: 0.80s; }

@keyframes dotBounceIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.timeline-wrapper.visible .year-node {
  animation: slideFromTop 0.6s ease-out both;
}

.timeline-wrapper.visible .year-node:nth-child(1) { animation-delay: 0.25s; }
.timeline-wrapper.visible .year-node:nth-child(2) { animation-delay: 0.35s; }
.timeline-wrapper.visible .year-node:nth-child(3) { animation-delay: 0.45s; }
.timeline-wrapper.visible .year-node:nth-child(4) { animation-delay: 0.55s; }
.timeline-wrapper.visible .year-node:nth-child(5) { animation-delay: 0.65s; }
.timeline-wrapper.visible .year-node:nth-child(6) { animation-delay: 0.75s; }
.timeline-wrapper.visible .year-node:nth-child(7) { animation-delay: 0.85s; }

.timeline-wrapper.visible .card-node {
  animation: slideFromBottom 0.6s ease-out both;
}

.timeline-wrapper.visible .card-node:nth-child(1) { animation-delay: 0.30s; }
.timeline-wrapper.visible .card-node:nth-child(2) { animation-delay: 0.40s; }
.timeline-wrapper.visible .card-node:nth-child(3) { animation-delay: 0.50s; }
.timeline-wrapper.visible .card-node:nth-child(4) { animation-delay: 0.60s; }
.timeline-wrapper.visible .card-node:nth-child(5) { animation-delay: 0.70s; }
.timeline-wrapper.visible .card-node:nth-child(6) { animation-delay: 0.80s; }
.timeline-wrapper.visible .card-node:nth-child(7) { animation-delay: 0.90s; }

@keyframes slideFromTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes slideFromBottom {
  from {
    opacity: 0;
    transform: translateY(20px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

/* ===== 移动端适配 ===== */
@media (max-width: 768px) {
  .timeline-wrapper {
    padding: 16px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .timeline-track {
    min-width: 700px;
  }

  .event-card {
    max-width: 70px;
    padding: 6px 4px;
  }

  .card-title {
    font-size: 0.7rem;
  }

  .card-desc {
    display: none;
  }

  .year-badge {
    padding: 3px 6px;
    font-size: 0.6rem;
  }

  .rail-dot::before {
    width: 24px;
    height: 24px;
  }

  .dot-icon {
    font-size: 0.7rem;
  }

  .card-connector,
  .year-connector {
    height: 8px;
  }

  .timeline-rail-layer {
    height: 36px;
  }
}

@media (max-width: 480px) {
  .timeline-track {
    min-width: 560px;
  }
}

/* ===== 移动端竖向时间轴 ===== */
.timeline-vertical {
  width: 100%;
  max-width: 480px;
  padding: 20px 16px 40px;
  box-sizing: border-box;
}

.tv-item {
  display: flex;
  gap: 12px;
  opacity: 0;
  transform: translateX(-12px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  transition-delay: var(--tv-delay, 0s);
}

.timeline-wrapper.visible .tv-item {
  opacity: 1;
  transform: translateX(0);
}

.tv-dot-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 56px;
  flex-shrink: 0;
}

.tv-year {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 8px;
  background: rgba(196, 29, 29, 0.15);
  border: 1px solid rgba(196, 29, 29, 0.35);
  border-radius: 12px;
  font-family: 'Noto Serif SC', serif;
  font-size: 0.65rem;
  font-weight: 600;
  color: #C41D1D;
  white-space: nowrap;
  letter-spacing: 0.05em;
  backdrop-filter: blur(4px);
  margin-bottom: 8px;
}

.tv-dot-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.tv-dot {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    var(--dot-color, #C41D1D),
    color-mix(in srgb, var(--dot-color, #C41D1D) 70%, #000)
  );
  border: 2px solid rgba(255, 255, 255, 0.35);
  box-shadow:
    0 0 12px var(--dot-color, #C41D1D),
    0 0 30px rgba(196, 29, 29, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 2;
}

.tv-icon {
  font-size: 0.9rem;
  line-height: 1;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3));
  pointer-events: none;
}

.tv-line {
  width: 2px;
  flex: 1;
  min-height: 28px;
  background: linear-gradient(
    to bottom,
    var(--dot-color, #C41D1D),
    rgba(196, 29, 29, 0.15)
  );
}

.tv-content-col {
  flex: 1;
  padding: 4px 0 28px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tv-title {
  font-family: 'Huiwen', sans-serif;
  font-size: 1rem;
  line-height: 1.4;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
}

.tv-desc {
  font-family: 'Noto Serif SC', serif;
  font-size: 0.75rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.timeline-wrapper.visible .tv-dot {
  animation: tvDotBounce 0.45s ease-out both;
  animation-delay: calc(var(--tv-delay) + 0.15s);
}

@keyframes tvDotBounce {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.timeline-wrapper.visible .tv-year {
  animation: tvFadeSlide 0.4s ease-out both;
  animation-delay: calc(var(--tv-delay) + 0.05s);
}

@keyframes tvFadeSlide {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.timeline-wrapper.visible .tv-content-col {
  animation: tvContentSlide 0.5s ease-out both;
  animation-delay: calc(var(--tv-delay) + 0.25s);
}

@keyframes tvContentSlide {
  from {
    opacity: 0;
    transform: translateX(-10px);
    filter: blur(3px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
    filter: blur(0);
  }
}

@media (max-width: 768px) {
  .timeline-wrapper {
    overflow: visible;
    height: auto;
    min-height: 100vh;
    justify-content: flex-start;
    padding: 20px 0;
  }

  .timeline-track {
    display: none;
  }

  .timeline-wrapper.visible .tv-item {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 桌面端隐藏竖向时间轴 */
@media (min-width: 769px) {
  .timeline-vertical {
    display: none !important;
  }
}
</style>
