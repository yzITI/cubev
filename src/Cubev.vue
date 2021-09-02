<template>
  <div class="cubev">
    <bar v-if="!hideBar" :store="store" :state="state"></bar>
    <render v-if="ready" v-show="showRender" :store="store"></render>
    <code-mirror v-if="state.tab == 'Raw' || state.tab == 'Head'" :state="state"></code-mirror>
    <info :store="store"></info>
  </div>
</template>

<script setup>
import { defineProps, ref, reactive, computed, watch } from 'vue'
import { compileFile } from './render/compileFile.js'

import Render from './render/Render.vue'
import Bar from './components/Bar.vue'
import Info from './components/Info.vue'

import srcApp from './render/srcApp.vue?raw'
import defaultCode from './defaultCode.vue?raw'
// addons
import CodeMirror from './codemirror/CodeMirror.vue'

const { state, addons, plugins, hideBar } = defineProps({
  state: { default: {}, required: true },
  hideBar: { default: false }, // hide functional bar
  addons: { default: ['Raw', 'Head'] }, // enabled addons(name)
  plugins: { default: [] } // enabled plugins(module)
})

const ready = ref(false)
const store = reactive({ // internal state
  id: '#' + (++window.cubev.count),
  files: { 'App.vue': srcApp },
  compiled: {},
  head: '',
  tabs: addons,
  errors: [],
  runtimeError: '',
  runtimeWarning: ''
})

const showRender = computed(() => {
  switch (state.tab) {
    case 'Raw': return false
    case 'Head': return false
    default: return true
  }
})

watch(showRender, v => { // re-render
  if (!v) return
  store.head = state.head
  compileFile('Cube.vue', store)
})

// sync code
watch(() => state.code, v => { store.files['Cube.vue'] = v })

async function init () {
  state.id = store.id
  if (!state.code) state.code = defaultCode
  if (!state.head) state.head = ''
  if (!state.tab) state.tab = 'Cube'
  store.head = state.head
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
