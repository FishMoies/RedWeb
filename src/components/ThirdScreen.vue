<script setup>
import { background3Png } from '@/assets'

const thirdScreenBg = `url(${background3Png}) no-repeat center center / cover`
</script>

<template>
  <div class="section third-section">

    <!-- 第三屏背景图片 -->
    <div class="bg-image-third"></div>

    <!-- 桌面版：一行显示 -->
    <div
      v-motion
      :initial="{
        opacity: 0,
        y: 80
      }"
      :visible="{
        opacity: 1,
        y: 0,
        transition: {
          delay: 150,
          duration: 700,
          ease: 'easeOut'
        }
      }"
      class="thrid-title desktop-only"
    >
        雄关漫道真如铁 而今迈步从头越
    </div>

    <!-- 移动版：两行显示 -->
    <div
      v-motion
      :initial="{
        opacity: 0,
        y: 80
      }"
      :visible="{
        opacity: 1,
        y: 0,
        transition: {
          delay: 150,
          duration: 700,
          ease: 'easeOut'
        }
      }"
      class="thrid-title mobile-only"
    >
        雄关漫道真如铁<br>而今迈步从头越
    </div>
    <div
      v-motion
      :initial="{
        opacity: 0,
        y: 60
      }"
      :visible="{
        opacity: 1,
        y: 0,
        transition: {
          delay: 300,
          duration: 700,
          ease: 'easeOut'
        }
      }"
      class="thrid-text"
    >
      Fortified passes are truly like iron; now we stride forward from the very beginning again.
    </div>

  </div>
</template>

<style scoped>
/* 第三屏容器样式 */
.third-section {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.thrid-title {
  font-family: 'Huiwen', sans-serif;
  font-size: clamp(2.5rem, 4.0vw, 4.5rem);
  line-height: 1.2;
  color: #C41D1D;
  margin-bottom: clamp(20px, 3vw, 40px);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  text-align: center;

  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0%;
}

/* 桌面版默认显示，移动版默认隐藏 */
.desktop-only {
  display: flex;
}

.mobile-only {
  display: none;
}

.thrid-text {
  font-family: "Noto Serif SC", serif;
  font-size: 1.0vw;
  line-height: 1.0;
  color: #000000;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
  text-align: center;

  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* 第三屏背景图片样式 */
.bg-image-third {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: v-bind(thirdScreenBg);
  z-index: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  /* 在移动端切换显示：隐藏桌面版，显示移动版 */
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: flex;
  }

  /* 在移动端隐藏英文翻译 */
  .thrid-text {
    display: none;
  }
}
</style>
