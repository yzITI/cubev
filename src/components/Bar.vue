<template>
  <div class="bar">
    <div @click="store.tab = 'Cube'">
      <img src="../assets/logo.svg" height="32"/>
    </div>
    <div v-for="t in tabs" :class="{ chosen: t == store.tab }" @click="store.tab = t">{{ t }}</div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
const { store } = defineProps(['store'])
const tabs = computed(() => store.tabs)
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
