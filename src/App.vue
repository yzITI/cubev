<script setup>
import { ref } from 'vue'
import Cubev from './Cubev.vue'
const state1 = {}
const state2 = {}
</script>

<template>
  <cubev :state="state1"></cubev>
  <cubev :state="state2"></cubev>
</template>

<style>
body {
  margin: 0;
}
</style>
