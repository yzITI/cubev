<script setup>
import { ref, unref, watch } from 'vue'
import Cube from './Cube.vue'
const state = ref(window.initialState)
window.addEventListener('message', e => {
  if (e.data.action == 'sync_state') state.value = JSON.parse(e.data.state)
}, false)
watch(state, () => {
  parent.postMessage({ action: 'sync_state', state: JSON.stringify(state.value) }, '*')
}, { deep: true })
</script>
<template>
  <cube :state="state"></cube>
</template>