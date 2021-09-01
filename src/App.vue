<script setup>
import Cubev from './Cubev.vue'
let state1 = $ref({})
let state2 = $ref({})
</script>

<template>
  <cubev :state="state1"></cubev>
  <hr style="margin: 50px;">
  <cubev :state="state2"></cubev>
</template>

<style>
body {
  margin: 0;
}
</style>
