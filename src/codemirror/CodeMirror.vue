<template>
  <div class="editor" ref="el"></div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { debounce } from './utils.js'
import CodeMirror from './codemirror.js'

const el = ref()

const props = defineProps({
  mode: { default: 'htmlmixed' },
  modelValue: { default: '' },
  readonly: { default: false }
})

const emit = defineEmits(['update:modelValue'])

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
    emit('update:modelValue', editor.getValue())
  })

  watchEffect(() => {
    editor.setValue(props.modelValue)
  })
  watchEffect(() => {
    editor.setOption('mode', props.mode)
  })

  window.addEventListener(
    'resize',
    debounce(() => {
      editor.refresh()
    })
  )

  setTimeout(() => {
    editor.refresh()
  }, 50)
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
