<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  watchEffect,
  watch
} from 'vue'
import srcdoc from './srcdoc.html?raw'
import { Proxy } from './Proxy.js'
import { MAIN_FILE, vueRuntimeUrl } from './transform.js'
import compileModule from './moduleCompiler.js'
import store from '../store.js'

const container = ref()

let sandbox, proxy, stopUpdateWatcher

// create sandbox on mount
onMounted(createSandbox)

// reset sandbox when import map changes
watch(
  () => store.importMap,
  (importMap, prev) => {
    if (!importMap) {
      if (prev) {
        // import-map.json deleted
        createSandbox()
      }
      return
    }
    try {
      const map = JSON.parse(importMap)
      if (!map.imports) {
        store.errors = [`import-map.json is missing "imports" field.`]
        return
      }
      if (map.imports.vue) {
        store.errors = [
          'Select Vue versions using the top-right dropdown.\n' +
            'Specifying it in the import map has no effect.'
        ]
      }
      createSandbox()
    } catch (e) {
      store.errors = [e]
      return
    }
  }
)

onUnmounted(() => {
  proxy.destroy()
  stopUpdateWatcher && stopUpdateWatcher()
})

function createSandbox() {
  if (sandbox) {
    // clear prev sandbox
    proxy.destroy()
    stopUpdateWatcher()
    container.value.removeChild(sandbox)
  }

  sandbox = document.createElement('iframe')
  sandbox.setAttribute(
    'sandbox',
    [
      'allow-forms',
      'allow-modals',
      'allow-pointer-lock',
      'allow-popups',
      'allow-same-origin',
      'allow-scripts',
      'allow-top-navigation-by-user-activation'
    ].join(' ')
  )

  let importMap
  try {
    importMap = JSON.parse(store.importMap || `{}`)
  } catch (e) {
    store.errors = [`Syntax error in import-map.json: ${e.message}`]
    return
  }

  if (!importMap.imports) {
    importMap.imports = {}
  }
  importMap.imports.vue = vueRuntimeUrl.value
  const sandboxSrc = srcdoc.replace(
    /<!--IMPORT_MAP-->/,
    JSON.stringify(importMap)
  )
  sandbox.srcdoc = sandboxSrc
  container.value.appendChild(sandbox)

  proxy = new Proxy(sandbox, {
    on_fetch_progress: (progress) => {
      // pending_imports = progress;
    },
    on_error: (event) => {
      const msg =
        event.value instanceof Error ? event.value.message : event.value
      if (
        msg.includes('Failed to resolve module specifier') ||
        msg.includes('Error resolving module specifier')
      ) {
        store.runtimeError =
          msg.replace(/\. Relative references must.*$/, '') +
          `.\nTip: add an "import-map.json" file to specify import paths for dependencies.`
      } else {
        store.runtimeError = event.value
      }
    },
    on_unhandled_rejection: (event) => {
      let error = event.value
      if (typeof error === 'string') {
        error = { message: error }
      }
      store.runtimeError = 'Uncaught (in promise): ' + error.message
    },
    on_console: (log) => {
      if (log.duplicate) return
      if (log.level === 'error') {
        if (log.args[0] instanceof Error) {
          store.runtimeError = log.args[0].message
        } else {
          store.runtimeError = log.args[0]
        }
      } else if (log.level === 'warn') {
        if (log.args[0].toString().includes('[Vue warn]')) {
          store.runtimeWarning = log.args
            .join('')
            .replace(/\[Vue warn\]:/, '')
            .trim()
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
    proxy.handle_links()
    stopUpdateWatcher = watchEffect(updateRender)
  })
}

async function updateRender() {
  if (import.meta.env.PROD) {
    console.clear()
  }
  store.runtimeError = null
  store.runtimeWarning = null
  try {
    const modules = compileModule()
    console.log(`successfully compiled ${modules.length} modules.`)
    // reset modules
    await proxy.eval([
      `window.__modules__ = {};window.__css__ = '';`,
      ...modules,
      `import { createApp as _createApp } from "vue"
      
      if (window.__app__) {
        window.__app__.unmount()
        document.getElementById('app').innerHTML = ''
      }
      
      document.getElementById('__sfc-styles').innerHTML = window.__css__
      const app = window.__app__ = _createApp(__modules__["${MAIN_FILE}"].default)
      app.config.errorHandler = e => console.error(e)
      app.mount('#app')`.trim()
    ])
  } catch (e) {
    store.runtimeError = e.message
  }
}
</script>

<template>
  <div class="render-container" ref="container"></div>
</template>

<style scoped>
.render-container,
iframe {
  width: 100%;
  height: 100%;
  /*border: none;*/
  background-color: #fff;
}
</style>
