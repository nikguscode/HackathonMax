// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // --- ДОБАВЛЯЕМ СЕКЦИЮ SERVER.PROXY ---
  server: {
    // ВАЖНО: 8080 - это порт, на котором запущен ваш мок-сервер (bot.ts)
    proxy: {
      '/api': {
        // Мы предполагаем, что мок-сервер запущен локально на 8080
        target: 'http://localhost:8080', 
        changeOrigin: true, // Необходимо для корректной работы прокси
        rewrite: (path) => path.replace(/^\/api/, ''), // Удаляем префикс '/api'
      },
    },
  },
  // ----------------------------------------
})