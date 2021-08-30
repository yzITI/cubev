<template>
  <div class="cubev">
    <bar :store="store"></bar>
    <render v-if="renderNum" v-show="showRender" :store="store" :key="store.id + '.' + renderNum"></render>
    <code-mirror v-if="store.tab.value == 'Raw'" v-model="state.code"></code-mirror>
    <info :store="store"></info>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, watchEffect } from 'vue'
import { compileFile } from './render/transform.js'

import Render from './render/Render.vue'
import Bar from './components/Bar.vue'
import Info from './components/Info.vue'

import srcApp from './render/srcApp.vue?raw'
import welcomeCode from './welcomeCode.vue?raw'

import CodeMirror from './codemirror/CodeMirror.vue'

const { state } = defineProps({ state: { required: true } })
const store = { // inside
  id: window.cubev++,
  files: {},
  tab: ref(''),
  tabs: ['Raw'],
  errors: ref([]),
  runtimeError: ref(''),
  runtimeWarning: ref('')
}

const renderNum = ref(0)
const showRender = computed(() => {
  switch (store.tab.value) {
    case 'Raw': return false
    default: return true
  }
})

async function addFile (filename, code) {
  store.files[filename] = { filename, code, compiled: {} }
  return await compileFile(store.files[filename], store)
}

// re-render
watchEffect(() => {
  if (showRender.value) {
    addFile('Cube.vue', state.code)
      .then(() => { renderNum.value++ })
  }
})

async function init () {
  if (!state.code) state.code = welcomeCode
  await addFile('App.vue', srcApp)
  await addFile('Cube.vue', state.code)
  renderNum.value++
}
init()
</script>

<style scoped>
div.cubev {
  min-width: 320px;
  max-width: 100vw;
  min-height: 100px;
}
</style>
