<script setup>
import { backgroundMp4, backgroundPng } from '@/assets'

const firstScreenBg = `linear-gradient(to left, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 80%), url(${backgroundPng}) no-repeat right center / cover`
</script>

<template>
  <div class="section">
    <div class="frist-section-content">

      <!-- 手机端视频背景 -->
      <video class="bg-video" autoplay muted loop playsinline>
        <source :src="backgroundMp4" type="video/mp4" />
      </video>

      <!-- 黑色蒙版 -->
      <div class="overlay"></div>

      <p class="title">
        要将<span class="highlight">长征精神</span><br>贯彻到底！
        <br>
        <span class="subtitle">
          宣言书、宣传队和播种机
        </span>
      </p>

    </div>
  </div>
</template>

<style scoped>
.frist-section-content {
  height: 100vh;
  background-color: black;

  display: flex;
  justify-content: flex-start;
  align-items: center;

  position: relative;
  overflow: hidden;
}

.bg-video {
  display: none;   /* 默认PC不显示 */
}

.overlay {
  display: none;
}

.title {
  /* 定义块级样式 */
  margin-left: 150px;

  /* 文字样式 */
  font-family: 'Huiwen', sans-serif;
  font-size: 5vw;
  line-height: 1.2;
  color: rgb(255, 255, 255);
}

.highlight {
  color: #C41D1D;
}

.subtitle {
  margin-left: 10px;

  font-family: 'Huiwen', sans-serif;
  font-size: 2vw;
  line-height: 1.2;
  color: rgb(255, 255, 255);
}

.text {
  margin-top: 20px;
  margin-left: 10px;
  font-size: 1.7vw;
  line-height: 1.2;
  color: #ffffff;

  width: 45%;

  font-family: "Noto Serif SC", serif;
}

.frist-section-content::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  width: 60%;   /* 控制图片占比 */
  height: 100%;

  background: v-bind(firstScreenBg);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .frist-section-content {
    justify-content: center;/* 居中 */
  }

  .title {
    margin: 0;
    max-width: 90%;
    text-align: center;
    font-size: clamp(30px, 10vw, 60px);
    line-height: 1.2;
    position: relative;
    z-index: 2;   /* 保证在最上层 */
  }

  .frist-section-content::after {
    content: none;
  }

  .subtitle {
    font-size: clamp(10px, 7vw, 30px);
    opacity: 0.9;
    position: relative;
    z-index: 2;   /* 保证在最上层 */
  }

  .bg-video {
    display: block;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }

  .overlay {
    display: block;
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.8); /* 半透明黑 */
    z-index: 1;
  }
}
</style>
