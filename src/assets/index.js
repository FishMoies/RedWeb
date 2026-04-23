/**
 * 资源统一入口文件
 *
 * 所有静态资源（图片、视频、字体等）都通过此文件统一导入导出。
 * 这样 Vite 会在编译时解析路径、打包并自动替换引用路径，
 * 避免硬编码路径导致的 404 问题。
 *
 * 使用方式：
 *   import { backgroundMp4, backgroundPng } from '@/assets'
 *   <img :src="backgroundPng" />
 *   <video><source :src="backgroundMp4" /></video>
 */

// ===== 视频资源 =====
import backgroundMp4 from '@/assets/Background.mp4'
import background2Mp4 from '@/assets/Background2.mp4'

// ===== 图片资源 =====
import backgroundPng from '@/assets/Background.png'
import background3Png from '@/assets/Background3.png'
import secondItemJpg from '@/assets/second-item.jpg'
import iconPng from '@/assets/icon.png'
import extraJpg from '@/assets/1_SMUx6T_chzus4w33jfnrNA.jpg'

// ===== 字体资源 =====
import huiwenOtf from '@/assets/汇文明朝体.otf'

export {
  // 视频
  backgroundMp4,
  background2Mp4,

  // 图片
  backgroundPng,
  background3Png,
  secondItemJpg,
  iconPng,
  extraJpg,

  // 字体
  huiwenOtf
}
