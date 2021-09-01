<template>
  <div class="cubev">
    <bar v-if="!hideBar" :store="store"></bar>
    <render v-if="ready" v-show="showRender" :store="store"></render>
    <code-mirror v-if="store.tab == 'Raw'" v-model="state.code"></code-mirror>
    <info :store="store"></info>
  </div>
</template>

<script setup>
import { defineProps, ref, reactive, computed, watch } from 'vue'
import { compileFile } from './render/transform.js'

import Render from './render/Render.vue'
import Bar from './components/Bar.vue'
import Info from './components/Info.vue'

import srcApp from './render/srcApp.vue?raw'
import welcomeCode from './welcomeCode.vue?raw'

import CodeMirror from './codemirror/CodeMirror.vue'

const { cubeId, addons, plugins, hideBar } = defineProps({
  'cubeId': { default: 'id', required: true },
  hideBar: { default: false },
  addons: { default: ['Raw'] },
  plugins: { default: [] }
})

const ready = ref(false)
const state = {}
const store = reactive({ // inside
  id: cubeId,
  files: {},
  compiled: {},
  tab: '',
  tabs: addons,
  errors: [],
  runtimeError: '',
  runtimeWarning: ''
})

const showRender = computed(() => {
  switch (store.tab) {
    case 'Raw': return false
    default: return true
  }
})

watch(showRender, v => {
  if (!v) return
  store.files['Cube.vue'] = state.code
  compileFile('Cube.vue', store)
})

async function addFile (filename, code) {
  store.files[filename] = code
  return await compileFile(filename, store)
}

async function init () {
  if (!state.code) state.code = welcomeCode
  if (!state.data) state.data = {}
  store.files['App.vue'] = srcApp
  store.files['Cube.vue'] = state.code
  await compileFile('App.vue', store)
  await compileFile('Cube.vue', store)
  ready.value = true
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
