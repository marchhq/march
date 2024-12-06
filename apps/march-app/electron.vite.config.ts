import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        external: ['@electron-toolkit/utils']
      }
    }
  }
})
