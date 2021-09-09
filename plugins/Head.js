export const name = 'Head'

export const head = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/codemirror@5.62.3/lib/codemirror.css">
<script src="https://cdn.jsdelivr.net/npm/codemirror@5.62.3/lib/codemirror.js"></script>
<script src="https://cdn.jsdelivr.net/npm/codemirror@5.62.3/mode/javascript/javascript.js"></script>
<script src="https://cdn.jsdelivr.net/npm/codemirror@5.62.3/mode/css/css.js"></script>
<script src="https://cdn.jsdelivr.net/npm/codemirror@5.62.3/mode/xml/xml.js"></script>
<script src="https://cdn.jsdelivr.net/npm/codemirror@5.62.3/mode/htmlmixed/htmlmixed.js"></script>
<script src="https://cdn.jsdelivr.net/npm/codemirror@5.62.3/addon/comment/comment.js"></script>
<script src="https://cdn.jsdelivr.net/npm/codemirror@5.62.3/addon/edit/closebrackets.js"></script>
<script src="https://cdn.jsdelivr.net/npm/codemirror@5.62.3/addon/edit/closetag.js"></script>`

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
    mode: 'htmlmixed',
    tabSize: 2,
    lineWrapping: true,
    lineNumbers: true,
    scrollbarStyle: null,
    viewportMargin: Infinity,
    autoCloseBrackets: true,
    autoCloseTags: true
  })
  editor.on('change', () => {
    code = editor.getValue()
    state.head = code
  })
  watchEffect(() => {
    if (state.head != code) editor.setValue(state.head)
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
