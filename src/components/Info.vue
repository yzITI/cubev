<template>
  <div class="info">
    <pre v-if="error" style="color: red;">{{ error }}</pre>
    <pre v-if="warning" style="color: yellow;">{{ warning }}</pre>
  </div>
</template>

<script setup>
import { watchEffect, ref } from 'vue'
import store from '../store.js'
const error = ref(store.runtimeError)
const warning = ref(store.runtimeWarning)
watchEffect(() => {
  if (store.errors.length) error.value = store.errors[0]
  else error.value = store.runtimeError
  warning.value = store.runtimeWarning
})
</script>
