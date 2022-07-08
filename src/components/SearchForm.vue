<template>
  <h2>Search your movie</h2>
  <input v-model='search' placeholder='Type in movie name ...' />
  <button @click='searchMovie'>Search movie</button>

  <ul v-if='movieList.length > 0'>
    <li v-for='movie in movieList' :key='movie.id'>
      <img :src='`https://image.tmdb.org/t/p/w500/${movie.poster_path}`' />
      {{movie.original_title}}
    </li>
  </ul>
</template>

<script>
  import { getFunctions, httpsCallable } from 'firebase/functions';
  export default {
    data() {
      return {
        movieList: [],
        search: ''
      };
    },
    methods: {
      searchMovie() {
        const functions = getFunctions();
        const searchMovie = httpsCallable(functions, 'searchMovie');
        return searchMovie({ search: this.search }).then(response => {
          this.movieList = response.data.results.filter(movie => movie.poster_path);
        });
      }
    }
  }
</script>

<style>
  ul {
    list-style-type: none;
  }
</style>
