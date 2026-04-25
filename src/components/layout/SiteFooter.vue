<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <a
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noopener noreferrer"
        class="footer-link"
      >
        湘ICP备2026014314号-1
      </a>
      <span class="footer-separator">|</span>
      <a
        href="mailto:xisiyao0529@gmail.com"
        class="footer-link"
      >
        xisiyao0529@gmail.com
      </a>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  width: 100%;
  background-color: #1a1a1a;
  padding: clamp(10px, 1.5vh, 20px) 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.footer-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(6px, 1vw, 16px);
  flex-wrap: wrap;
}

.footer-link {
  font-family: "Noto Serif SC", "PingFang SC", serif;
  font-size: clamp(0.65rem, 0.85vw, 1rem);
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.25s ease;
  white-space: nowrap;
}

.footer-link:hover {
  color: #ffffff;
}

.footer-separator {
  color: rgba(255, 255, 255, 0.35);
  font-size: clamp(0.65rem, 0.85vw, 1rem);
  user-select: none;
}

@media (max-width: 768px) {
  .site-footer {
    padding: 10px 12px;
  }

  .footer-link {
    font-size: 0.7rem;
  }

  .footer-separator {
    font-size: 0.7rem;
  }
}
</style>
