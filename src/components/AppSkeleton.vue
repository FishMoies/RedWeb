<template>
  <div id="fullpage-skeleton">
    <!-- 第一屏骨架 -->
    <div class="section skeleton-section">
      <SkeletonFirstSection />
    </div>

    <!-- 第二屏骨架 -->
    <div class="section skeleton-section">
      <SkeletonSecondSection />
    </div>

    <!-- 第三屏骨架 -->
    <div class="section skeleton-section">
      <SkeletonThirdSection />
    </div>
  </div>
</template>

<script setup>
import SkeletonFirstSection from './skeleton/SkeletonFirstSection.vue'
import SkeletonSecondSection from './skeleton/SkeletonSecondSection.vue'
import SkeletonThirdSection from './skeleton/SkeletonThirdSection.vue'
</script>

<style scoped>
#fullpage-skeleton {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  animation: skeletonFadeIn 0.3s ease;
}

.skeleton-section {
  height: 100vh;
  width: 100%;
  position: relative;
}

@keyframes skeletonFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
