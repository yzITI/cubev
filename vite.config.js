import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({ script: { refSugar: true } })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      formats: ['es'],
      fileName: (format) => `cubev.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'sucrase', 'codemirror']
    }
  }
})
