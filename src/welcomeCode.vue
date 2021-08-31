<template>
  <h1>{{ state.msg }}</h1>
  <input v-model="state.msg">
</template>

<script setup>
const { state } = defineProps(['state'])
if (!state.msg) state.msg = 'hello'
</script>