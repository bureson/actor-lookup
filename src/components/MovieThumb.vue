<template>
  <li :class='["movie-item", { "clickable": this.click }]' @click='this.select'>
    <div class='movie-avatar' :style='{ backgroundImage: `url(https://image.tmdb.org/t/p/w500/${movie.poster_path})`}' />
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
        if (this.click) this.click(this.movie);
      }
    }
  }
</script>

<style>
  .movie-item {
    display: inline-block;
    vertical-align: top;
    height: 225px;
    overflow: hidden;
    width: 150px;
    margin: 10px;
  }
  .movie-item.clickable {
    cursor: pointer;
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
