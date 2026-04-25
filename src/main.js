import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { MotionPlugin } from '@vueuse/motion'
import DeviceDetectPlugin from './plugins/deviceDetect'

const app = createApp(App)
app.use(MotionPlugin)
app.use(DeviceDetectPlugin)
app.mount('#app')
