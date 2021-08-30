# ![](https://raw.githubusercontent.com/yzITI/cubev/main/src/assets/logo.svg) Cubev

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

const state = {
  code: exampleCode
}
</script>
```