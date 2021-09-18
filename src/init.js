import { reactive } from 'vue'
import * as pluginLoader from './render/pluginLoader.js'
if (!window.cubev) window.cubev = {
  count: 0,
  load: pluginLoader.load,
  parse: pluginLoader.parse,
  context: reactive({}),
  cubes: {} // instances
}
export default {}
