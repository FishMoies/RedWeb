/**
 * deviceDetect 插件
 *
 * 全局注入 $device 对象，模板中可直接使用：
 *   - $device.isMobile        : 综合判断（UA 或屏幕）
 *   - $device.isDesktop       : 综合判断取反
 *   - $device.isMobileByUA    : 仅基于 User-Agent
 *   - $device.isMobileByScreen: 仅基于屏幕宽度
 *   - $device.isTablet        : 是否为平板
 *   - $device.detectionSource : 判定来源
 *
 * 示例：
 *   <div v-if="$device.isDesktop">桌面版内容</div>
 *   <div v-if="$device.isMobile">移动版内容</div>
 */
import { useDeviceDetect } from '@/composables/useDeviceDetect'

export default {
  install(app) {
    const device = useDeviceDetect()
    app.config.globalProperties.$device = device
  },
}
