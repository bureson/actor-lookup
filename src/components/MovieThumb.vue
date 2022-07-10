<template>
  <li class='movie-item' @click='this.select'>
    <div class='movie-avatar' v-bind:style='{ "background-image": `url(https://image.tmdb.org/t/p/w500/${movie.poster_path})`}'></div>
    {{movie.original_title}} ({{releaseYear}})
  </li>
</template>

<script>
  export default {
    name: 'MovieThumb',
    props: ['click', 'movie'],
    computed: {
      releaseYear () {
        const date = new Date(this.movie.release_date);
        return date.getFullYear();
      }
    },
    methods: {
      select () {
        this.click(this.movie);
      }
    }
  }
</script>

<style>
  .movie-item {
    cursor: pointer;
    display: inline-block;
    vertical-align: top;
    height: 225px;
    overflow: hidden;
    width: 150px;
    margin: 10px;
  }
  .movie-avatar {
    width: 150px;
    height: 150px;
    background-size: cover;
    background-position: center;
    border-radius: 50%;
    margin-bottom: 20px;
  }
</style>
