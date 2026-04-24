<template>
  <div class="skeleton-first-screen">
    <div class="skeleton-video"></div>
    <div class="skeleton-title-container">
      <div class="skeleton-main-title"></div>
      <div class="skeleton-subtitle"></div>
    </div>
    <div class="skeleton-right-image"></div>
  </div>
</template>

<style scoped>
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
  background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 37%, #1a1a1a 63%);
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
  background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 37%, #2a2a2a 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: 8px;
  margin-bottom: 20px;
}

.skeleton-subtitle {
  height: 40px;
  width: 50%;
  background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 37%, #2a2a2a 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: 6px;
}

.skeleton-right-image {
  width: 55%;
  height: 80%;
  background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 37%, #2a2a2a 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: 12px;
  z-index: 2;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 768px) {
  .skeleton-first-screen {
    flex-direction: column;
    padding: 20px;
  }

  .skeleton-title-container {
    max-width: 100%;
    margin-bottom: 30px;
  }

  .skeleton-right-image {
    width: 90%;
    height: 40%;
  }

  .skeleton-main-title {
    height: 60px;
  }
}
</style>
