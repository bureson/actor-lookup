<template>
  <div :class='["container", { "tutorial": this.tutorial }]' @click='resetTutorialTimeout' @keydown='resetTutorialTimeout'>
    <h1>ACTOR &amp; MOVIE LOOKUP</h1>

    <TutorialVeil :tutorial='tutorial' />
    <TabSwitch :selectedTab='selectedTab' :click='selectTab' />

    <div class='input-container'>
      <input class='search-input' v-model='search' @keydown='triggerSearch' :placeholder='placeholder' />
      <LoadingSpinner v-if='loading' />
    </div>

    <div :class='["half-width", { "single": movieList.length === 0 && castList.length === 0 }]'>
      <div v-if='suggestMovieList.length > 0'>
        <h2>Choose from the search results</h2>
        <ul>
          <MovieThumb v-for='movie in suggestMovieList' :key='movie.id' :movie='movie' :click='selectMovie' />
        </ul>
      </div>

      <div v-if='suggestCastList.length > 0'>
        <h2>Choose from the search results</h2>
        <ul>
          <CastThumb v-for='cast in suggestCastList' :key='cast.id' :cast='cast' :click='selectCast' />
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

      <div v-if='castList.length > 0'>
        <h2>For selected cast</h2>
        <ul>
          <CastThumb v-for='cast in castList' :key='cast.id' :cast='cast' :click='deselectCast' />
        </ul>
      </div>

      <div v-if='movieList.length > 1'>
        <h2>Shared cast</h2>
        <p v-if='sharedCast.length === 0'>No shared cast :(</p>
        <ul v-if='sharedCast.length > 0'>
          <CastThumb v-for='cast in sharedCast' :key='cast.id' :cast='cast' />
        </ul>
      </div>

      <div v-if='castList.length > 1'>
        <h2>Shared movie</h2>
        <p v-if='sharedMovie.length === 0'>No shared movie :(</p>
        <ul v-if='sharedMovie.length > 0'>
          <MovieThumb v-for='movie in sharedMovie' :key='movie.id' :movie='movie' />
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import invokeFunction from '../helper/invokeFunction';
  import TextLib from '../helper/textLib';

  import CastThumb from './CastThumb.vue';
  import LoadingSpinner from './LoadingSpinner.vue';
  import MovieThumb from './MovieThumb.vue';
  import TabSwitch from './TabSwitch.vue';
  import TutorialVeil from './TutorialVeil.vue';

  export default {
    components: {
      CastThumb,
      LoadingSpinner,
      MovieThumb,
      TabSwitch,
      TutorialVeil
    },
    computed: {
      placeholder () {
        return `Start by typing a ${this.selectedTab} name ...`;
      },
      sharedCast () {
        if (this.movieList.length <= 1) return [];
        return this.movieList.reduce((sharedCast, movie, index) => {
          if (index === 0) return movie.cast;
          return sharedCast.filter(sharedCastMember => sharedCastMember.profile_path && movie.cast.some(movieCastMember => movieCastMember.id === sharedCastMember.id));
        }, []);
      },
      sharedMovie () {
        if (this.castList.length <= 1) return [];
        return this.castList.reduce((sharedMovie, cast, index) => {
          if (index === 0) return cast.cast;
          return sharedMovie.filter(sharedCastMovie => sharedCastMovie.poster_path && cast.cast.some(castCastMovie => castCastMovie.id === sharedCastMovie.id));
        }, []);
      }
    },
    data() {
      return {
        loading: false,
        castList: [],
        movieList: [],
        search: '',
        searchTimeout: null,
        selectedTab: 'movie',
        suggestCastList: [],
        suggestMovieList: [],
        tutorial: false,
        tutorialTimeout: null
      };
    },
    mounted() {
      this.tutorialTimeout = setTimeout(() => {
        this.tutorial = true;
      }, 4000);
    },
    methods: {
      deselectCast (cast) {
        this.castList = this.castList.filter(item => item.id !== cast.id);
      },
      deselectMovie (movie) {
        this.movieList = this.movieList.filter(item => item.id !== movie.id);
      },
      resetTutorialTimeout () {
        this.tutorial = false;
        if (this.tutorialTimeout) clearTimeout(this.tutorialTimeout);
        this.tutorialTimeout = null;
      },
      triggerSearch () {
        this.tutorial = false;
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout);
          this.searchTimeout = null;
        }
        this.searchTimeout = setTimeout(() => {
          if (this.search.trim()) {
            this.loading = true;
            return invokeFunction(`search${TextLib.capitalize(this.selectedTab)}`, { search: this.search }).then(response => {
              this.loading = false;
              if (this.selectedTab === 'movie') {
                this.suggestMovieList = response.data.results.filter(movie => movie.poster_path);
              } else {
                this.suggestCastList = response.data.results.filter(cast => cast.profile_path);
              }
            });
          } else {
            this.suggestMovieList = [];
          }
        }, 500);
      },
      selectCast (cast) {
        if (this.castList.some(item => item.id === cast.id)) return;
        this.loading = true;
        return invokeFunction('getMovieForPersonId', { personId: cast.id }).then(response => {
          this.loading = false;
          this.castList.push({ ...cast, cast: response.data.cast });
        });
      },
      selectMovie (movie) {
        if (this.movieList.some(item => item.id === movie.id)) return;
        this.loading = true;
        return invokeFunction('getCastForMovieId', { movieId: movie.id }).then(response => {
          this.loading = false;
          this.movieList.push({ ...movie, cast: response.data.cast });
        });
      },
      selectTab (tab) {
        this.castList = [];
        this.movieList = [];
        this.search = '';
        this.selectedTab = tab;
        this.suggestCastList = [];
        this.suggestMovieList = [];
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
    z-index: 3;
    position: relative;
    width: 70%;
    margin: 0 auto;
  }
  .search-input {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 20px;
    border-radius: 20px;
  }
  .tutorial .input-container .search-input {
    border: 2px solid #000;
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
  @media (min-width:600px)  {
    .input-container {
      width: 40%;
    }
  }
</style>
