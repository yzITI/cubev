<script setup>
</script>

<template>
  <div class="bar">
    <div>
      <img src="../assets/logo.svg" height="32"/>
    </div>
    <div>TAB1mhhh</div>
    <div>TAB2</div>
    <div>TAB3</div>
  </div>
</template>

<style scoped>
.bar {
  overflow: hidden;
  display: flex;
  height: 32px;
  align-items: center;
}

.bar div {
  text-align: center;
  overflow: hidden;
  font-size: 0.8rem;
  line-height: 32px;
  padding: 0 10px;
  height: 100%;
  font-family: Arial, Helvetica, sans-serif;
}

.bar div:hover {
  cursor: pointer;
  background-color: rgb(79,192,141, 0.5);
}

</style>
