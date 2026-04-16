<template>
  <div id="fullpage-skeleton">
    <!-- 第一屏骨架 -->
    <div class="section skeleton-section">
      <div class="skeleton-first-screen">
        <!-- 视频区域骨架 -->
        <div class="skeleton-video"></div>
        
        <!-- 标题区域骨架 -->
        <div class="skeleton-title-container">
          <div class="skeleton-main-title"></div>
          <div class="skeleton-subtitle"></div>
        </div>
        
        <!-- 右侧图片区域骨架 -->
        <div class="skeleton-right-image"></div>
      </div>
    </div>

    <!-- 第二屏骨架 -->
    <div class="section skeleton-section">
      <div class="skeleton-second-screen">
        <!-- 视频背景骨架 -->
        <div class="skeleton-video-bg"></div>
        
        <!-- 左侧文本区域骨架 -->
        <div class="skeleton-left-content">
          <div class="skeleton-screen-title"></div>
          <div class="skeleton-paragraph"></div>
          <div class="skeleton-paragraph short"></div>
          <div class="skeleton-paragraph shorter"></div>
        </div>
        
        <!-- 右侧地图区域骨架 -->
        <div class="skeleton-map-container">
          <div class="skeleton-map"></div>
        </div>
      </div>
    </div>

    <!-- 第三屏骨架 -->
    <div class="section skeleton-section">
      <div class="skeleton-third-screen">
        <div class="skeleton-content-block"></div>
        <div class="skeleton-content-block medium"></div>
        <div class="skeleton-content-block small"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 骨架屏组件不需要逻辑，仅用于展示
</script>

<style scoped>
#fullpage-skeleton {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.skeleton-section {
  height: 100vh;
  width: 100%;
  position: relative;
}

/* 第一屏骨架样式 */
.skeleton-first-screen {
  height: 100%;
  background-color: #0a0a0a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  position: relative;
}

.skeleton-video {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    #1a1a1a 25%,
    #2a2a2a 37%,
    #1a1a1a 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  opacity: 0.3;
}

.skeleton-title-container {
  flex: 1;
  max-width: 40%;
  z-index: 2;
}

.skeleton-main-title {
  height: 80px;
  width: 70%;
  background: linear-gradient(
    90deg,
    #2a2a2a 25%,
    #3a3a3a 37%,
    #2a2a2a 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: 8px;
  margin-bottom: 20px;
}

.skeleton-subtitle {
  height: 40px;
  width: 50%;
  background: linear-gradient(
    90deg,
    #2a2a2a 25%,
    #3a3a3a 37%,
    #2a2a2a 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: 6px;
}

.skeleton-right-image {
  width: 55%;
  height: 80%;
  background: linear-gradient(
    90deg,
    #2a2a2a 25%,
    #3a3a3a 37%,
    #2a2a2a 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: 12px;
  z-index: 2;
}

/* 第二屏骨架样式 */
.skeleton-second-screen {
  height: 100%;
  background-color: #0a0a0a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  position: relative;
}

.skeleton-video-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    #1a1a1a 25%,
    #2a2a2a 37%,
    #1a1a1a 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  opacity: 0.3;
}

.skeleton-left-content {
  flex: 1;
  max-width: 45%;
  z-index: 2;
}

.skeleton-screen-title {
  height: 60px;
  width: 60%;
  background: linear-gradient(
    90deg,
    #2a2a2a 25%,
    #3a3a3a 37%,
    #2a2a2a 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: 8px;
  margin-bottom: 30px;
}

.skeleton-paragraph {
  height: 16px;
  width: 100%;
  background: linear-gradient(
    90deg,
    #2a2a2a 25%,
    #3a3a3a 37%,
    #2a2a2a 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-paragraph.short {
  width: 85%;
}

.skeleton-paragraph.shorter {
  width: 70%;
}

.skeleton-map-container {
  width: 50%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.skeleton-map {
  width: 100%;
  height: 100%;
  max-width: 800px;
  background: linear-gradient(
    90deg,
    #2a2a2a 25%,
    #3a3a3a 37%,
    #2a2a2a 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(255, 255, 255, 0.1);
}

/* 第三屏骨架样式 */
.skeleton-third-screen {
  height: 100%;
  background-color: #0a0a0a;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px;
}

.skeleton-content-block {
  height: 120px;
  width: 80%;
  background: linear-gradient(
    90deg,
    #2a2a2a 25%,
    #3a3a3a 37%,
    #2a2a2a 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: 10px;
  margin-bottom: 30px;
}

.skeleton-content-block.medium {
  height: 90px;
  width: 70%;
}

.skeleton-content-block.small {
  height: 60px;
  width: 60%;
}

/* 高级流光动画 */
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 添加淡入淡出过渡 */
#fullpage-skeleton {
  animation: skeletonFadeIn 0.3s ease;
}

@keyframes skeletonFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 增强3D效果 */
.skeleton-map {
  position: relative;
  overflow: hidden;
}

.skeleton-map::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  animation: shine 2s infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .skeleton-first-screen,
  .skeleton-second-screen {
    flex-direction: column;
    padding: 20px;
  }
  
  .skeleton-title-container,
  .skeleton-left-content {
    max-width: 100%;
    margin-bottom: 30px;
  }
  
  .skeleton-right-image {
    width: 90%;
    height: 40%;
  }
  
  .skeleton-map-container {
    width: 90%;
    height: 50%;
    margin-top: 30px;
  }
  
  .skeleton-main-title {
    height: 60px;
  }
  
  .skeleton-screen-title {
    height: 40px;
  }
}
</style>