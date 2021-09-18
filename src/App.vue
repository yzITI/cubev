<script setup>
import Cubev from './Cubev.vue'
import { parse } from './render/pluginLoader.js'
import Code from '../plugins/Code?raw'
import Head from '../plugins/Head?raw'
import Markdown from '../plugins/Markdown?raw'
import MarkdownRender from '../plugins/MarkdownRender?raw'
let state1 = $ref({})
const plugins1 = [parse(Code), parse(Head)]
const plugins2 = [parse(Markdown), parse(MarkdownRender)]
let state2 = $ref({ code: plugins2[1].code })
</script>

<template>
  <cubev :state="state1" :plugins="plugins1"></cubev>
  <div style="height: 50px;" />
  <cubev title="Markdown" :state="state2" :plugins="plugins2"></cubev>
  <div style="height: 500px;" />
</template>

<style>
body {
  background: #ddd;
}
</style>
