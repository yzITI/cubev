<script setup>
import Cubev from './Cubev.vue'
import Source from '../plugins/Source?raw'
import Markdown from '../plugins/Markdown?raw'
import MarkdownRender from '../plugins/MarkdownRender?raw'
const parse = window.cubev.parse
let state1 = $ref({ tab: 'Source' })
const plugins1 = [parse(Source)]
const plugins2 = [parse(Markdown), parse(MarkdownRender)]
let state2 = $ref({ src: plugins2[1].src })
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
