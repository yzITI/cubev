<template>
  <div v-if="error || warning" class="info">
    <pre v-if="error" style="color: red;">{{ error }}</pre>
    <pre v-if="warning" style="color: yellow;">{{ warning }}</pre>
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

<style scoped>
div.info {
  width: 100%;
  border-top: 1px solid #ccc;
}
pre {
  overflow-x: auto;
  padding: 0 8px;
}
</style>
