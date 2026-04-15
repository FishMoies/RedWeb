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

</style>

<style>

@font-face {
  font-family: 'Huiwen';
  src: url('/src/assets/汇文明朝体.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}

</style>

