export const headTip = `Things here will be placed in <head> in the sandbox.

You can include importmap here. Note that importmap has a limited support (Chrome 89+), for capability you can add <script async src="https://cdn.jsdelivr.net/npm/es-module-shims@0.10.1/dist/es-module-shims.min.js"></script>
When using importmap, scripts must be async.
`

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