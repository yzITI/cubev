<script setup>
</script>

<template>
  <div class="bar">
    <div><img src="../assets/logo.svg" height="32" style="padding-top: 6px;"/></div>
    <div>Tab1</div>
    <div>Tab2</div>
    <div>Tab3</div>
  </div>
</template>

<style scoped>
.bar {
  overflow: hidden;
  display: flex;
  height: 42px;
  align-items: center;
  border: #2D4037 1px solid;
}

.bar div {
  text-align: center;
  line-height: 42px;
  width: 72px;
  height: 100%;
  border: #2D4037 1px solid;
}

.bar :hover {
  cursor: pointer;
}

</style>
