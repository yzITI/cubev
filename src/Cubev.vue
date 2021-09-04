<template>
  <div class="cubev">
    <bar v-if="!hideBar" :store="store" :state="state"></bar>
    <render v-if="ready" v-show="showRender" :store="store"></render>
    <code-mirror :state="state" v-if="state.tab == 'Raw' || state.tab == 'Head'">
      <pre v-if="state.tab == 'Head'">{{ example.headTip }}</pre>
    </code-mirror>
    <info :store="store"></info>
  </div>
</template>

<script setup>
import { defineProps, ref, reactive, computed, watchEffect } from 'vue'
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

state.id = store.id
if (!state.tab) state.tab = 'Cube'
if (!state.head) state.head = ''
if (!state.code) {
  state.code = example.code
  state.head = example.head
}

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
</script>

<style scoped>
div.cubev {
  min-width: 320px;
  max-width: 100vw;
  min-height: 100px;
}
pre {
  background-color: #eee;
  padding: 16px;
  margin: 0;
  white-space: pre-wrap;
}
</style>
