import { huiwenOtf } from '@/assets'

/**
 * 注入 @font-face 样式到 document.head
 * 确保 Huiwen 字体在页面加载前可用（同步执行）
 */
export function useFontFace() {
  const styleId = 'huiwen-font-face'
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      @font-face {
        font-family: 'Huiwen';
        src: url(${huiwenOtf}) format('opentype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `
    document.head.appendChild(style)
  }
}
