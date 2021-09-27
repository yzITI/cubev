<template>
  <div v-if="error || warning" style="width: 100%; border-top: 1px solid #ccc; overflow-x: auto;">
    <pre v-if="error" style="color: red; padding: 0 8px;">{{ error }}</pre>
    <pre v-if="warning" style="color: yellow; padding: 0 8px;">{{ warning }}</pre>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const { store } = defineProps(['store'])
const error = computed(() => {
  if (store.errors.length) return store.errors[0]
  else return store.runtimeError
})
const warning = computed(() => store.runtimeWarning)
</script>
