<template>
  <div class="item-content text-item">
    <p style="text-align: center;">长征是土地革命战争时期，中国工农红军主力撤离长江南北各苏区，转战两年到达陕甘苏区的战略转移行动。</p>
  </div>
</template>

<style scoped>
.text-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  max-width: 80%;
  padding: clamp(20px, 4vw, 60px);
  width: 100%;
}

.text-item p {
  font-family: "Noto Serif SC", serif;
  font-size: clamp(14px, 1.8vw, 28px);
  line-height: 1.8;
  color: #ffffff;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
  margin: 0;
}

@media (max-width: 768px) {
  .text-item {
    max-width: 95%;
  }

  .text-item p {
    font-size: clamp(14px, 4vw, 20px);
  }
}
</style>
