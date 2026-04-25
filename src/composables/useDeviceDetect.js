/**
 * useDeviceDetect
 *
 * 设备检测 composable，融合两种策略：
 *   1. User-Agent 检测（移动端浏览器标识）
 *   2. 屏幕宽度检测（响应式断点，默认 768px）
 *
 * 返回值：
 *   - isMobileByUA    : 基于 User-Agent 的判断
 *   - isMobileByScreen: 基于屏幕宽度的判断
 *   - isMobile        : 综合判断（任意一项为 true 即为移动端）
 *   - isDesktop       : !isMobile
 *   - isTablet        : 是否是平板设备（UA 层面）
 *   - detectionSource : 当前综合结果的判定来源（'ua' | 'screen' | 'both' | 'neither'）
 *
 * @param {number} breakpoint - 移动端断点宽度，默认 768（与项目中 CSS 媒体查询一致）
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'

// ===== User-Agent 正则 =====
const MOBILE_UA_REGEX = /(?:Android|webOS|iPhone|iPod|BlackBerry|Windows\sPhone|Opera\sMini|IEMobile|Mobi|PlayBook|BB10)/i
const TABLET_UA_REGEX = /(?:iPad|Android(?!.*Mobile)|Tablet|Silk)/i

/**
 * 在模块顶层立即执行 UA 检查（不依赖 DOM，安全）
 * 这样可以同步获取初始值，避免闪烁
 */
function detectUA() {
  if (typeof navigator === 'undefined') {
    return { isMobile: false, isTablet: false }
  }

  const ua = navigator.userAgent
  const isMobile = MOBILE_UA_REGEX.test(ua)
  const isTablet = TABLET_UA_REGEX.test(ua) || /iPad/i.test(ua)

  return { isMobile, isTablet }
}

const uaResult = detectUA()

export function useDeviceDetect(breakpoint = 768) {
  // ===== 基于 UA 的判断（静态，不会改变） =====
  const isMobileByUA = ref(uaResult.isMobile)
  const isTablet = ref(uaResult.isTablet)

  // ===== 基于屏幕宽度的判断（响应式） =====
  const windowWidth = ref(window.innerWidth)
  const isMobileByScreen = computed(() => windowWidth.value < breakpoint)

  // ===== 综合判断 =====
  const isMobile = computed(() => isMobileByUA.value || isMobileByScreen.value)
  const isDesktop = computed(() => !isMobile.value)

  // ===== 判定来源 =====
  const detectionSource = computed(() => {
    const ua = isMobileByUA.value
    const screen = isMobileByScreen.value
    if (ua && screen) return 'both'
    if (ua) return 'ua'
    if (screen) return 'screen'
    return 'neither'
  })

  // ===== 监听窗口 resize =====
  let resizeHandler = null

  onMounted(() => {
    resizeHandler = () => {
      windowWidth.value = window.innerWidth
    }
    window.addEventListener('resize', resizeHandler)
  })

  onUnmounted(() => {
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
    }
  })

  return {
    /** 基于 User-Agent 的移动端判断 */
    isMobileByUA,
    /** 基于屏幕宽度的移动端判断 */
    isMobileByScreen,
    /** 综合判断（UA 或屏幕任一为移动端即为 true） */
    isMobile,
    /** 综合判断的取反 */
    isDesktop,
    /** 是否是平板设备 */
    isTablet,
    /** 当前综合结果的判定来源：'ua' | 'screen' | 'both' | 'neither' */
    detectionSource,
    /** 当前窗口宽度（px） */
    windowWidth,
  }
}
