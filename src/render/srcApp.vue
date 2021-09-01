<script setup>
import { watch, ref } from 'vue'
import Cube from './Cube.vue'
const id = window.cubeId
const C = parent.cubev
const context = ref(C.context)
let unwatch = null
function startWatch () {
  unwatch = watch(context, v => {
    C.context = _.cloneDeep(v)
    for (const k in C.cubes) {
      if (k == id || !C.cubes[k].callback) continue
      C.cubes[k].callback()
    }
  }, { deep: true })
}
startWatch()
C.cubes[id].callback = () => {
  if (unwatch) unwatch()
  // must do this brutal copy. Try to improve in the future
  for (const k in context.value) delete context.value[k]
  for (const k in C.context) context.value[k] = C.context[k]
  startWatch()
}
</script>
<template>
  <cube :context="context"></cube>
</template>