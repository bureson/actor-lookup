<template>
  <div :class='["container", { "tutorial": this.tutorial, "dark": this.darkMode }]' @click='resetTutorialTimeout' @keydown='resetTutorialTimeout'>
    <h1>ACTOR &amp; MOVIE LOOKUP</h1>

    <TutorialVeil :tutorial='tutorial' />
    <TabSwitch :selectedTab='selectedTab' :click='selectTab' />

    <div class='dark-mode-switch'>
      <a href='#' v-if='darkMode' @click='toggleDarkMode'>☀️</a>
      <a href='#' v-else @click='toggleDarkMode'>🌙</a>
    </div>

    <div class='input-container'>
      <input class='search-input' v-model='search' @keydown='triggerSearch' :placeholder='placeholder' autofocus />
      <LoadingSpinner v-if='loading' />
      <img v-if='!loading && search' src='../assets/close.png' @click='clearSearch' />
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

    <div :class='["half-width", { "single": suggestMovieList.length === 0 && suggestCastList.length === 0 }]'>
      <div v-if='movieList.length > 0'>
        <h2>Selected movies</h2>
        <ul>
          <MovieThumb v-for='movie in movieList' :key='movie.id' :movie='movie' :click='deselectMovie' />
        </ul>
        <div v-if='movieList.length === 1'>
          <p>{{movieList[0].overview}}</p>
        </div>
      </div>

      <div v-if='castList.length > 0'>
        <h2>Selected cast</h2>
        <ul>
          <CastThumb v-for='cast in castList' :key='cast.id' :cast='cast' :click='deselectCast' />
        </ul>
      </div>

      <div v-if='movieList.length > 0'>
        <h2 v-if='movieList.length > 1'>Share cast</h2>
        <h2 v-else>Cast</h2>

        <p v-if='sharedCast.length === 0'>No shared cast :(</p>
        <ul v-if='sharedCast.length > 0'>
          <CastThumb v-for='cast in sharedCast' :key='cast.id' :cast='cast' :click='selectCast' />
        </ul>
      </div>

      <div v-if='castList.length > 0'>
        <h2 v-if='castList.length > 1'>Share movies</h2>
        <h2 v-else>Casted in movies</h2>
        <p>Sorted by <TextDropdown :value='movieSort' :optionList='movieSortList' :click='movieSortSelect' /> in <TextDropdown :value='movieSortDirection' :optionList='movieSortDirectionList' :click='movieSortDirectionSelect' /> order</p>

        <p v-if='sharedMovie.length === 0'>No shared movie :(</p>
        <transition-group name='flip-list' tag='ul' v-if='sharedMovie.length > 0'>
          <MovieThumb v-for='movie in sharedMovie' :key='movie.id' :movie='movie' :click='selectMovie' />
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
  import * as R from 'ramda';

  import invokeFunction from '../helper/invokeFunction';
  import TextLib from '../helper/textLib';

  import CastThumb from './CastThumb.vue';
  import LoadingSpinner from './LoadingSpinner.vue';
  import MovieThumb from './MovieThumb.vue';
  import TabSwitch from './TabSwitch.vue';
  import TextDropdown from './TextDropdown.vue';
  import TutorialVeil from './TutorialVeil.vue';

  export default {
    components: {
      CastThumb,
      LoadingSpinner,
      MovieThumb,
      TabSwitch,
      TextDropdown,
      TutorialVeil
    },
    computed: {
      placeholder () {
        return `Start by typing a ${this.selectedTab} name ...`;
      },
      sharedCast () {
        if (this.movieList.length === 0) return [];
        if (this.movieList.length === 1) return this.movieList[0].cast;
        return this.movieList.reduce((sharedCast, movie, index) => {
          if (index === 0) return movie.cast;
          return sharedCast.filter(sharedCastMember => sharedCastMember.profile_path && movie.cast.some(movieCastMember => movieCastMember.id === sharedCastMember.id));
        }, []);
      },
      sharedMovie () {
        const getSharedMovieList = () => {
          if (this.castList.length === 0) return [];
          if (this.castList.length === 1) return this.castList[0].cast;
          return this.castList.reduce((sharedMovie, cast, index) => {
            if (index === 0) return cast.cast;
            return sharedMovie.filter(sharedCastMovie => sharedCastMovie.poster_path && cast.cast.some(castCastMovie => castCastMovie.id === sharedCastMovie.id));
          }, []);
        };
        const getSortProp = () => {
          switch (this.movieSort) {
            case 'year':
              return 'release_date';
            case 'name':
              return 'title';
            default: // Note: relevance
              return null;
          }
        }
        const sortProp = getSortProp();
        const sharedMovieList = getSharedMovieList();
        const isDescProp = this.movieSortDirection === 'descending';
        const isDesc = this.movieSort === 'relevance' ? !isDescProp : isDescProp;
        const sortedMovieList = sortProp ? R.sortBy(R.prop(sortProp), sharedMovieList) : sharedMovieList;
        const directionSortedMovieList = isDesc ? R.reverse(sortedMovieList) : sortedMovieList;
        return directionSortedMovieList;
      }
    },
    data() {
      const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const movieSortDirectionList = ['descending', 'ascending'];
      const movieSortList = ['relevance', 'year', 'name'];
      return {
        loading: false,
        castList: [],
        darkMode,
        movieList: [],
        movieSortDirection: movieSortDirectionList[0],
        movieSortDirectionList,
        movieSort: movieSortList[0],
        movieSortList,
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
    updated () {
      // any logging comes here
    },
    methods: {
      clearSearch () {
        this.search = '';
      },
      deselectCast (cast) {
        this.castList = this.castList.filter(item => item.id !== cast.id);
      },
      deselectMovie (movie) {
        this.movieList = this.movieList.filter(item => item.id !== movie.id);
      },
      movieSortSelect (option) {
        this.movieSort = option;
      },
      movieSortDirectionSelect (option) {
        this.movieSortDirection = option;
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
          if (this.selectedTab === 'movie') this.selectTab('cast');
          this.castList.push({ ...cast, cast: response.data.cast });
        });
      },
      selectMovie (movie) {
        if (this.movieList.some(item => item.id === movie.id)) return;
        this.loading = true;
        return invokeFunction('getCastForMovieId', { movieId: movie.id }).then(response => {
          this.loading = false;
          if (this.selectedTab === 'cast') this.selectTab('movie');
          this.movieList.push({ ...movie, cast: response.data.cast });
        });
      },
      selectTab (tab) {
        if (this.selectedTab !== tab) {
          this.castList = [];
          this.movieList = [];
          this.search = '';
          this.selectedTab = tab;
          this.suggestCastList = [];
          this.suggestMovieList = [];
        }
      },
      toggleDarkMode () {
        this.darkMode = !this.darkMode;
      }
    }
  }
</script>

<style>
  .container {
    background: #fff;
    width: 100%;
    min-height: 100%;
    transition: background 1s;
  }
  .container.dark {
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
  .input-container {
    z-index: 3;
    position: relative;
    width: 70%;
    margin: 0 auto;
  }
  .input-container img {
    position: absolute;
    right: 15px;
    top: 10px;
    width: 20px;
    height: 20px;
    cursor: pointer;
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
  .flip-list-move {
    transition: transform 1s;
  }
  @media (min-width:600px)  {
    .input-container {
      width: 40%;
    }
  }
</style>
