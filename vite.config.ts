// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//   host: true,
//   port: 5173,
//   allowedHosts: 'all',
// }

// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      "7eb979cc030d.ngrok-free.app"
    ],
    proxy: {
      '/jitsi': {
        target: 'https://meet.jit.si:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jitsi/, '')
      }
    }
  }
})

