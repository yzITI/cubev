<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg">
  <h1>{{ context.msg }}</h1>
  <input v-model="context.msg">
</template>

<script setup>
let msg = $ref('Welcome to Cubev!')
const { context } = defineProps(['context'])
</script>