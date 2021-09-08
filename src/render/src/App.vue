<script setup>
import { onMounted, reactive } from 'vue'
import Cube from './Cube.vue'
/* IMPORT_PLUGIN */
const id = window.cubeId
const C = parent.cubev
const components = { '': Cube,
  /* PLUGIN_LIST */
}
</script>
<template>
  <component :is="components[C.cubes[id].tab]" :context="C.context" :state="C.cubes[id]"></component>
</template>