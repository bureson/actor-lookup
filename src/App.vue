<template>
  <SearchForm />
</template>

<script>
  import SearchForm from './components/SearchForm.vue';

  export default {
    name: 'App',
    components: {
      SearchForm
    }
  }
</script>

<style>
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
  }
  .dark h1,
  .dark h2,
  .dark h3,
  .dark p,
  .dark li {
    color: #fff;
  }
</style>
