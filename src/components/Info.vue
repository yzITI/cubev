<template>
  <div class="info">
    <pre v-if="error" style="color: red;">{{ error }}</pre>
    <pre v-if="warning" style="color: yellow;">{{ warning }}</pre>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import * as store from '../store.js'
const error = computed(() => {
  if (store.errors.value.length) return store.errors.value[0]
  else return store.runtimeError.value
})
const warning = computed(() => store.runtimeWarning.value)
</script>
