<script setup>
import Cube from './Cube.vue'
const id = window.cubeId
const C = parent.cubev
</script>
<template>
  <cube :context="C.context" :state="C.cubes[id]"></cube>
</template>