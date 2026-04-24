/**
 * useMouseParallax
 *
 * 3D 鼠标视差交互 composable。
 * 在元素上绑定鼠标移动事件，实现基于鼠标位置的 3D 旋转变换效果。
 *
 * 使用方式：
 * ```js
 * const { onSectionEnter, onSectionLeave } = useMouseParallax(mapRef, {
 *   maxRotate: 25,
 *   scale: 1.05
 * })
 * ```
 */
import { ref } from 'vue'

/**
 * 创建 3D 鼠标视差交互
 *
 * @param {import('vue').Ref<HTMLElement|null>} elementRef - 目标元素的 template ref
 * @param {Object} [options]
 * @param {number} [options.maxRotate=25] - 最大旋转角度（度）
 * @param {number} [options.scale=1.05] - 悬停缩放比例
 * @param {number} [options.transitionDuration=0.2] - 过渡动画时长（秒）
 * @returns {{ onSectionEnter: () => void, onSectionLeave: () => void }}
 */
export function useMouseParallax(elementRef, {
  maxRotate = 25,
  scale = 1.05,
  transitionDuration = 0.2
} = {}) {
  /**
   * 鼠标移动时实现 3D 视差旋转效果
   */
  const handleMouseMove = (e) => {
    const el = elementRef.value
    if (!el) return

    const rect = el.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const offsetX = (x - centerX) / centerX
    const offsetY = (y - centerY) / centerY

    // 限制旋转角度，防止过度旋转
    const rotateY = Math.max(-maxRotate, Math.min(maxRotate, offsetX * 5))
    const rotateX = Math.max(-maxRotate, Math.min(maxRotate, -offsetY * 5))

    el.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(${scale})
    `
  }

  /**
   * 鼠标离开时重置变换
   */
  const resetTransform = () => {
    const el = elementRef.value
    if (el) {
      el.style.transform = `
        perspective(1000px)
        rotateX(0deg)
        rotateY(0deg)
        scale(1)
      `
    }
  }

  /**
   * 进入该区域时，绑定鼠标事件
   */
  const onSectionEnter = () => {
    const el = elementRef.value
    if (!el) return
    el.onmousemove = handleMouseMove
    el.onmouseleave = resetTransform
  }

  /**
   * 离开该区域时，清理鼠标事件
   */
  const onSectionLeave = () => {
    const el = elementRef.value
    if (el) {
      el.onmousemove = null
      el.onmouseleave = null
    }
  }

  return { onSectionEnter, onSectionLeave }
}
