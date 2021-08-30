window.process = { env: {} }
import { ref } from 'vue'
export const files = {
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
}

export const errors = ref([])
export const runtimeError = ref('')
export const runtimeWarning = ref('')
