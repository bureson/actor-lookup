<template>
  <h1>Shared cast for movie selection</h1>
  <div class='input-container'>
    <input class='search-input' v-model='search' @keydown='searchMovie' placeholder='Start by typing a movie name ...' />
    <LoadingSpinner v-if='loading' />
  </div>

  <div v-bind:class='["half-width", { "single": movieList.length === 0 }]'>
    <div v-if='suggestMovieList.length > 0'>
      <h2>Choose from the search results</h2>
      <ul>
        <MovieThumb v-for='movie in suggestMovieList' :key='movie.id' :movie='movie' :click='selectMovie' />
      </ul>
    </div>
  </div>

  <div class='half-width'>
    <div v-if='movieList.length > 0'>
      <h2>For selected movies</h2>
      <ul>
        <MovieThumb v-for='movie in movieList' :key='movie.id' :movie='movie' :click='deselectMovie' />
      </ul>
    </div>

    <div v-if='movieList.length > 1'>
      <h2>Shared cast</h2>
      <p v-if='sharedCast.length === 0'>No shared cast :(</p>
      <ul v-if='sharedCast.length > 0'>
        <CastThumb v-for:='cast in sharedCast' :key='cast.id' :cast='cast' />
      </ul>
    </div>
  </div>
</template>

<script>
  import invokeFunction from '../helper/invokeFunction';

  import CastThumb from './CastThumb.vue';
  import LoadingSpinner from './LoadingSpinner.vue';
  import MovieThumb from './MovieThumb.vue'

  export default {
    components: {
      CastThumb,
      LoadingSpinner,
      MovieThumb
    },
    computed: {
      sharedCast () {
        if (this.movieList.length <= 1) return [];
        return this.movieList.reduce((sharedCast, movie, index) => {
          if (index === 0) return movie.cast;
          return sharedCast.filter(sharedCastMember => movie.cast.some(movieCastMember => movieCastMember.id === sharedCastMember.id));
        }, []);
      }
    },
    data() {
      return {
        loading: false,
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
            this.loading = true;
            return invokeFunction('searchMovie', { search: this.search }).then(response => {
              this.suggestMovieList = response.data.results.filter(movie => movie.poster_path);
              this.loading = false;
            });
          } else {
            this.suggestMovieList = [];
          }
        }, 500);
      },
      selectMovie (movie) {
        if (this.movieList.some(mov => mov.id === movie.id)) return;
        this.loading = true;
        return invokeFunction('getCastForMovieId', { movieId: movie.id }).then(response => {
          this.loading = false;
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
  .input-container {
    position: relative;
    width: 50%;
    margin: 0 auto;
  }
  .search-input {
    width: 100%;
    box-sizing: border-box;
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
</style>
