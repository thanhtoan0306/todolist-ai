<script setup>
import TodoList from './components/TodoList.vue'
</script>

<template>
  <div id="app">
    <header>
      <div class="header-content">
        <h1>Keep</h1>
      </div>
    </header>
    <main>
      <TodoList />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', Arial, sans-serif;
  background-color: #ffffff;
  color: #202124;
}

#app {
  min-height: 100vh;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  z-index: 100;
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
  display: flex;
  align-items: center;
}

h1 {
  font-size: 22px;
  color: #5f6368;
  font-weight: 400;
}

main {
  padding-top: 80px;
  min-height: calc(100vh - 64px);
  background-color: #ffffff;
}
</style>
