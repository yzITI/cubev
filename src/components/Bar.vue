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
    <div>TAB2</div>
  </div>
</template>

<style scoped>
.bar {
  display: flex;
  height: 48px;
  width: 100%;
  overflow-x: auto;
  align-items: flex-end;
  border-bottom: 1px solid #ccc;
}

.bar div {
  text-align: center;
  font-size: 0.8rem;
  line-height: 32px;
  height: 32px;
  padding: 0 10px;
  font-family: Arial, Helvetica, sans-serif;
  transition: all 0.3s ease;
}

.bar div:hover {
  cursor: pointer;
  background-color: rgb(79,192,141, 0.5);
}

</style>
