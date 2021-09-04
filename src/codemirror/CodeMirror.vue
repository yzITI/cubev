<template>
  <div style="background: #eee;">
    <slot></slot>
  </div>
  <div class="editor" ref="el"></div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { debounce } from './utils.js'
import CodeMirror from './codemirror.js'

const el = ref()

const props = defineProps({
  state: { required: true },
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
    if (state.tab == 'Code') state.code = code
    if (state.tab == 'Head') state.head = code
    if (state.tab == 'Markdown') state.markdown = code
  })

  watchEffect(() => {
    let target = ''
    if (state.tab == 'Code') target = state.code
    if (state.tab == 'Head') target = state.head
    if (state.tab == 'Markdown') target = state.markdown || ''
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
