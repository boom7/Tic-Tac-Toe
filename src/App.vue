<template>
  <div id="app">
    <tic-tac-toe />
  </div>
</template>

<script>
import TicTacToe from './TicTacToe.vue';
export default {
  components: { TicTacToe },
  name: "app",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
    };
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
