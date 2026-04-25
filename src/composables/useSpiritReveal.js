/**
 * useSpiritReveal
 *
 * 长征精神卡片展示逻辑模块。
 * 管理 spiritVisible 状态，通过 show() 方法触发入场动画。
 * 与 UI 完全解耦，由父组件或 IntersectionObserver 触发。
 */
import { ref } from 'vue'

/**
 * 创建精神卡片展示控制
 *
 * @returns {{ spiritVisible: import('vue').Ref<boolean>, show: () => void }}
 */
export function useSpiritReveal() {
  const spiritVisible = ref(false)

  /** 触发显示动画 */
  function show() {
    spiritVisible.value = true
  }

  return { spiritVisible, show }
}
