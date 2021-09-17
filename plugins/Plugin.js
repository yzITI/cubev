export const name = 'Plugin'

export const head = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@latest/css/bulma.min.css">
<style>html { overflow-y: auto; }</style>`

export const view = `<template>
  <div class="m-3">
    <h1 class="title">Plugin Maker</h1>
    <div>
      <input class="input is-small" style="width: 70%;" v-model="url" placeholder="url of a plugin">
      <button class="button is-primary is-small ml-2">Load Template</button>
    </div>
    <h1 class="title is-5 m-2">Output Plugin Code:</h1>
    <textarea rows="20" class="p-2" style="font-family: monospace; background: #eee; border: none; width: 100%;" v-model="output"></textarea>
  </div>
</template>
<script setup>
import { watchEffect } from 'vue'
const { state } = defineProps(['state'])
let url = $ref('')
let output = $ref('Test output')
watchEffect(() => {
  output = \`export const name = '[Plugin Name]'

export const head = \\\`\${state.head.replace(/\\\`/g, '\\\\\\\`')}\\\`

export const view = \\\`\${state.code.replace(/\\\`/g, '\\\\\\\`')}\\\`\`
})
</script>`
