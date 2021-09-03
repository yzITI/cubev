<template>
  <div class="render-container" ref="container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, defineProps } from 'vue'
import srcdoc from './srcdoc.html?raw'
import { Proxy } from './proxy.js'
import compileModule from './compileModule.js'

const container = ref()
let sandbox, proxy, stopWatch
const { store } = defineProps(['store'])

// create sandbox on mount
onMounted(createSandbox)

// reset sandbox when head changes
watch(() => store.head, createSandbox)

onUnmounted(() => {
  if (stopWatch) stopWatch()
  proxy.destroy()
})

function createSandbox() {
  if (sandbox) { // clear prev sandbox
    proxy.destroy()
    container.value.removeChild(sandbox)
  }
  if (stopWatch) stopWatch()
  sandbox = document.createElement('iframe')
  sandbox.setAttribute('sandbox', 'allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation')
  sandbox.setAttribute('id', 'sandbox' + store.id)

  const sandboxSrc = srcdoc.replace('<!--HEAD-->', store.head)
  sandbox.srcdoc = sandboxSrc
  container.value.appendChild(sandbox)

  proxy = new Proxy(sandbox, {
    on_fetch_progress: (progress) => {
      // pending_imports = progress;
    },
    on_error: (event) => {
      const msg = event.value instanceof Error ? event.value.message : event.value
      if (msg.includes('Failed to resolve module specifier') || msg.includes('Error resolving module specifier')) {
        store.runtimeError = msg.replace(/\. Relative references must.*$/, '') + `.\nTip: add an importmap to head (Note that only Chrome 89+ support that).`
      } else store.runtimeError = event.value
    },
    on_unhandled_rejection: (event) => {
      let error = event.value
      if (typeof error === 'string') error = { message: error }
      store.runtimeError = 'Uncaught (in promise): ' + error.message
    },
    on_console: (log) => {
      if (log.duplicate) return
      if (log.level === 'error') {
        if (log.args[0] instanceof Error) store.runtimeError = log.args[0].message
        else store.runtimeError = log.args[0]
      } else if (log.level === 'warn') {
        if (log.args[0].toString().includes('[Vue warn]')) {
          store.runtimeWarning = log.args.join('').replace(/\[Vue warn\]:/, '').trim()
        }
      }
    },
    on_console_group: (action) => {
      // group_logs(action.label, false);
    },
    on_console_group_end: () => {
      // ungroup_logs();
    },
    on_console_group_collapsed: (action) => {
      // group_logs(action.label, true);
    }
  })

  sandbox.addEventListener('load', () => {
    console.log(`[Cubev ${store.id}] sandbox loaded.`)
    setTimeout(() => {
      proxy.handle_links()
      updateRender()
      stopWatch = watch(store.compiled, updateRender)
    }, 30)
  })
}

async function updateRender() {
  store.runtimeError = null
  store.runtimeWarning = null
  try {
    const modules = compileModule(store.compiled)
    console.log(`[Cubev ${store.id}] successfully compiled ${modules.length} modules.`)
    // reset modules
    proxy.eval([
      `window.__modules__ = { vue: parent.cubev.Vue };window.__css__ = '';window.cubeId = '${store.id}';`,
      ...modules,
      `const { createApp: _createApp } = window.__modules__.vue
      if (window.__app__) {
        window.__app__.unmount()
        document.getElementById('srcapp').innerHTML = ''
      }
      document.getElementById('__sfc-styles').innerHTML = window.__css__
      const app = window.__app__ = _createApp(__modules__["App.vue"].default)
      app.config.errorHandler = e => console.error(e)
      app.mount(document.getElementById('srcapp'))`.trim()
    ])
  } catch (e) {
    store.runtimeError = e.message
  }
}
</script>

<style>
.render-container {
  width: 100%;
  background-color: white;
}
.render-container iframe {
  border: none;
  width: 100%;
  background-color: #fff;
}
</style>
