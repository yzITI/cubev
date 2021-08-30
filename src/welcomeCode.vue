<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg">
</template>

<script setup>
let msg = $ref('Welcome to Cubev!')
</script>