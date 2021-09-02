<template>
  <pre v-if="props.tip">{{ props.tip }}</pre>
  <div class="editor" ref="el"></div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { debounce } from './utils.js'
import CodeMirror from './codemirror.js'

const el = ref()

const props = defineProps({
  state: { required: true },
  tip: { default: '' },
  mode: { default: 'htmlmixed' },
  readonly: { default: false }
})
const state = props.state

let code = ''
onMounted(() => {
  const addonOptions = {
    autoCloseBrackets: true,
    autoCloseTags: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
  }

  const editor = CodeMirror(el.value, {
    value: '',
    mode: props.mode,
    readOnly: props.readonly,
    tabSize: 2,
    lineWrapping: true,
    lineNumbers: true,
    scrollbarStyle: null,
    ...addonOptions
  })

  editor.on('change', () => {
    code = editor.getValue()
    if (state.tab == 'Raw') state.code = code
    if (state.tab == 'Head') state.head = code
  })

  watchEffect(() => {
    let target = ''
    if (state.tab == 'Raw') target = state.code
    if (state.tab == 'Head') target = state.head
    if (target != code) editor.setValue(target)
  })
  watchEffect(() => {
    editor.setOption('mode', props.mode)
  })

  window.addEventListener('resize',
    debounce(() => { editor.refresh() })
  )

  setTimeout(() => { editor.refresh() }, 50)
})
</script>

<style scoped>
pre {
  background-color: #eee;
  padding: 16px;
  margin: 0;
  white-space: pre-wrap;
}
.editor {
  position: relative;
  width: 100%;
  background-color: #eee;
  overflow: hidden;
}
</style>
<style>
.CodeMirror {
  font-family: 'Source Code Pro', monospace;
  height: 100%;
}
.CodeMirror-scroll {
  padding-top: 16px;
  overflow-y: hidden !important;
}
</style>
