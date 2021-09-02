import * as Vue from 'vue'
if (!window.cubev) window.cubev = {
  Vue: Vue,
  count: 0,
  context: Vue.reactive({})
}
window.process = { env: {} }
export default {}
