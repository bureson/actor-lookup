<template>
  <div :class='["container", { "tutorial": this.tutorial, "init": this.init }]' @click='resetTutorialTimeout' @keydown='resetTutorialTimeout'>
    <h1 @click="swap">
      SEARCH
      <Transition name="swap" mode="out-in">
        <span :key="selectedTab" class="word">{{ selectedTab.toUpperCase() }}</span>
      </Transition>
      TO SEE THEIR SHARED
      <Transition name="swap" mode="out-in">
        <span :key="theOtherTab" class="word">{{ theOtherTab.toUpperCase() }}</span>
      </Transition>
    </h1>

    <TutorialVeil :tutorial='tutorial' />

    <div class='search-dropdown' ref="dropdownRef">
      <div class='input-container'>
        <input class='search-input' v-model='search' @keydown='triggerSearch' @focus="isOpen = true" :placeholder='placeholder' autofocus />
        <LoadingSpinner v-if='loading' />
        <img v-if='!loading && search' src='../assets/close.png' @click='clearSearch' />
      </div>

      <div v-show="isOpen && (suggestMovieList.length || suggestCastList.length)" class='dropdown'>
        <div class="dropdown-scroll">
          <div v-if="suggestMovieList.length">
            <ul>
              <MovieThumb
                v-for="movie in suggestMovieList"
                :key="movie.id"
                :movie="movie"
                :searchResult="true"
                :click="selectMovie"
              />
            </ul>
          </div>

          <div v-if="suggestCastList.length">
            <ul>
              <CastThumb
                v-for="cast in suggestCastList"
                :key="cast.id"
                :cast="cast"
                :searchResult="true"
                :click="selectCast"
              />
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class='overview'>
      <div v-if='movieList.length > 0'>
        <ul>
          <MovieThumb v-for='movie in movieList' :key='movie.id' :movie='movie' :click='deselectMovie' />
        </ul>
        <div v-if='movieList.length === 1'>
          <p>{{movieList[0].overview}}</p>
        </div>
      </div>

      <div v-if='castList.length > 0'>
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

  import CastThumb from './CastThumb.vue';
  import LoadingSpinner from './LoadingSpinner.vue';
  import MovieThumb from './MovieThumb.vue';
  import TextDropdown from './TextDropdown.vue';
  import TutorialVeil from './TutorialVeil.vue';

  export default {
    components: {
      CastThumb,
      LoadingSpinner,
      MovieThumb,
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
      },
      theOtherTab () {
        return this.tabList.find(tab => tab !== this.selectedTab);
      }
    },
    data() {
      const movieSortDirectionList = ['descending', 'ascending'];
      const movieSortList = ['relevance', 'year', 'name'];
      const tabList = ['movies', 'actors'];
      return {
        loading: false,
        castList: [],
        init: true,
        isOpen: false,
        movieList: [],
        movieSortDirection: movieSortDirectionList[0],
        movieSortDirectionList,
        movieSort: movieSortList[0],
        movieSortList,
        search: '',
        searchTimeout: null,
        selectedTab: tabList[0],
        suggestCastList: [],
        suggestMovieList: [],
        tabList,
        tutorial: false,
        tutorialTimeout: null
      };
    },
    mounted() {
      document.addEventListener('click', this.handleClickOutside);
      this.tutorialTimeout = setTimeout(() => {
        this.tutorial = true;
      }, 4000);
    },
    beforeUnmount() {
      document.removeEventListener('click', this.handleClickOutside);
    },
    updated () {
      // any logging comes here
    },
    methods: {
      clearSearch () {
        this.search = '';
        this.suggestCastList = [];
        this.suggestMovieList = [];
      },
      deselectCast (cast) {
        this.castList = this.castList.filter(item => item.id !== cast.id);
      },
      deselectMovie (movie) {
        this.movieList = this.movieList.filter(item => item.id !== movie.id);
      },
      handleClickOutside (e) {
        if (!this.$refs.dropdownRef?.contains(e.target)) {
          this.isOpen = false
        }
      },
      movieSortSelect (option) {
        this.movieSort = option;
      },
      movieSortDirectionSelect (option) {
        this.movieSortDirection = option;
      },
      resetSearch () {
        this.isOpen = false;
        this.search = '';
        this.init = false;
        this.suggestCastList = [];
        this.suggestMovieList = [];
      },
      resetTutorialTimeout () {
        this.tutorial = false;
        if (this.tutorialTimeout) clearTimeout(this.tutorialTimeout);
        this.tutorialTimeout = null;
      },
      triggerSearch () {
        this.tutorial = false;
        this.isOpen = true;
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout);
          this.searchTimeout = null;
        }
        const functionName = this.selectedTab === 'movies' ? 'searchMovie' : 'searchCast';
        this.searchTimeout = setTimeout(() => {
          if (this.search.trim()) {
            this.loading = true;
            return invokeFunction(functionName, { search: this.search }).then(response => {
              this.loading = false;
              if (this.selectedTab === 'movies') {
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
          this.resetSearch();
          if (this.selectedTab === 'movies') this.selectTab('actors');
          this.castList.push({ ...cast, cast: response.data.cast });
        });
      },
      selectMovie (movie) {
        if (this.movieList.some(item => item.id === movie.id)) return;
        this.loading = true;
        return invokeFunction('getCastForMovieId', { movieId: movie.id }).then(response => {
          this.loading = false;
          this.resetSearch();
          if (this.selectedTab === 'actors') this.selectTab('movies');
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
      },
      swap () {
        this.selectTab(this.theOtherTab);
      }
    }
  }
</script>

<style>
  .container {
    max-width: 960px;
    min-height: 100%;
    margin: 0 auto;
    transition: all 1s ease;
  }
  .input-container {
    z-index: 3;
    position: relative;
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
  .flip-list-move {
    transition: transform 1s;
  }
  .search-dropdown {
    position: relative;
    width: 90%;
    margin: 0 auto;
  }
  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;

    background: white;
    border: 1px solid #ddd;
    border-radius: 20px;
    z-index: 10;

    overflow: hidden;
  }
  .dropdown-scroll {
    max-height: 400px;
    overflow-y: auto;
  }
  .dropdown ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .overview {
    margin-top: 20px;
  }
  .word {
    display: inline-block;
    margin: 0 0.2em;
  }
  .swap-enter-active,
  .swap-leave-active {
    transition: all 0.4s ease;
    position: relative;
    display: inline-block;
  }
  .swap-enter-from {
    opacity: 0;
    transform: translateY(-0.5em);
  }
  .swap-enter-to {
    opacity: 1;
    transform: translateY(0);
  }
  .swap-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
  .swap-leave-to {
    opacity: 0;
    transform: translateY(0.5em);
  }
  @media (min-width: 768px) {
    .container.init {
      padding-top: 30vh;
    }
  }
</style>
