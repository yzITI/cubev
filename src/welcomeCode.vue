<template>
  <h1 @click="click">{{ context.msg }}</h1>
  <input v-model="context.msg">
</template>

<script setup>
const { context } = defineProps(['context'])
if (!context.msg) context.msg = 'Welcome to Cubev!'
</script>