<script setup>
import { ref } from 'vue'
import Cubev from './Cubev.vue'
const state1 = {}
const state2 = {}
</script>

<template>
  <h1>Cubev 1</h1>
  <cubev v-model="state1"></cubev>
  <h1>&nbsp;</h1>
  <h1>Cubev 2</h1>
  <cubev v-model="state2" :hide-bar="true"></cubev>
</template>

<style>
body {
  margin: 0;
}
</style>
