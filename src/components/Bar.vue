<template>
  <div class="bar">
    <div @click="state.tab = 'Cube'">
      <img src="../assets/logo.svg" height="32"/>
    </div>
    <div v-for="t in store.tabs" :class="{ chosen: t == state.tab }" @click="state.tab = t" :key="t">{{ t }}</div>
  </div>
</template>

<script setup>
const { store, state } = defineProps(['store', 'state'])
</script>

<style scoped>
.bar {
  display: flex;
  height: 48px;
  width: 100%;
  overflow-x: auto;
  align-items: flex-end;
  border-bottom: 1px solid #ccc;
}

.bar div {
  user-select: none;
  text-align: center;
  font-size: 0.8rem;
  line-height: 32px;
  height: 32px;
  padding: 0 10px;
  font-family: Arial, Helvetica, sans-serif;
  transition: all 0.3s ease;
  cursor: pointer;
}

.bar div:hover {
  background-color: rgb(79,192,141, 0.5);
}

.chosen {
  background-color: rgb(79,192,141, 0.8);
}
</style>
