<script setup>
import { ref } from 'vue'
import Cubev from './Cubev.vue'
</script>

<template>
  <h1>Cubev 1</h1>
  <cubev cube-id="1"></cubev>
  <h1>&nbsp;</h1>
  <h1>Cubev 2</h1>
  <cubev cube-id="2" :hide-bar="true"></cubev>
</template>

<style>
body {
  margin: 0;
}
</style>
