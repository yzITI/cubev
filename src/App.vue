<script setup>
import Cubev from './Cubev.vue'
import loader from './render/loader.js'
loader('/Example')
  .then(console.log)
let state1 = $ref({})
</script>

<template>
  <cubev :state="state1"></cubev>
  <div style="height: 50px;" />
  <!--
  <cubev title="Markdown" :state="state2" :plugins="[MarkdownRender, Markdown]"></cubev>
  <div style="height: 500px;" />-->
</template>

<style>
body {
  background: #ddd;
}
</style>
