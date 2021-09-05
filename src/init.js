import * as Vue from 'vue'
if (!window.cubev) window.cubev = {
  Vue: Vue,
  count: 0,
  context: Vue.reactive({}),
  cubes: {} // instances
}
export default {}
