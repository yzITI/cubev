<template>
  <render></render>
</template>

<script setup>
import { watchEffect } from 'vue'
import { compileFile } from '../render/transform.js'
import store from '../store.js'
watchEffect(() => compileFile(store.files['App.vue']))
watchEffect(() => compileFile(store.files['test.js']))

import Render from '../render/Render.vue'
</script>

<style scoped>
</style>
