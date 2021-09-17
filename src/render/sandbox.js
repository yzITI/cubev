import srcdoc from './src/doc.html?raw'
import * as Vue from 'vue'
const { createApp } = Vue

export class Sandbox {
  constructor (store) {
    this.id = store.id
    this.iframe = document.createElement('iframe')
    this.iframe.setAttribute('sandbox', 'allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation')
    this.iframe.setAttribute('style', 'border: none; width: 100%; display:block;')
    this.iframe.srcdoc = srcdoc.replace('<!--HEAD-->', store.head.replace(/\$/g, '$$$$'))
    this.checkResize = setInterval(() => {
      const w = this.iframe.contentWindow
      this.iframe.height = Number(w && w.document.body && w.document.body.scrollHeight) + 1
    }, 300)
  }
  destroy () {
    clearInterval(this.checkResize)
  }
  async update (modules) {
    const w = this.iframe.contentWindow
    if (!w) throw 'Sandbox not loaded'
    w.cubeId = this.id
    w.__modules__ = { vue: Vue }
    w.__css__ = ''
    for (const script of modules) {
      const scriptEl = w.document.createElement('script')
      scriptEl.setAttribute('type', 'module')
      const done = new Promise((resolve) => {
        w.__next__ = resolve
      })
      scriptEl.innerHTML = script + `\nwindow.__next__()`
      w.document.head.appendChild(scriptEl)
      scriptEl.onerror = err => console.error(err.message, err.stack)
      await done
      w.document.head.removeChild(scriptEl)
    }
    w.__next__ = () => console.error('Extra window.__next__(). This may be caused by double-run of module evaluation.')
    if (w.__app__) {
      w.__app__.unmount()
      w.document.getElementById('srcapp').innerHTML = ''
    }
    w.document.getElementById('__sfc-styles').innerHTML = w.__css__
    const app = w.__app__ = createApp(w.__modules__["App.vue"].default)
    app.config.errorHandler = e => console.error(e)
    app.mount(w.document.getElementById('srcapp'))
  }
}