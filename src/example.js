export const headTip = `Things here will be placed in <head> in the sandbox.

You can include importmap here, but other scripts must be async. Note that importmap has a limited support (Chrome 89+), for capability you can first add <script async src="https://cdn.jsdelivr.net/npm/es-module-shims@0.10.1/dist/es-module-shims.min.js"></script>`

export const code = `<template>
  <div class="content">
    <p>Here is an example with Bulma (in Head).</p>
    <h1>{{ msg }}</h1>
    <input class="input" v-model="msg">
    <hr>
    <p>The following input is reactive across multiple Cubev components</p>
    <input class="input" placeholder="reactive message" v-model="context.msg">
  </div>
</template>

<script setup>
let msg = $ref('Welcome to Cubev!')
const { context } = defineProps(['context'])
</script>

<style scoped>
div {
  padding: 0 16px;
}
</style>`

export const head = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@latest/css/bulma.min.css">
<style>html { overflow-y: auto; }</style>`

export const markdownHead = `<script src="https://cdn.jsdelivr.net/npm/markdown-it@12.0.3/dist/markdown-it.min.js"></script>
<script type="text/javascript">
  window.MathJax = {
    tex: { inlineMath: [['$', '$'], ['\\\\(', '\\\\)']], formatError: (jax, err) => jax.formatError(err) },
    options: { enableMenu: false }
  }
</script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3.1.2/es5/tex-svg.js"></script>
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

export const markdownCode = `<template>
  <div v-html="md"></div>
</template>

<script setup>
import { nextTick } from 'vue'
const mmp = window.markdownit({ html: true })
const { state } = defineProps(['state'])
let md = $computed(() => {
  nextTick(() => { window.MathJax.typeset() })
  return mmp.render(state.markdown || '')
})
</script>

<style scoped>
div {
  padding: 0 16px;
}
</style>
`