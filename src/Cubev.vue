<template>
  <div class="cubev">
    <bar :store="store"></bar>
    <render :store="store" :key="renderNum"></render>
    <info :store="store"></info>
  </div>
</template>

<script setup>
import { watchEffect, defineProps, ref } from 'vue'
import { compileFile } from './render/transform.js'

import Render from './render/Render.vue'
import Bar from './components/Bar.vue'
import Info from './components/Info.vue'
import srcApp from './render/srcApp.vue?raw'
import welcomeCode from './welcomeCode.vue?raw'

const { state } = defineProps({ state: { required: true } })

const renderNum = ref(0)

const store = { // inside
  id: window.cubev++,
  files: {},
  errors: ref([]),
  runtimeError: ref(''),
  runtimeWarning: ref('')
}

function addFile (filename, code) {
  store.files[filename] = { filename, code, compiled: {} }
  compileFile(store.files[filename], store)
}
addFile('App.vue', srcApp)
addFile('Cube.vue', state.code || welcomeCode)
renderNum.value++
</script>

<style scoped>
div.cubev {
  min-width: 320px;
  max-width: 100vw;
  min-height: 100px;
}
</style>
