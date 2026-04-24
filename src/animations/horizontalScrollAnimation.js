/**
 * horizontalScrollAnimation
 *
 * 第二屏横向滚动动画模块。
 * 使用 ScrollTrigger + gsap.ticker + lerp 物理缓动实现带惯性的横向滚动效果。
 * 与 UI 完全解耦，通过回调与外部通信。
 *
 * 使用方式：
 * ```js
 * import { createHorizontalScroll, destroyHorizontalScroll } from '@/animations/horizontalScrollAnimation'
 *
 * const cleanup = createHorizontalScroll({
 *   containerSelector: '.horizontal-content',
 *   wrapperSelector: '.horizontal-wrapper',
 *   onSpiritVisible: () => { ... }
 * })
 * ```
 */
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * 创建第二屏横向滚动动画
 *
 * @param {Object} options
 * @param {string} options.containerSelector - 横向滚动内容容器选择器
 * @param {string} options.wrapperSelector - 外层包裹容器选择器
 * @param {Object} [options.spiritOptions] - 第四屏 IntersectionObserver 配置
 * @param {string} [options.spiritOptions.selector] - 第四屏元素选择器
 * @param {number} [options.spiritOptions.threshold=0.3] - 可见比例阈值
 * @param {() => void} [options.spiritOptions.onVisible] - 进入视口回调
 * @returns {() => void} 销毁函数
 */
export function createHorizontalScroll({
  containerSelector = '.horizontal-content',
  wrapperSelector = '.horizontal-wrapper',
  spiritOptions = null
} = {}) {
  const container = document.querySelector(containerSelector)
  if (!container) return () => {}

  let horizontalTrigger = null
  let tickerFn = null
  let spiritObserver = null

  // 物理缓动状态
  let currentProgress = 0
  let targetProgress = 0

  // ---- 检测移动端 ----
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768

  // 每次刷新时重新计算滚动距离
  let scrollDistance = 0
  const calcScrollDistance = () => {
    const vw = window.innerWidth
    const tw = container.scrollWidth
    return tw - vw
  }

  scrollDistance = calcScrollDistance()

  // 如果滚动距离为 0 或负值，不创建动画
  if (scrollDistance <= 0) return () => {}

  // lerp 系数：移动端用 0.3 快速响应，桌面端 0.1 保持顺滑惯性手感
  const lerpFactor = isMobile ? 0.3 : 0.1

  // ---- ScrollTrigger：只负责追踪进度 + pin 住容器 ----
  horizontalTrigger = ScrollTrigger.create({
    id: 'second-screen-horizontal',
    trigger: wrapperSelector,
    start: 'top top',
    end: () => `+=${scrollDistance}`,

    pin: true,
    pinSpacing: true,
    invalidateOnRefresh: true,

    onUpdate: (self) => {
      targetProgress = self.progress

      // 移动端快速滚动时，当 progress 接近边界直接对齐
      if (isMobile && (self.progress >= 0.995 || self.progress <= 0.005)) {
        currentProgress = self.progress
      }
    },

    onRefresh: () => {
      scrollDistance = calcScrollDistance()
    },
  })

  // ---- gsap.ticker：用 lerp 做物理缓动 + 驱动水平位移 ----
  tickerFn = () => {
    currentProgress += (targetProgress - currentProgress) * lerpFactor

    if (Math.abs(currentProgress - targetProgress) < 0.0001) {
      currentProgress = targetProgress
    }

    gsap.set(container, {
      x: -currentProgress * scrollDistance,
    })
  }
  gsap.ticker.add(tickerFn)

  // 延迟刷新确保图片/视频加载后布局稳定
  setTimeout(() => {
    ScrollTrigger.refresh()
  }, 300)

  // ---- 第四屏 IntersectionObserver ----
  if (spiritOptions) {
    const spiritEl = document.querySelector(spiritOptions.selector)
    if (spiritEl) {
      spiritObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            spiritOptions.onVisible?.()
            spiritObserver.disconnect()
          }
        },
        { threshold: spiritOptions.threshold ?? 0.3 }
      )
      spiritObserver.observe(spiritEl)
    }
  }

  /**
   * 销毁所有资源
   */
  function destroy() {
    if (tickerFn) {
      gsap.ticker.remove(tickerFn)
      tickerFn = null
    }

    if (horizontalTrigger) {
      horizontalTrigger.kill()
      horizontalTrigger = null
    }

    if (spiritObserver) {
      spiritObserver.disconnect()
      spiritObserver = null
    }
  }

  return destroy
}
