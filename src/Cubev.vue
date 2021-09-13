<template>
  <div style="min-width: 320px; max-width: 100vw; background: white;">
    <bar :title="title" v-if="!hideBar" :store="store" :state="state"></bar>
    <render v-if="ready" :store="store"></render>
    <info :store="store"></info>
  </div>
</template>

<script setup>
import { ref, reactive, watchEffect, onUnmounted, onMounted } from 'vue'
import compileFile from './render/compileFile.js'

import Render from './render/Render.vue'
import Bar from './components/Bar.vue'
import Info from './components/Info.vue'

import srcApp from './render/src/App.vue?raw'
import * as example from './example.js'

const { state, plugins, hideBar, title } = defineProps({
  state: { default: {}, required: true },
  title: { default: '' }, // title on the bar
  hideBar: { default: false }, // hide functional bar
  plugins: { default: [] } // enabled plugins(module)
})

const ready = ref(false)
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

state.id = store.id
window.cubev.cubes[state.id] = state
if (!state.tab) state.tab = ''
if (!state.head) state.head = ''
if (!state.code) {
  state.code = example.code
  state.head = example.head
}

onUnmounted(() => { delete window.cubev.cubes[state.id] })

let pluginsHead = ''
onMounted(() => {
  watchEffect(async () => {
    ready.value = false
    pluginsHead = ''
    for (const p of plugins) {
      if (!p.name) {
        console.error(`[Cubev ${store.id}] Invalid plugin.`)
        continue
      }
      if (p.head) pluginsHead += p.head
      if (p.export) {
        for (const f in p.export) {
          store.files[`${p.name}/${f}`] = p.export[f]
          await compileFile(`${p.name}/${f}`, store)
        }
      }
      if (p.view) {
        store.tabs.push(p.name)
        store.files[`${p.name}/View.vue`] = p.view
        await compileFile(`${p.name}/View.vue`, store)
      }
    }
    const importPlugin = store.tabs.map(x => `import ${x} from './${x}/View.vue'`).join('\n')
    store.files['Cube.vue'] = state.code
    store.files['App.vue'] = srcApp.replace('/* IMPORT_PLUGIN */', importPlugin).replace('/* PLUGIN_LIST */', store.tabs.join(', '))
    await compileFile('Cube.vue', store)
    await compileFile('App.vue', store)
    ready.value = true
  })
  watchEffect(() => {
    if (state.tab != 'Head') store.head = pluginsHead + state.head
    store.files['Cube.vue'] = state.code
    if (state.tab == '') compileFile('Cube.vue', store)
  })
})
</script>
