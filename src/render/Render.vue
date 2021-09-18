<template>
  <div ref="container" style="width: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, watchEffect } from 'vue'
import { Sandbox } from './sandbox.js'
import compileFile from './compileFile.js'
import compileModule from './compileModule.js'

const container = ref()
let sandbox, stopWatch
const { store } = defineProps(['store'])

// create sandbox on mount
onMounted(createSandbox)

// reset sandbox when head changes
watch(() => store.head, createSandbox)

onUnmounted(() => {
  if (stopWatch) stopWatch()
  sandbox.destroy()
})

async function compileAllFiles () {
  for (const f in store.files) await compileFile(f, store)
}

function createSandbox() {
  if (stopWatch) stopWatch()
  if (sandbox) { // clear prev sandbox
    container.value.removeChild(sandbox.iframe)
    sandbox.destroy()
  }
  sandbox = new Sandbox(store)
  container.value.appendChild(sandbox.iframe)
  sandbox.iframe.addEventListener('load', () => {
    console.log(`[Cubev ${store.id}] sandbox setup.`)
    setTimeout(() => {
      stopWatch = watch(store.files, async () => {
        await compileAllFiles()
        updateRender()
      }, { immediate: true })
    }, 30)
  })
}

async function updateRender() {
  store.runtimeError = null
  store.runtimeWarning = null
  try {
    const modules = compileModule(store.compiled)
    console.log(`[Cubev ${store.id}] successfully compiled ${modules.length} modules.`)
    await sandbox.update(modules)
  } catch (e) {
    store.runtimeError = e.message
    console.error(e)
  }
}
</script>
