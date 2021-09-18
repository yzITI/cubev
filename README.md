# ![](https://raw.githubusercontent.com/yzITI/cubev/main/src/assets/logo.svg) Cubev

a Cube with Vue! A reactive, open-interface, dynamic, in-browser Vue 3 SFC renderer and editor inspired by <https://sfc.vuejs.org/>.

![1631410354689_447469E1-B277-4c77-8B34-698F1BCFC663.png](https://i.loli.net/2021/09/12/lO67XWSwibBH2uR.png)

## Installation

```
npm i cubev
```

In `index.html`, add the following element to `<head>`
```html
<script>window.process = { env: {} }</script>
```

## Get Started

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
