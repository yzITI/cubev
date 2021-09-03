# ![](https://raw.githubusercontent.com/yzITI/cubev/main/src/assets/logo.svg) Cubev

a Cube with Vue! A reactive, open-interface, dynamic, in-browser Vue 3 SFC renderer and editor inspired by <https://sfc.vuejs.org/>.

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

If no code is passed in, Cubev will use an example code. Play with it!
