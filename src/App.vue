<template>
  <div :class='["vue-app", { "dark": this.darkMode }]'>
    <div class='dark-mode-switch'>
      <a href='#' v-if='darkMode' @click='toggleDarkMode'>☀️</a>
      <a href='#' v-else @click='toggleDarkMode'>🌙</a>
    </div>
    <SearchForm />
  </div>
</template>

<script>
  import SearchForm from './components/SearchForm.vue';

  export default {
    name: 'App',
    components: {
      SearchForm
    },
    data() {
      const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return {
        darkMode
      };
    },
    methods: {
      toggleDarkMode () {
        this.darkMode = !this.darkMode;
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap');

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
  }
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  h1 {
    margin: 0;
    padding: 1em;
    font-family: "Shadows Into Light", cursive;
    font-weight: 700;
    font-style: normal;
  }
  h1 span {
    color: #f00;
    cursor: pointer;
  }
  .dark h1,
  .dark h2,
  .dark h3,
  .dark p,
  .dark li {
    color: #fff;
  }
  .vue-app {
    background: #fff;
    transition: background 1s;
    min-height: 100%;
  }
  .vue-app.dark {
    background: #333;
  }
  .dark-mode-switch {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 2em;
  }
  .dark-mode-switch a {
    text-decoration: none;
  }
</style>
