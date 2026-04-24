<template>
  <div class="item-content title-item">
    <h2 class="second-title">漫漫长征路</h2>
    <p class="second-subtitle">人类历史上的伟大奇迹</p>
  </div>
</template>

<style scoped>
.title-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: clamp(20px, 4vw, 60px);
  max-width: 90%;
  width: 100%;
}

.second-title {
  font-family: 'Huiwen', sans-serif;
  font-size: clamp(3rem, 6vw, 6rem);
  line-height: 1.2;
  color: #C41D1D;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  margin: 0;
}

.second-subtitle {
  font-family: "Noto Serif SC", serif;
  font-size: clamp(1.2rem, 2.5vw, 2.5rem);
  line-height: 1.4;
  color: #ffffff;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
  opacity: 0.8;
}
</style>
