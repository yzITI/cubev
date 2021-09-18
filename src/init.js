import { reactive } from 'vue'
import loader from './render/loader.js'
if (!window.cubev) window.cubev = {
  count: 0,
  load: loader,
  context: reactive({}),
  cubes: {} // instances
}
export default {}
