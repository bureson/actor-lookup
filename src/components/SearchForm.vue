<template>
  <h1>Shared cast for movie selection</h1>
  <input class='search-input' v-model='search' @keydown='searchMovie' placeholder='Start by typing a movie name ...' />

  <div v-bind:class='["half-width", { "single": movieList.length === 0 }]'>
    <div v-if='suggestMovieList.length > 0'>
      <h2>Choose from the search results</h2>
      <ul>
        <li class='movie-item' v-for='movie in suggestMovieList' :key='movie.id' @click='selectMovie(movie)'>
          <div class='movie-avatar' v-bind:style='{ "background-image": `url(https://image.tmdb.org/t/p/w500/${movie.poster_path})`}'></div>
          {{movie.original_title}}
        </li>
      </ul>
    </div>
  </div>

  <div class='half-width'>
    <div v-if='movieList.length > 0'>
      <h2>For selected movies</h2>
      <ul>
        <li class='movie-item' v-for='movie in movieList' :key='movie.id' @click='deselectMovie(movie)'>
          <div class='movie-avatar' v-bind:style='{ "background-image": `url(https://image.tmdb.org/t/p/w500/${movie.poster_path})`}'></div>
          {{movie.original_title}}
        </li>
      </ul>
    </div>

    <div v-if='movieList.length > 1'>
      <h2>Shared cast</h2>
      <p v-if='sharedCast.length === 0'>No shared cast :(</p>
      <ul v-if='sharedCast.length > 0'>
        <li class='cast-member' v-for='cast in sharedCast' :key='cast.id'>
          <div class='cast-avatar' v-bind:style='{ "background-image": `url(https://image.tmdb.org/t/p/w200/${cast.profile_path})`}'></div>
          {{cast.original_name}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { getFunctions, httpsCallable } from 'firebase/functions';

  export default {
    computed: {
      sharedCast () {
        if (this.movieList.length <= 1) return [];
        const sharedCast = this.movieList.reduce((sharedCast, movie, index) => {
          if (index === 0) return movie.cast;
          return sharedCast.filter(sharedCastMember => movie.cast.some(movieCastMember => movieCastMember.id === sharedCastMember.id));
        }, []);
        return sharedCast;
      }
    },
    data() {
      return {
        movieList: [],
        search: '',
        suggestMovieList: [],
        timeout: null
      };
    },
    methods: {
      deselectMovie (movie) {
        this.movieList = this.movieList.filter(mov => mov.id !== movie.id);
      },
      searchMovie () {
        if (this.timeout) {
          clearTimeout(this.timeout);
          this.timeout = null;
        }
        this.timeout = setTimeout(() => {
          if (this.search.trim()) {
            const functions = getFunctions();
            const searchMovie = httpsCallable(functions, 'searchMovie');
            return searchMovie({ search: this.search }).then(response => {
              this.suggestMovieList = response.data.results.filter(movie => movie.poster_path);
            });
          } else {
            this.suggestMovieList = [];
          }
        }, 500);
      },
      selectMovie (movie) {
        const functions = getFunctions();
        const getCastForMovieId = httpsCallable(functions, 'getCastForMovieId');
        return getCastForMovieId({ movieId: movie.id }).then(response => {
          this.movieList.push({ ...movie, cast: response.data.cast });
        });
      }
    }
  }
</script>

<style>
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  .search-input {
    width: 50%;
    padding: 10px 20px;
    border-radius: 20px;
  }
  .half-width {
    display: inline-block;
    vertical-align: top;
    min-height: 20px;
    width: 45%;
    margin: 0 2.5%;
  }
  .half-width.single {
    width: 95%;
  }
  .movie-item {
    cursor: pointer;
    display: inline-block;
    vertical-align: top;
    height: 220px;
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
  .cast-member {
    display: inline-block;
    width: 75px;
    height: 140px;
    vertical-align: top;
    overflow: hidden;
    margin: 0 10px 10px;
  }
  .cast-avatar {
    width: 75px;
    height: 75px;
    background-size: cover;
    background-position: center;
    margin-bottom: 10px;
    border-radius: 50%;
  }
</style>
