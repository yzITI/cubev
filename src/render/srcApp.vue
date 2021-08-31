<script setup>
import Cube from './Cube.vue'
const ctx = window.cubev.context
</script>
<template>
  <input type="text" v-model="ctx.test">
  <cube></cube>
</template>