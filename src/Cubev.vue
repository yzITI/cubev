<template>
  <div class="cubev">
    <bar v-if="!hideBar" :store="store" :state="state"></bar>
    <render v-if="ready" v-show="showRender" :store="store"></render>
    <code-mirror :state="state"
      v-if="state.tab == 'Code' || state.tab == 'Head' || state.tab == 'Markdown'"
      :mode="state.tab == 'Markdown' ? 'markdown' : 'htmlmixed'"
    >
      <pre v-if="state.tab == 'Head'">{{ example.headTip }}</pre>
      <button v-if="state.tab == 'Markdown' && state.head != example.markdownHead" @click="applyMarkdown">Apply Markdown Preset</button>
    </code-mirror>
    <info :store="store"></info>
  </div>
</template>

<script setup>
import { defineProps, ref, reactive, computed, watchEffect, onUnmounted } from 'vue'
import compileFile from './render/compileFile.js'

import Render from './render/Render.vue'
import Bar from './components/Bar.vue'
import Info from './components/Info.vue'

import srcApp from './render/srcApp.vue?raw'
import * as example from './example.js'
// addons
import CodeMirror from './codemirror/CodeMirror.vue'

const { state, addons, plugins, hideBar } = defineProps({
  state: { default: {}, required: true },
  hideBar: { default: false }, // hide functional bar
  addons: { default: ['Code', 'Head', 'Markdown'] }, // enabled addons(name)
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
    case 'Code': return false
    case 'Head': return false
    case 'Markdown': return false
    default: return true
  }
})

state.id = store.id
window.cubev.cubes[state.id] = state
if (!state.tab) state.tab = 'Cube'
if (!state.head) state.head = ''
if (!state.code) {
  state.code = example.code
  state.head = example.head
}

onUnmounted(() => { delete window.cubev.cubes[state.id] })

async function init () {
  store.files['Cube.vue'] = state.code
  await compileFile('Cube.vue', store)
  await compileFile('App.vue', store)
  ready.value = true
  watchEffect(() => {
    if (state.tab != 'Head') store.head = state.head
    store.files['Cube.vue'] = state.code
    if (showRender.value) compileFile('Cube.vue', store)
  })
}
init()

function applyMarkdown () {
  state.head = example.markdownHead
  state.code = example.markdownCode
}
</script>

<style scoped>
div.cubev {
  min-width: 320px;
  max-width: 100vw;
  min-height: 100px;
}
pre {
  padding: 8px 16px;
  margin: 0;
  font-size: 0.7rem;
  white-space: pre-wrap;
}
button {
  margin: 8px;
  padding: 4px 8px;
}
</style>
