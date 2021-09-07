import { reactive } from 'vue'
if (!window.cubev) window.cubev = {
  count: 0,
  context: reactive({}),
  cubes: {} // instances
}
export default {}
