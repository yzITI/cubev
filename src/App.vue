<script setup>
import Cubev from './Cubev.vue'
let state1 = $ref({})
let state2 = $ref({})

import * as Code from '../plugins/Code.js'
import * as Head from '../plugins/Head.js'
</script>

<template>
  <cubev :state="state1" :plugins="[Code, Head]"></cubev>
  <hr style="margin: 50px;">
  <cubev :state="state2"></cubev>
</template>

<style>
body {
  margin: 0;
}
</style>
