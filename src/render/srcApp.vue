<script setup>
import { watch, ref } from 'vue'
import Cube from './Cube.vue'
const id = window.cubeId
const C = parent.cubev
const context = ref(C.context)
let unwatch = null
function startWatch () {
  unwatch = watch(() => context.value, v => {
    C.context = _.cloneDeep(v)
    for (const k in C) {
      if (k == 'context' || k == id || !C[k].callback) continue
      C[k].callback()
    }
  }, { deep: true })
}
startWatch()
C[id].callback = () => {
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