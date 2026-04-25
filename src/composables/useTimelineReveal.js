/**
 * useTimelineReveal
 *
 * 时间轴 IntersectionObserver 逻辑模块。
 * 负责监听时间轴容器进入视口，触发入场动画。
 * 与 UI 完全解耦，仅管理 visible 状态。
 */
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 创建时间轴可见性检测
 *
 * @param {import('vue').Ref<HTMLElement|null>} elementRef - 时间轴容器的 template ref
 * @param {Object} [options]
 * @param {number} [options.threshold=0.25] - IntersectionObserver 阈值
 * @returns {{ visible: import('vue').Ref<boolean> }}
 */
export function useTimelineReveal(elementRef, { threshold = 0.25 } = {}) {
  const visible = ref(false)
  let observer = null

  onMounted(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible.value = true
          observer.disconnect()
        }
      },
      { threshold }
    )
    if (elementRef.value) {
      observer.observe(elementRef.value)
    }
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  return { visible }
}
