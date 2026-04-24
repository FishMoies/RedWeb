<template>
  <div class="skeleton-second-screen">
    <div class="skeleton-video-bg"></div>
    <div class="skeleton-left-content">
      <div class="skeleton-screen-title"></div>
      <div class="skeleton-paragraph"></div>
      <div class="skeleton-paragraph short"></div>
      <div class="skeleton-paragraph shorter"></div>
    </div>
    <div class="skeleton-map-container">
      <div class="skeleton-map"></div>
    </div>
  </div>
</template>

<style scoped>
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
  background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 37%, #1a1a1a 63%);
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
  background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 37%, #2a2a2a 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: 8px;
  margin-bottom: 30px;
}

.skeleton-paragraph {
  height: 16px;
  width: 100%;
  background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 37%, #2a2a2a 63%);
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
  background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 37%, #2a2a2a 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(255, 255, 255, 0.1);
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shine 2s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes shine {
  0% { left: -100%; }
  100% { left: 100%; }
}

@media (max-width: 768px) {
  .skeleton-second-screen {
    flex-direction: column;
    padding: 20px;
  }

  .skeleton-left-content {
    max-width: 100%;
    margin-bottom: 30px;
  }

  .skeleton-map-container {
    width: 90%;
    height: 50%;
    margin-top: 30px;
  }

  .skeleton-screen-title {
    height: 40px;
  }
}
</style>
