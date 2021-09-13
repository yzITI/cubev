<template>
  <div style="display: flex; height: 32px; width: 100%; align-items: center; justify-content: space-between; border-bottom: 1px solid #ccc;">
    <div style="display: flex; align-items: center;">
      <div @click="state.tab = ''" style="height: 32px; padding: 0 12px; cursor: pointer;">
        <img src="../assets/logo.svg" style="width: 32px;" />
      </div>
      <span style="font-family: sans-serif; font-size: 0.8rem;">{{ title }}</span>
    </div>
    <select v-if="store.tabs.length" v-model="state.tab" style="margin: 0 8px; height: 30px; padding: 0 8px; border: none; outline: none; font-weight: bold; background: white;">
      <option v-for="t in store.tabs" :key="t">{{ t }}</option>
    </select>
    <div v-else></div>
  </div>
</template>

<script setup>
const { store, state, title } = defineProps(['title', 'store', 'state'])
</script>
