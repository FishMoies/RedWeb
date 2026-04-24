/**
 * scrollNavigationAnimation
 *
 * 页面级 ScrollTrigger 导航动画模块。
 * 负责创建面板（panel）切换的 ScrollTrigger，驱动当前活跃面板索引变化。
 * 与 UI 完全解耦，通过回调函数通知外部。
 *
 * 使用方式：
 * ```js
 * import { createScrollNavigation, destroyScrollNavigation } from '@/animations/scrollNavigationAnimation'
 *
 * const cleanup = createScrollNavigation({
 *   panelSelector: '.panel',
 *   excludeIndex: 1,
 *   onEnter: (index) => { ... }
 * })
 * ```
 */
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * 创建页面级面板导航 ScrollTrigger
 *
 * @param {Object} options
 * @param {string} options.panelSelector - 面板 CSS 选择器
 * @param {number} [options.excludeIndex] - 需要排除的面板索引（由自身管理滚动的面板）
 * @param {(index: number) => void} options.onEnter - 进入面板时的回调
 * @returns {() => void} 销毁函数
 */
export function createScrollNavigation({
  panelSelector = '.panel',
  excludeIndex = 1,
  onEnter = () => {}
} = {}) {
  const triggers = []

  const panels = gsap.utils.toArray(panelSelector)

  panels.forEach((panel, i) => {
    // 排除由自身管理滚动的面板（如第二屏横向滚动）
    if (i === excludeIndex) return

    const st = ScrollTrigger.create({
      trigger: panel,
      start: 'top 90%',
      end: 'top 10%',

      onEnter: () => onEnter(i),
      onEnterBack: () => onEnter(i),
    })

    triggers.push(st)
  })

  // 触发刷新确保位置计算准确
  ScrollTrigger.refresh()
  // 初始状态：第一个面板为活跃
  onEnter(0)

  /**
   * 销毁所有由本模块创建的 ScrollTrigger 实例
   */
  function destroy() {
    triggers.forEach(t => t.kill())
    triggers.length = 0
  }

  return destroy
}
