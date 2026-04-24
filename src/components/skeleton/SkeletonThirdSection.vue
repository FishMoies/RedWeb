<template>
  <div class="skeleton-third-screen">
    <div class="skeleton-content-block"></div>
    <div class="skeleton-content-block medium"></div>
    <div class="skeleton-content-block small"></div>
  </div>
</template>

<style scoped>
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
  background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 37%, #2a2a2a 63%);
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

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
