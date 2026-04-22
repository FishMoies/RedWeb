import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(() => {
  const base = process.env.VITE_BASE || '/'

  return {
    base,
    plugins: [vue()],
  }
})