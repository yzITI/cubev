<template>
  <div style="display: flex; height: 32px; width: 100%; align-items: center; justify-content: space-between; border-bottom: 1px solid #ccc;">
    <div @click="state.tab = ''" style="padding: 0 12px; cursor: pointer;">
      <img src="../assets/logo.svg" style="width: 32px;" />
    </div>
    <select v-if="store.tabs.length" v-model="state.tab" style="margin: 0 24px;">
      <option v-for="t in store.tabs" :key="t">{{ t }}</option>
    </select>
    <div v-else></div>
  </div>
</template>

<script setup>
const { store, state } = defineProps(['store', 'state'])
</script>
