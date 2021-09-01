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
// addons
import CodeMirror from './codemirror/CodeMirror.vue'

const { state, addons, plugins, hideBar } = defineProps({
  state: { default: {}, required: true },
  hideBar: { default: false }, // hide functional bar
  addons: { default: ['Raw'] }, // enabled addons(name)
  plugins: { default: [] } // enabled plugins(module)
})

const ready = ref(false)
const store = reactive({ // internal state
  id: '#' + (++window.cubev.count),
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

watch(showRender, v => { // re-render
  if (!v) return
  store.files['Cube.vue'] = state.code
  compileFile('Cube.vue', store)
})

async function init () {
  if (!state.id) state.id = store.id
  if (!state.code) state.code = welcomeCode
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
