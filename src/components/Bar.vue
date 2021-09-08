<template>
  <div class="bar">
    <div @click="state.tab = ''" class="logo">
      <img src="../assets/logo.svg" height="32"/>
    </div>
    <select v-if="store.tabs.length" v-model="state.tab">
      <option v-for="t in store.tabs" :key="t">{{ t }}</option>
    </select>
    <div v-else></div>
  </div>
</template>

<script setup>
const { store, state } = defineProps(['store', 'state'])
</script>

<style scoped>
.bar {
  display: flex;
  height: 32px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
}
select {
  margin: 0 24px;
}
div.logo {
  padding: 0 12px;
  height: 32px;
  transition: all 0.3s ease;
  cursor: pointer;
}
div.logo:hover {
  background-color: rgb(79, 192, 141, 0.5);
}
</style>
