import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

<<<<<<< Updated upstream
export default defineConfig(() => {
  const base = process.env.VITE_BASE || '/'

  return {
    base,
    plugins: [vue()],
  }
})
=======
// https://vite.dev/config/
export default defineConfig({
  base: '/RedWeb/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
>>>>>>> Stashed changes
