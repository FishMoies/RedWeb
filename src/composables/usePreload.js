import { ref } from 'vue'
import {
  backgroundMp4,
  backgroundPng,
  secondItemJpg,
  huiwenOtf
} from '@/assets'

/**
 * 预加载关键资源（视频、图片、字体）
 * 管理 loading 状态，确保在资源就绪前不显示主内容
 */
export function usePreload() {
  const loading = ref(true)

  /**
   * 预加载所有关键资源
   * 使用 Promise.allSettled 确保所有资源都尝试加载完成
   */
  const preloadCriticalAssets = async () => {
    const assets = [
      { src: backgroundMp4, type: 'video' },
      { src: backgroundPng, type: 'image' },
      { src: secondItemJpg, type: 'image' },
      { src: huiwenOtf, type: 'font' }
    ]

    const promises = assets.map(asset => {
      return new Promise((resolve) => {
        let el

        if (asset.type === 'video') {
          el = document.createElement('video')
          el.preload = 'auto'
          el.muted = true
          el.playsInline = true
        } else if (asset.type === 'image') {
          el = document.createElement('img')
          el.decoding = 'async'
          el.loading = 'eager'
        } else {
          // 字体使用 FontFace API
          const font = new FontFace('Huiwen', `url(${asset.src})`, {
            display: 'swap'
          })
          font.load()
            .then(() => {
              document.fonts.add(font)
              resolve()
            })
            .catch(() => resolve())
          return
        }

        el.onload = el.onloadeddata = () => {
          console.log(`✅ 资源加载完成: ${asset.src}`)
          resolve()
        }

        el.onerror = (err) => {
          console.warn(`⚠️ 资源加载失败: ${asset.src}`, err)
          resolve() // 即使失败也继续，不阻塞
        }

        el.src = asset.src

        // 添加到文档以触发加载（隐藏）
        el.style.display = 'none'
        el.style.position = 'absolute'
        el.style.opacity = '0'
        document.body.appendChild(el)

        // 清理
        setTimeout(() => {
          if (document.body.contains(el)) {
            document.body.removeChild(el)
          }
        }, 1000)
      })
    })

    // 使用 Promise.allSettled 确保所有资源都处理完毕
    await Promise.allSettled(promises)
    console.log('所有关键资源预加载完成')
  }

  return { loading, preloadCriticalAssets }
}
