<template>
  <div v-if="error || warning" class="info">
    <pre v-if="error" style="color: red;">{{ error }}</pre>
    <pre v-if="warning" style="color: yellow;">{{ warning }}</pre>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'
const { store } = defineProps(['store'])
const error = computed(() => {
  if (store.errors.value.length) return store.errors.value[0]
  else return store.runtimeError.value
})
const warning = computed(() => store.runtimeWarning.value)
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
