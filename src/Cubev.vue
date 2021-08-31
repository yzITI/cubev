<template>
  <div class="cubev">
    <bar v-if="!hideBar" :store="store"></bar>
    <render v-show="showRender" :store="store"></render>
    <code-mirror v-if="store.tab == 'Raw'" v-model="store.state.code"></code-mirror>
    <info :store="store"></info>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, reactive, computed, watch } from 'vue'
import { compileFile } from './render/transform.js'

import Render from './render/Render.vue'
import Bar from './components/Bar.vue'
import Info from './components/Info.vue'

import srcApp from './render/srcApp.vue?raw'
import welcomeCode from './welcomeCode.vue?raw'

import CodeMirror from './codemirror/CodeMirror.vue'

const { modelValue, addons, plugins, hideBar } = defineProps({
  modelValue: { default: {}, required: true },
  hideBar: { default: false },
  addons: { default: ['Raw'] },
  plugins: { default: [] }
})
const emit = defineEmits(['update:modelValue'])

const store = reactive({ // inside
  id: window.cubev++,
  files: {},
  tab: '',
  tabs: addons,
  errors: [],
  runtimeError: '',
  runtimeWarning: '',
  state: modelValue
})

watch(store.state, v => { emit('update:modelValue', v) }, { deep: true })
watch(() => modelValue, v => { store.state = v }, { deep: true })

const showRender = computed(() => {
  switch (store.tab) {
    case 'Raw': return false
    default: return true
  }
})

async function addFile (filename, code) {
  store.files[filename] = { filename, code, compiled: {} }
  return await compileFile(store.files[filename], store)
}

async function init () {
  if (!store.state.code) store.state.code = welcomeCode
  await addFile('App.vue', srcApp)
  await addFile('Cube.vue', store.state.code)
  watch(showRender, () => {
    store.files['Cube.vue'].code = store.state.code
    if (showRender.value) compileFile(store.files['Cube.vue'], store)
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
</style>
