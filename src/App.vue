<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import fullpage from 'fullpage.js'
import 'fullpage.js/dist/fullpage.css'
import AppSkeleton from './components/AppSkeleton.vue'

let fpInstance = null
const mapRef = ref(null)
const loading = ref(true)

const handleMouseMove = (e) => {
  const mapEl = mapRef.value
  if (!mapEl) return

  const rect = mapEl.getBoundingClientRect()

  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const offsetX = (x - centerX) / centerX
  const offsetY = (y - centerY) / centerY

  // 限制旋转角度在-25到25度之间，防止过度旋转
  const rotateY = Math.max(-25, Math.min(25, offsetX * 5))   // 左右旋转
  const rotateX = Math.max(-25, Math.min(25, -offsetY * 5))  // 上下倾斜

  mapEl.style.transform = `
    perspective(1000px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    scale(1.05)
  `
}

const resetMap = () => {
  const mapEl = mapRef.value
  if (mapEl) {
    mapEl.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `
  }
}

// 安全初始化器函数
const initFullpage = async () => {
  await nextTick()

  // 使用 requestAnimationFrame 确保 DOM 稳定
  requestAnimationFrame(() => {
    // 如果已有实例，先销毁
    if (fpInstance) {
      fpInstance.destroy('all')
      fpInstance = null
    }

    fpInstance = new fullpage('#fullpage', {
      autoScrolling: true,
      navigation: true,
      scrollOverflow: false,
      fitToSection: true,
      licenseKey: 'gplv3-license',

      afterLoad(origin, destination, direction) {
        // 使用 onmousemove/onmouseleave 替代 addEventListener，避免重复绑定
        const mapEl = mapRef.value
        if (!mapEl) return

        mapEl.onmousemove = handleMouseMove
        mapEl.onmouseleave = resetMap
      },

      onLeave(origin, destination, direction) {
        // 离开时清理事件
        const mapEl = mapRef.value
        if (mapEl) {
          mapEl.onmousemove = null
          mapEl.onmouseleave = null
        }
      }
    })
  })
}

// 强制销毁函数
const destroyFullpage = () => {
  if (fpInstance) {
    fpInstance.destroy('all')
    fpInstance = null
  }
}

onMounted(async () => {
  // 设置加载超时（最大8秒）
  const loadingTimeout = setTimeout(() => {
    console.warn('加载超时，强制显示内容')
    loading.value = false
  }, 8000)
  
  try {
    // 等待字体加载完成
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready
    } else {
      // 如果浏览器不支持，等待1秒
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    // 预加载关键资源（视频、图片）
    await preloadCriticalAssets()
    
    // 延迟一小段时间确保平滑过渡
    setTimeout(() => {
      loading.value = false
      clearTimeout(loadingTimeout)
    }, 500) // 增加延迟确保更平滑
  } catch (error) {
    console.error('加载过程中出错:', error)
    loading.value = false
    clearTimeout(loadingTimeout)
  }
})

// 监听loading变化，初始化fullpage（唯一入口）
watch(loading, (val) => {
  if (!val) {
    initFullpage()
  }
})

// 预加载关键资源
const preloadCriticalAssets = async () => {
  const assets = [
    { src: '/src/assets/Background.mp4', type: 'video' },
    { src: '/src/assets/Background.png', type: 'image' },
    { src: '/src/assets/second-item.jpg', type: 'image' },
    { src: '/src/assets/汇文明朝体.otf', type: 'font' }
  ]
  
  const promises = assets.map(asset => {
    return new Promise((resolve) => {
      let el
      
      if (asset.type === 'video') {
        el = document.createElement('video')
        el.preload = 'auto'
        el.muted = true
        el.playsInline = true
      } else if (asset.type === 'image') {
        el = document.createElement('img')
        el.decoding = 'async'
        el.loading = 'eager'
      } else {
        // 字体使用FontFace API
        const font = new FontFace('Huiwen', `url(${asset.src})`, {
          display: 'swap'
        })
        font.load().then(() => {
          document.fonts.add(font)
          resolve()
        }).catch(() => resolve())
        return
      }
      
      el.onload = el.onloadeddata = () => {
        console.log(`✅ 资源加载完成: ${asset.src}`)
        resolve()
      }
      
      el.onerror = (err) => {
        console.warn(`⚠️ 资源加载失败: ${asset.src}`, err)
        resolve() // 即使失败也继续，不阻塞
      }
      
      el.src = asset.src
      
      // 添加到文档以触发加载（隐藏）
      el.style.display = 'none'
      el.style.position = 'absolute'
      el.style.opacity = '0'
      document.body.appendChild(el)
      
      // 清理
      setTimeout(() => {
        if (document.body.contains(el)) {
          document.body.removeChild(el)
        }
      }, 1000)
    })
  })
  
  // 使用Promise.allSettled确保所有资源都处理完毕
  await Promise.allSettled(promises)
  console.log('所有关键资源预加载完成')
}

onUnmounted(() => {
  destroyFullpage()

  const mapEl = mapRef.value
  if (mapEl) {
    mapEl.onmousemove = null
    mapEl.onmouseleave = null
  }
})

</script>

<template>
  <!-- 骨架屏 -->
  <div :class="{ 'skeleton-container': true, 'hidden': !loading }">
    <AppSkeleton />
  </div>
  
  <!-- 实际内容 -->
  <div id="fullpage" :class="{ 'loading': loading }">
    
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

    <div class="section">
      <!-- 主页第二屏 -->
      <div class="second-section-content">

        <!-- 第二屏视频背景 -->
        <video class="bg-video-second" autoplay muted loop playsinline>
          <source src="/src/assets/Background.mp4" type="video/mp4" />
        </video>

        <!-- 第二屏黑色蒙版 -->
        <div class="overlay-second"></div>

        <!-- 内容网格容器 -->
        <div class="second-grid-container">
          <!-- 文本内容区域 -->
          <div class="second-text-content">
            <h2
              v-motion
              :initial="{
                opacity: 1,
                color: '#FFFFFF'
              }"
              :visible="{
                color: '#C41D1D',
                transition: {
                  delay: 1000,
                  duration: 1500,
                  ease: 'easeInOut'
                }
              }"
              class="second-title"
            >
              漫漫长征路
            </h2>
            <div class="second-text">
              <p>长征是土地革命战争时期，中国工农红军主力撤离长江南北各苏区，转战两年到达陕甘苏区的战略转移行动。</p>
              <p>长征是人类历史上的伟大奇迹，中央红军共进行了600余次战役战斗，期间共经过14个省，翻越18座大山，跨过24条大河，走过荒草地，翻过雪山，行程约二万五千里。</p>
              <p>长征精神是红军在1934-1936年长征期间形成的革命精神，以把民族利益高于一切、坚定理想信念、不惜一切牺牲、独立自主、艰苦奋斗及紧密团结为内核。</p>
            </div>
          </div>

          <!-- 地图容器 -->
          <div class="map-container">
            <img ref="mapRef" src="/src/assets/second-item.jpg" class="map-image" />
          </div>
        </div>

      </div>
    </div>

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

  <div class="section">

  </div>


  </div>
</template>

<style scoped>

body {
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
}

/* 骨架屏容器 */
.skeleton-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 9999;
  background-color: #0a0a0a;
  overflow: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

/* 骨架屏隐藏状态 */
.skeleton-container.hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

/* fullpage容器 */
#fullpage {
  animation: fadeIn 0.5s ease;
}

/* fullpage加载状态 */
#fullpage.loading {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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

  background: 
    linear-gradient(
      to left,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 80%
    ),
    url('/src/assets/Background.png') no-repeat right center;
  background-size: cover;
}

.second-section-content {
  height: 100vh;
  background-color: #000000;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

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

/* 第二屏网格容器 */
.second-grid-container {
  height: 100%;
  display: grid;
  grid-template-columns: minmax(300px, 1fr) minmax(400px, 1.2fr);
  grid-template-rows: 1fr;
  gap: clamp(20px, 4vw, 60px);
  align-items: center;
  justify-content: center;
  padding: clamp(20px, 3vw, 60px) clamp(20px, 5vw, 80px);
  max-width: 1800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

/* 文本内容区域 */
.second-text-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding-right: clamp(10px, 2vw, 30px);
  margin-top: -25vh;
}

.second-title {
  font-family: 'Huiwen', sans-serif;
  font-size: clamp(2.5rem, 4.5vw, 5rem);
  line-height: 1.2;
  /* 颜色由动画控制，不设置固定颜色 */
  margin-bottom: clamp(20px, 3vw, 40px);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
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

.second-text {
  font-family: "Noto Serif SC", serif;
  font-size: 1.0vw;
  line-height: 1.6;
  color: #ffffff;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
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

.second-text p {
  margin-bottom: 5px;
  font-size: clamp(13px, 1.5vw, 30px);
}

.second-text p:last-child {
  margin-bottom: 0;
}

/* 地图容器 - 3D透视 */
.map-container {
  perspective: 1000px;
  width: 100%;
  height: 100%;
  max-height: 75vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
  margin-top: -20vh;
}

/* 地图图片 - 3D效果 */
.map-image {
  transform-style: preserve-3d;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow:
    0 20px 40px rgba(255, 255, 255, 0.3),
    0 0 60px rgba(255, 255, 255, 0.15);
  border-radius: clamp(8px, 1vw, 16px);
  width: 100%;
  height: auto;
  max-width: min(800px, 90%);
  max-height: 70vh;
  object-fit: contain;
  cursor: pointer;
}


.map-image:hover {
  box-shadow:
    0 40px 80px rgba(0,0,0,0.4);
}

/* 第二屏视频背景样式 */
.bg-video-second {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

/* 第二屏黑色蒙版样式 - 透明度70% */
.overlay-second {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7); /* 70%透明度 */
  z-index: 1;
}

/* 第三屏背景图片样式 */
.bg-image-third {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: url('/src/assets/Background3.png') no-repeat center center;
  background-size: cover;
  z-index: 0;
}

/* 为移动端做适配 */

@media (max-width: 768px) {
  .frist-section-content {
    justify-content: center;/* 居中 */
  }

  /* 移动端地图适配 */
  .map-container {
    width: 90%;
    height: 50%;
    margin-right: 0;
    margin-top: 80px;
  }

  .map-image {
    max-width: 100%;
    box-shadow:
      0 10px 20px rgba(0,0,0,0.2),
      0 0 30px rgba(0,0,0,0.1);
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

  /* 移动端第二屏：隐藏背景视频，使用纯黑色背景 */
  .bg-video-second {
    display: none !important;
  }
  
  .second-section-content {
    background-color: #000000 !important; /* 纯黑色背景 */
  }
  
  .overlay-second {
    background: rgba(0, 0, 0, 0) !important; /* 完全透明，因为背景已经是黑色 */
  }

  /* 第二屏响应式调整 - 优化垂直水平居中 */
  .second-grid-container {
    display: flex !important;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 25px;
    padding: 30px 20px;
    height: 100%;
    width: 100%;
  }

  .second-text-content {
    padding-right: 0;
    text-align: center;
    margin-top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 95%;
  }

  .second-title {
    font-size: clamp(3rem, 12vw, 5.5rem); /* 进一步加大标题字号 */
    margin-bottom: 25px;
    line-height: 1.1;
  }

  .second-text {
    font-size: clamp(1.3rem, 5.5vw, 1.8rem); /* 进一步加大文本字号 */
    line-height: 1.7;
    max-width: 95%;
  }

  .map-container {
    max-height: 45vh;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .map-image {
    max-width: 95%;
    max-height: 45vh;
  }

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

  /* 在移动端隐藏第二屏图片 - 确保隐藏 */
  .map-container {
    display: none !important;
  }

}

/* 超宽屏适配 */
@media (min-width: 2000px) {
  .second-grid-container {
    max-width: 2000px;
    padding: 100px;
  }
  
  .second-title {
    font-size: 5rem;
  }
  
  .second-text {
    font-size: 1.8rem;
    line-height: 1.8;
  }
}

/* 超窄屏适配（平板竖屏） */
@media (max-width: 1024px) and (min-height: 1024px) {
  .second-grid-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    gap: 40px;
  }
  
  .map-container {
    max-height: 60vh;
  }
}

/* 极端宽高比适配 */
@media (max-aspect-ratio: 3/4) {
  .second-grid-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    gap: 30px;
  }
  
  .second-text-content {
    max-height: 40vh;
    overflow-y: auto;
  }
  
  .map-container {
    max-height: 40vh;
  }
}

@media (min-aspect-ratio: 16/9) {
  .second-grid-container {
    gap: clamp(40px, 6vw, 80px);
  }
  
  .second-title {
    font-size: clamp(3rem, 5vw, 6rem);
  }
}

</style>

<style>

@font-face {
  font-family: 'Huiwen';
  src: url('/src/assets/汇文明朝体.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
  font-display: swap; /* 防止字体加载阻塞UI */
}

/* 全局字体优化 */
* {
  font-display: swap;
}

</style>


