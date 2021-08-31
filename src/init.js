import { reactive, ref } from 'vue'
if (!window.cubev) window.cubev = {
  context: reactive({ test: 'wa' })
}
window.process = { env: {} }
export default {}
