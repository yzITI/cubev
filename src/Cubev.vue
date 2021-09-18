<template>
  <div style="min-width: 320px; max-width: 100vw; background: white;">
    <bar :title="title" v-if="!hideBar" :store="store" :state="state"></bar>
    <render :store="store" :state="state"></render>
    <info :store="store"></info>
  </div>
</template>

<script setup>
import { ref, reactive, watchEffect, watch, onUnmounted, onMounted } from 'vue'
import compileFile from './render/compileFile.js'

import Render from './render/Render.vue'
import Bar from './components/Bar.vue'
import Info from './components/Info.vue'

import srcApp from './render/src/App.vue?raw'
import Example from '../plugins/Example?raw'

const { state, plugins, hideBar, title } = defineProps({
  state: { default: {}, required: true },
  title: { default: '' }, // title on the bar
  hideBar: { default: false }, // hide functional bar
  plugins: { default: [] } // enabled plugins(object)
})

const store = reactive({ // internal state
  id: '#' + (++window.cubev.count),
  files: { 'App.vue': srcApp },
  compiled: {},
  head: '',
  tabs: [],
  errors: [],
  runtimeError: '',
  runtimeWarning: ''
})

onUnmounted(() => { delete window.cubev.cubes[state.id] })

const pluginsHead = ref('')
onMounted(() => {
  state.id = store.id
  window.cubev.cubes[state.id] = state
  if (!state.tab) state.tab = ''
  if (!state.head) state.head = ''
  if (!state.code) {
    const ex = window.cubev.pluginLoader.parse(Example)
    state.code = ex.view
    state.head = ex.head
  }
  watch(() => plugins, (v) => { // process plugins
    pluginsHead.value = ''
    store.tabs = []
    for (const p of plugins) {
      if (!p.name) {
        console.error(`[Cubev ${store.id}] Invalid plugin.`)
        continue
      }
      if (p.head) pluginsHead.value += p.head
      if (p.view) {
        store.tabs.push(p.name)
        store.files[`${p.name}/View.vue`] = p.view
      }
    }
    const importPlugin = store.tabs.map(x => `import ${x} from './${x}/View.vue'`).join('\n')
    store.files['Cube.vue'] = state.code
    store.files['App.vue'] = srcApp.replace('/* IMPORT_PLUGIN */', importPlugin).replace('/* PLUGIN_LIST */', store.tabs.join(', '))
  }, { immediate: true, deep: true })

  watchEffect(() => {
    if (state.tab !== 'Head') store.head = pluginsHead.value + state.head
    if (state.tab === '') store.files['Cube.vue'] = state.code
  })
})
</script>
