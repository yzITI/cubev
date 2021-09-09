export const name = 'Markdown'

export const head = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/codemirror@5.62.3/lib/codemirror.css">
<script src="https://cdn.jsdelivr.net/npm/codemirror@5.62.3/lib/codemirror.js"></script>
<script src="https://cdn.jsdelivr.net/npm/codemirror@5.62.3/mode/markdown/markdown.js"></script>
<script src="https://cdn.jsdelivr.net/npm/codemirror@5.62.3/addon/edit/closebrackets.js"></script>`

export const view = `<template>
  <div class="editor" ref="el"></div>
</template>
<script setup>
import { ref, onMounted, watchEffect } from 'vue'
const el = ref(), { state } = defineProps(['state'])
let code = ''
onMounted(() => {
  const editor = CodeMirror(el.value, {
    value: '',
    mode: 'markdown',
    tabSize: 2,
    lineWrapping: true,
    lineNumbers: true,
    scrollbarStyle: null,
    viewportMargin: Infinity,
    autoCloseBrackets: true
  })
  editor.on('change', () => {
    code = editor.getValue()
    state.markdown = code
  })
  watchEffect(() => {
    if (state.markdown != code) editor.setValue(state.markdown || '')
  })
  setTimeout(() => { editor.refresh() }, 50)
})
</script>
<style>
.CodeMirror {
  height: auto;
  background: #f9f9f9;
}
</style>`