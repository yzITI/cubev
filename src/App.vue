<script setup>
import Cubev from './Cubev.vue'
import loader from './render/loader.js'
import Code from '../plugins/Code?raw'
import Head from '../plugins/Head?raw'
import Plugin from '../plugins/Plugin?raw'
let state1 = $ref({})
const plugins = {}
async function init () {
  plugins.push(await loader({ str: Code }))
  plugins.push(await loader({ str: Head }))
  plugins.push(await loader({ str: Plugin }))
}
init()
</script>

<template>
  <cubev :state="state1" :plugins="plugins"></cubev>
  <div style="height: 50px;" />
  <cubev title="Markdown" :state="state2" :plugins=""></cubev>
  <div style="height: 500px;" />
</template>

<style>
body {
  background: #ddd;
}
</style>
