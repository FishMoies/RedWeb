<script setup>
import { useDeviceDetect } from '@/composables/useDeviceDetect'
import { useSpiritReveal } from '@/composables/useSpiritReveal'

const { isMobile } = useDeviceDetect()
const { spiritVisible, show } = useSpiritReveal()

defineExpose({ show, spiritVisible })
</script>

<template>
  <div class="item-content spirit-item" :class="{ visible: spiritVisible }">
    <!-- 标题区 -->
    <div class="spirit-header">
      <h2 class="spirit-title">长征精神&nbsp;<span class="spirit-highlight">薪火相传</span></h2>
      <p v-if="!isMobile" class="spirit-subtitle">新时代的长征路，精神永续</p>
    </div>

    <!-- 四张卡片：2x2 网格 -->
    <div class="spirit-grid">
      <div v-if="!isMobile" class="spirit-card">
        <div v-if="!isMobile" class="spirit-card-icon">🚀</div>
        <h3 class="spirit-card-title">航天逐梦</h3>
        <p class="spirit-card-desc">
          从"两弹一星"到载人航天，从北斗组网到火星探测，中国航天人用数十年走完了西方数百年的路——这是通向星辰大海的新长征。
        </p>
      </div>

      <div class="spirit-card">
        <div v-if="!isMobile" class="spirit-card-icon">🏔️</div>
        <h3 class="spirit-card-title">脱贫攻坚</h3>
        <p class="spirit-card-desc">
          近一亿农村贫困人口全部脱贫，832个贫困县全部摘帽。这场人类减贫史上的奇迹，正是"一切为了人民"长征精神的当代实践。
        </p>
      </div>

      <div class="spirit-card">
        <div v-if="!isMobile" class="spirit-card-icon">🛡️</div>
        <h3 class="spirit-card-title">逆行无畏</h3>
        <p class="spirit-card-desc">
          疫情面前，白衣执甲、逆行出征。没有从天而降的英雄，只有挺身而出的凡人——"不怕牺牲、英勇奋斗"的旗帜从未倒下。
        </p>
      </div>

      <div class="spirit-card">
        <div v-if="!isMobile" class="spirit-card-icon">💡</div>
        <h3 class="spirit-card-title">自主创新</h3>
        <p class="spirit-card-desc">
          芯片突围、人工智能、量子计算……面对"卡脖子"困境，新时代科研工作者正以"自力更生、艰苦奋斗"的信念，攀登科技长征路。
        </p>
      </div>
    </div>

    <p class="spirit-footer">每一代人都有每一代人的长征路，每一代人都要走好自己的长征路。</p>
  </div>
</template>

<style scoped>
.spirit-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: clamp(16px, 2.5vw, 36px);
  height: 100%;
  padding: clamp(20px, 4vw, 60px);
  box-sizing: border-box;
  max-width: 90%;
  width: 100%;
}

.spirit-header {
  text-align: center;
  margin-bottom: clamp(4px, 1vw, 12px);
}

.spirit-item.visible .spirit-header {
  animation: fadeInBlurUp 0.8s ease-out both;
}

.spirit-title {
  font-family: 'Huiwen', sans-serif;
  font-size: clamp(2.2rem, 4.5vw, 4.5rem);
  line-height: 1.3;
  color: #ffffff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  margin: 0 0 clamp(8px, 1vw, 16px);
}

.spirit-highlight {
  color: #C41D1D;
}

.spirit-subtitle {
  font-family: "Noto Serif SC", serif;
  font-size: clamp(0.95rem, 1.8vw, 1.8rem);
  color: rgba(255, 255, 255, 0.75);
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
  margin: 0;
  letter-spacing: 0.15em;
}

.spirit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(10px, 1.5vw, 24px);
  width: 100%;
  max-width: 1100px;
}

.spirit-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: clamp(6px, 0.8vw, 12px);
  padding: clamp(16px, 2.5vw, 32px) clamp(12px, 2vw, 24px);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: clamp(10px, 1.2vw, 18px);
  backdrop-filter: blur(4px);
  transition: transform 0.4s ease, background 0.4s ease, box-shadow 0.4s ease;
}

.spirit-item.visible .spirit-card {
  animation: fadeInBlurUp 0.7s ease-out both;
}
.spirit-item.visible .spirit-card:nth-child(1) { animation-delay: 0.15s; }
.spirit-item.visible .spirit-card:nth-child(2) { animation-delay: 0.30s; }
.spirit-item.visible .spirit-card:nth-child(3) { animation-delay: 0.45s; }
.spirit-item.visible .spirit-card:nth-child(4) { animation-delay: 0.60s; }

.spirit-card:hover {
  transform: translateY(-6px);
  background: rgba(255, 255, 255, 0.12);
  box-shadow:
    0 12px 30px rgba(196, 29, 29, 0.15),
    0 0 60px rgba(196, 29, 29, 0.05);
}

.spirit-card-icon {
  font-size: clamp(2rem, 3.5vw, 3.8rem);
  line-height: 1;
  margin-bottom: clamp(2px, 0.3vw, 6px);
  filter: drop-shadow(0 2px 8px rgba(255, 255, 255, 0.2));
}

.spirit-card-title {
  font-family: 'Huiwen', sans-serif;
  font-size: clamp(1.1rem, 1.8vw, 2rem);
  line-height: 1.3;
  color: #C41D1D;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
  margin: 0;
}

.spirit-card-desc {
  font-family: "Noto Serif SC", serif;
  font-size: clamp(0.75rem, 1.1vw, 1.1rem);
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  margin: 0;
  max-width: 95%;
}

.spirit-footer {
  font-family: "Noto Serif SC", serif;
  font-size: clamp(0.85rem, 1.3vw, 1.3rem);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.55);
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
  text-align: center;
  margin: clamp(4px, 0.5vw, 12px) 0 0;
  max-width: 80%;
  font-style: italic;
  letter-spacing: 0.1em;
}

.spirit-item.visible .spirit-footer {
  animation: fadeInBlurUp 0.8s ease-out both;
  animation-delay: 0.75s;
}

@keyframes fadeInBlurUp {
  from {
    opacity: 0;
    filter: blur(10px);
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .spirit-grid {
    grid-template-columns: 1fr;
    gap: 10px;
    max-width: 95%;
  }

  .spirit-card {
    padding: 14px 16px;
    gap: 6px;
  }

  .spirit-card-icon {
    font-size: clamp(1.6rem, 8vw, 2.4rem);
  }

  .spirit-card-title {
    font-size: clamp(1rem, 5vw, 1.4rem);
  }

  .spirit-card-desc {
    font-size: clamp(0.72rem, 3.5vw, 0.95rem);
    line-height: 1.6;
  }

  .spirit-footer {
    max-width: 95%;
    font-size: clamp(0.78rem, 3.5vw, 1rem);
  }

  .spirit-header {
    margin-bottom: 4px;
  }
}
</style>
