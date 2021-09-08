export const name = 'MarkdownRender'

export const head = `<script src="https://cdn.jsdelivr.net/npm/markdown-it@12.0.3/dist/markdown-it.min.js"></script>
<script type="text/javascript">
  window.MathJax = {
    tex: { inlineMath: [['$', '$'], ['\\\\(', '\\\\)']], formatError: (jax, err) => jax.formatError(err) },
    options: { enableMenu: false }
  }
</script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3.1.2/es5/tex-svg.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.2.0/build/styles/default.min.css">
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.2.0/build/highlight.min.js"></script>
<style>
  * { outline: none; }
  mjx-container { max-width: 95%; overflow: auto; }
  blockquote {
    padding: 10px;
    margin: 10px 0;
    border-left: 5px solid #ccc;
    border-radius: 3px;
  }
  blockquote * {
    margin: 0;
  }
</style>`

// extra member
export const code = `<template>
  <div v-html="md"></div>
</template>

<script setup>
import { nextTick } from 'vue'
const mmp = window.markdownit({ html: true })
const { state } = defineProps(['state'])
let md = $computed(() => {
  nextTick(() => {
    window.MathJax.typeset()
    hljs.highlightAll()
  })
  return mmp.render(state.markdown || '')
})
</script>

<style scoped>
div {
  padding: 0 16px;
}
</style>`