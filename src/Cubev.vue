<template>
  <div class="cubev">
    <bar></bar>
    <render></render>
    <info></info>
  </div>
</template>

<script setup>
import { watchEffect } from 'vue'
import { compileFile } from './render/transform.js'
import * as store from './store.js'
watchEffect(() => compileFile(store.files['App.vue']))
watchEffect(() => compileFile(store.files['test.js']))

import Render from './render/Render.vue'
import Bar from './components/Bar.vue'
import Info from './components/Info.vue'
</script>

<style scoped>
div.cubev {
  min-width: 320px;
  max-width: 100vw;
  min-height: 100px;
}
</style>
