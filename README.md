# ![](https://raw.githubusercontent.com/yzITI/cubev/main/src/assets/logo.svg) Cubev

a Cube with Vue! A reactive, open-interface, dynamic, in-browser Vue 3 SFC renderer and editor inspired by <https://sfc.vuejs.org/>.

## Installation

```
npm i cubev
```

In `main.js`
```js
import 'cubev/style'
```

## Get Started

```html
<template>
  <cubev :state="state"></cubev>
</template>

<script setup>
import Cubev from 'cubev'

const exampleCode = `
<template>
  <h1>{{ msg }}</h1>
</template>
<script setup>
let msg = $ref('Hello Cubev!')
</script>
`

const state = $ref({
  code: exampleCode
})
</script>
```
