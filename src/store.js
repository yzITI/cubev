window.process = { env: {} }
export default {
  files: {
    'App.vue': {
      filename: 'App.vue',
      code: `
        <script setup>
        import t frm './test.js'
        import { ref } from 'vue'

        const msg = ref('Hello World!')
        </script>

        <template>
          <h1 @click="msg = t">{{ msg }}</h1>
          <input v-model="msg">
        </template>`,
      compiled: {
        js: '',
        css: ''
      }
    },
    'test.js': {
      filename: 'test.js',
      code: `export default 'lalala'`,
      compiled: {
        js: '',
        css: ''
      }
    }
  },
  errors: []
}
