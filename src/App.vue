<script setup>

import { onMounted, onUnmounted } from 'vue'
import fullpage from 'fullpage.js'
import 'fullpage.js/dist/fullpage.css'

let fpInstance = null

onMounted(() => {
  fpInstance = new fullpage('#fullpage', {
    autoScrolling: true,
    navigation: true,
  })
})

onUnmounted(() => {
  if (fpInstance) {
    fpInstance.destroy('all')
  }
})

</script>

<template>
  <div id="fullpage">
    
    <div class="section">
      <!-- 主页第一屏 -->
      <div class="frist-section-content">

        <!-- 手机端视频背景 -->
        <video class="bg-video" autoplay muted loop playsinline>
          <source src="/src/assets/Background.mp4" type="video/mp4" />
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

    <div class="section">第二屏</div>
    <div class="section">第三屏</div>
  </div>
</template>

<style scoped>

body {
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
}

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
  color: rgb(186, 20, 20);
}

.subtitle {
  margin-left: 10px;

  font-family: 'Huiwen', sans-serif;
  font-size: 2vw;
  line-height: 1.2;
  color: rgb(255, 255, 255);
}

.frist-section-content::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  width: 60%;   /* 控制图片占比 */
  height: 100%;

  background: 
    linear-gradient(
      to left,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 80%
    ),
    url('/src/assets/Background.png') no-repeat right center;
  background-size: cover;
}




/* 为移动端做适配 */

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

<style>

@font-face {
  font-family: 'Huiwen';
  src: url('/src/assets/汇文明朝体.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}



</style>

