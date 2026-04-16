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

// 监听loading变化，初始化fullpage
watch(loading, async (val) => {
  if (!val) {
    await nextTick()
    
    if (!fpInstance) {
      fpInstance = new fullpage('#fullpage', {
        autoScrolling: true,
        navigation: true,
        scrollOverflow: false,
        afterLoad: () => {
          // 确保地图交互在fullpage初始化后可用
          const mapEl = mapRef.value
          if (mapEl) {
            mapEl.addEventListener('mousemove', handleMouseMove)
            mapEl.addEventListener('mouseleave', resetMap)
          }
        }
      })
    }
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
  console.log('🎯 所有关键资源预加载完成')
}

onUnmounted(() => {

  if (fpInstance) {
    fpInstance.destroy('all')
  }

  const mapEl = mapRef.value
  if (mapEl) {
    mapEl.removeEventListener('mousemove', handleMouseMove)
    mapEl.removeEventListener('mouseleave', resetMap)
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

         <div class = "second-title">
           漫漫长征路
           <p class="text">
             长征是土地革命战争时期，中国工农红军主力撤离长江南北各苏区，转战两年到达陕甘苏区的战略转移行动。
             <br><br>
             长征是人类历史上的伟大奇迹，中央红军共进行了600余次战役战斗，攻占700多座县城，红军牺牲了营以上干部多达430余人，平均年龄不到30岁，共击溃国民党军数百个团，期间共经过14个省，翻越18座大山，跨过24条大河，走过荒草地，翻过雪山，行程约二万五千里。
             <br><br>
             长征精神是红军在1934-1936年长征期间形成的革命精神，以把民族利益高于一切、坚定理想信念、不惜一切牺牲、独立自主、艰苦奋斗及紧密团结为内核。
           </p>
         </div>
         



         <!-- 地图容器 -->
        <div class="map-container">
          <img ref="mapRef" src="/src/assets/second-item.jpg" class="map-image" />
        </div>

       </div>

    </div>

    <div class="section">第三屏</div>
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

  display: flex;
  justify-content: space-between; /* 左右分布 */
  align-items: center;            /* 垂直居中 */

  position: relative;
  overflow: hidden;
}

.second-title {
  margin-left: 10px;
  margin-top: 70px;

  font-family: 'Huiwen', sans-serif;
  font-size: 4vw;
  line-height: 1.2;
  color: #C41D1D;

  position: absolute;
  top: 100px;
  left: 100px;
  z-index: 2; /* 确保在遮罩之上显示 */
}

/* 地图容器 - 3D透视 */
.map-container {
  perspective: 1000px;
  width: 50%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;

  margin-left: auto;
  margin-right: 50px;
  z-index: 2; /* 确保在遮罩之上显示 */
  position: relative; /* 确保z-index生效 */
}

/* 地图图片 - 3D效果 */
.map-image {
  transform-style: preserve-3d;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow:
    0 20px 40px rgba(255, 255, 255, 0.3),
    0 0 60px rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  width: 100%;
  height: auto;
  max-width: 800px;
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

