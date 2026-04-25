import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { MotionPlugin } from '@vueuse/motion'
import DeviceDetectPlugin from './plugins/deviceDetect'

// ===== 动态设置网站图标 =====
import iconUrl from '@/assets/icon.png'
const link = document.querySelector("link[rel*='icon']") || document.createElement('link')
link.type = 'image/png'
link.rel = 'icon'
link.href = iconUrl
document.head.appendChild(link)

const app = createApp(App)
app.use(MotionPlugin)
app.use(DeviceDetectPlugin)
app.mount('#app')
