<script setup>
import Cubev from './Cubev.vue'
import * as Code from '../plugins/Code.js'
import * as Head from '../plugins/Head.js'
import * as Markdown from '../plugins/Markdown.js'
import * as MarkdownRender from '../plugins/MarkdownRender.js'
import * as Plugin from '../plugins/Plugin.js'
let state1 = $ref({})
let state2 = $ref({
  code: MarkdownRender.code,
  markdown: '## Hello! \n\n This cubev uses plugin `MarkdownRender` \n\n ```js\nconsole.log(\'Welcome to Cubev!\')\n```\n**Associated Legendre Functions** are solutions to ($l, m$ are integers)\n$$(1-x^2)y\'\' - 2xy\' + [l(l+1) - \\frac{m^2}{1-x^2}]y = 0$$'
})
</script>

<template>
  <cubev :state="state1" :plugins="[Code, Head, Plugin]"></cubev>
  <div style="height: 50px;" />
  <cubev title="Markdown" :state="state2" :plugins="[MarkdownRender, Markdown]"></cubev>
  <div style="height: 500px;" />
</template>

<style>
body {
  background: #ddd;
}
</style>
