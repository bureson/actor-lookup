<template>
  <li :class='["movie-item", { "clickable": this.click, "search-result": this.searchResult }]' @click='this.select'>
    <div class='movie-avatar' :style='{ backgroundImage: `url(https://image.tmdb.org/t/p/w500/${movie.poster_path})`}'>
      <span v-if='missingPoster'>{{initialLetter}}</span>
    </div>
    <div class="movie-title">
      {{movie.original_title}} ({{releaseYear}})
    </div>
  </li>
</template>

<script>
  export default {
    name: 'MovieThumb',
    props: {
      click: {
        type: Function,
        required: true
      },
      movie: {
        type: Object,
        required: true
      },
      searchResult: {
        type: Boolean,
        required: false
      }
    },
    computed: {
      initialLetter () {
        console.log(this.listed);
        return this.movie.original_title.split('')[0].toUpperCase();
      },
      missingPoster () {
        return !this.movie.poster_path;
      },
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
    vertical-align: top;
    overflow: hidden;
    height: 225px;
    width: 150px;
    padding: 10px;
    display: inline-block;
  }
  .movie-item.search-result {
    height: 50px;
    width: calc(100% - 20px);
    display: block;
    text-align: left;
  }
  .movie-item.search-result:hover {
    background: #eee;
  }
  .movie-item.clickable {
    cursor: pointer;
  }
  .movie-item .movie-avatar {
    width: 150px;
    height: 150px;
    line-height: 150px;
    font-size: 90px;
    font-weight: 500;
    background-color: #999;
    background-size: cover;
    background-position: center;
    border-radius: 50%;
  }
  .movie-item .movie-title {
    margin: 20px 0 0;
  }
  .movie-item.search-result .movie-avatar {
    color: #fff;
    display: inline-block;
    margin-bottom: 20px;
    width: 50px;
    height: 50px;
    line-height: 150px;
  }
  .movie-item.search-result .movie-title {
    display: inline-block;
    vertical-align: top;
    color: #000;
    height: 50px;
    margin: 0 0 0 10px;
    line-height: 50px;
  }
</style>
