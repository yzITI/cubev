# ![](https://raw.githubusercontent.com/yzITI/cubev/main/src/assets/logo.svg) Cubev

a Cube with Vue! A reactive, open-interface, dynamic, in-browser Vue 3 SFC renderer and editor inspired by <https://sfc.vuejs.org/>.

![chrome-capture.gif](https://i.loli.net/2021/09/10/1Fs5d9ejQi4cYxC.gif)

## Installation

```
npm i cubev
```

In `main.js`, add the following code
```js
import 'cubev/style'
```

In `index.html`, add the following element to `<head>`
```html
<script>window.process = { env: {} }</script>
```

## Get Started

### Simplest Example

> Use embedded example code & head

```html
<template>
  <cubev :state="state1"></cubev>
  <cubev :state="state2"></cubev>
</template>

<script setup>
import { reactive } from 'vue'
import Cubev from 'cubev'

const state1 = reactive({})
const state2 = reactive({})
</script>
```

### Pass in Code & Head

```html
<template>
  <cubev :state="state"></cubev>
</template>

<script setup>
import { reactive } from 'vue'
import Cubev from 'cubev'

const exampleCode = `
<template>
  <h1>{{ msg }}</h1>
</template>
<script setup>
let msg = $ref('Hello Cubev!')
<\/script>
`

const state = reactive({
  code: exampleCode, // optional
  head: '' // optional, style links etc.
})
</script>
```

### Use Plugins

```html
<template>
  <cubev :state="state1" :plugins="[Code, Head]"></cubev>
  <cubev :state="state2" :plugins="[MarkdownRender]"></cubev>
</template>

<script setup>
import Cubev from 'cubev'
import * as Code from 'cubev/plugins/Code.js'
import * as Head from 'cubev/plugins/Head.js'
import * as MarkdownRender from 'cubev/plugins/MarkdownRender.js'
// use code & head editor
let state1 = $ref({})
// use to render markdown
let state2 = $ref({
  code: MarkdownRender.code,
  markdown: '## Hello! \n\n This cubev uses plugin `MarkdownRender` \n\n ```js\nconsole.log(\'Welcome to Cubev!\')\n```\n**Associated Legendre Functions** are solutions to ($l, m$ are integers)\n$$(1-x^2)y\'\' - 2xy\' + [l(l+1) - \\frac{m^2}{1-x^2}]y = 0$$'
})
</script>
```
