<script setup>
import { ref } from 'vue'
import { secondItemJpg } from '@/assets'
import { useMouseParallax } from '@/composables/useMouseParallax'
import { useDeviceDetect } from '@/composables/useDeviceDetect'

const { isMobile } = useDeviceDetect()

const mapRef = ref(null)

const { onSectionEnter, onSectionLeave } = useMouseParallax(mapRef, {
  maxRotate: 25,
  scale: 1.05
})

defineExpose({ onSectionEnter, onSectionLeave })
</script>

<template>
  <div class="item-content map-item">
    <div class="map-text">
      <h2 class="second-title" style="font-size: clamp(2rem, 3vw, 3.5rem); margin-bottom: clamp(12px, 1.5vw, 20px); text-align: center;">苍山如海 残阳如血</h2>
      <div class="map-stats-grid">
        <div class="stat-card">
          <span class="stat-number">14</span>
          <span class="stat-unit">个</span>
          <span class="stat-label">途经省份</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">18</span>
          <span class="stat-unit">座</span>
          <span class="stat-label">翻越大山</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">24</span>
          <span class="stat-unit">条</span>
          <span class="stat-label">跨过江河</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">600<small>+</small></span>
          <span class="stat-unit">次</span>
          <span class="stat-label">战役战斗</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">700<small>+</small></span>
          <span class="stat-unit">座</span>
          <span class="stat-label">攻占县城</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">430<small>+</small></span>
          <span class="stat-unit">人</span>
          <span class="stat-label">干部牺牲</span>
        </div>
        <div v-if="!isMobile" class="stat-card">
          <span class="stat-number">25000</span>
          <span class="stat-unit">里</span>
          <span class="stat-label">行军里程</span>
        </div>
        <div v-if="!isMobile" class="stat-card">
          <span class="stat-number"><30</span>
          <span class="stat-unit">岁</span>
          <span class="stat-label">平均年龄</span>
        </div>
      </div>
    </div>
    <div class="map-container">
      <img ref="mapRef" :src="secondItemJpg" class="map-image" />
    </div>
  </div>
</template>

<style scoped>
/* ===== 标题字体 ===== */
.second-title {
  font-family: 'Huiwen', sans-serif;
  line-height: 1.2;
  color: #C41D1D;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  margin: 0;
}

.map-item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: clamp(16px, 3vw, 40px);
  height: 100%;
  padding: 0 clamp(16px, 3vw, 40px);
  box-sizing: border-box;
  max-width: 90%;
  width: 100%;
}

/* ===== 标题字体 ===== */
.second-title {
  font-family: 'Huiwen', sans-serif;
  line-height: 1.2;
  color: #C41D1D;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  margin: 0;
}

.map-text {
  flex: 0 0 50%;
  max-width: 50%;
  padding-right: clamp(12px, 2vw, 24px);
  box-sizing: border-box;
  font-family: "Noto Serif SC", serif;
  font-size: clamp(14px, 1.6vw, 24px);
  line-height: 1.8;
  color: #ffffff;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
  text-align: justify;
}

.map-container {
  flex: 0 0 50%;
  max-width: 50%;
  padding-left: clamp(12px, 2vw, 24px);
  box-sizing: border-box;
  perspective: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.map-image {
  transform-style: preserve-3d;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow:
    0 20px 40px rgba(255, 255, 255, 0.3),
    0 0 60px rgba(255, 255, 255, 0.15);
  border-radius: clamp(8px, 1vw, 16px);
  width: 100%;
  height: auto;
  max-height: 70vh;
  object-fit: contain;
  cursor: pointer;
}

.map-image:hover {
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.4);
}

.map-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(8px, 1vw, 14px);
  width: 100%;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: clamp(12px, 2vw, 24px) clamp(8px, 1.5vw, 16px);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: clamp(8px, 1vw, 16px);
  backdrop-filter: blur(4px);
  transition: transform 0.3s ease, background 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.14);
}

.stat-number {
  font-family: 'Huiwen', sans-serif;
  font-size: clamp(1.8rem, 3vw, 3.5rem);
  line-height: 1;
  color: #C41D1D;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.stat-number small {
  font-size: 0.5em;
  vertical-align: super;
}

.stat-unit {
  font-family: "Noto Serif SC", serif;
  font-size: clamp(11px, 1vw, 16px);
  color: rgba(255, 255, 255, 0.6);
  line-height: 1;
}

.stat-label {
  font-family: "Noto Serif SC", serif;
  font-size: clamp(12px, 1.2vw, 18px);
  color: #ffffff;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
  line-height: 1.4;
}

@media (max-width: 768px) {
  .map-item {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    height: 100%;
  }

  .map-text {
    flex: 0 0 auto;
    max-width: 100%;
    width: 100%;
    padding-right: 0;
    font-size: clamp(13px, 3.5vw, 18px);
    line-height: 1.6;
    text-align: left;
    max-height: 45vh;
    overflow-y: auto;
  }

  .map-container {
    flex: 0 0 auto;
    max-width: 100%;
    width: 100%;
    padding-left: 0;
    display: flex !important;
  }

  .map-image {
    max-height: 40vh;
    width: auto;
    max-width: 100%;
  }

  .map-stats-grid {
    gap: 8px;
  }

  .stat-card {
    padding: 10px 6px;
  }

  .stat-number {
    font-size: clamp(1.2rem, 6vw, 1.8rem);
  }
}
</style>
