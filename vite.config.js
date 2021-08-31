import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({ script: { refSugar: true } })],
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'Cubev',
      fileName: (format) => `cubev.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'sucrase'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
