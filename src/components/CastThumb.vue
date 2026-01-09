<template>
  <li :class='["cast-member", { "clickable": this.click, "search-result": this.searchResult }]' @click='this.select'>
    <div class='cast-avatar' :style='{ backgroundImage: `url(https://image.tmdb.org/t/p/w200/${cast.profile_path})`}' />
    <div class='cast-title'>{{cast.name}}</div>
  </li>
</template>

<script>
  export default {
    name: 'CastThumb',
    props: {
      click: {
        type: Function,
        required: true
      },
      cast: {
        type: Object,
        required: true
      },
      searchResult: {
        type: Boolean,
        required: false
      }
    },
    methods: {
      select() {
        if (this.click) this.click(this.cast);
      }
    }
  }
</script>

<style>
  .cast-member {
    display: inline-block;
    width: 75px;
    height: 140px;
    vertical-align: top;
    overflow: hidden;
    padding: 10px;
  }
  .cast-member.search-result {
    height: 50px;
    width: calc(100% - 20px);
    display: block;
    text-align: left;
  }
  .cast-member.search-result:hover {
    background: #eee;
  }
  .cast-member.clickable {
    cursor: pointer;
  }
  .cast-member .cast-avatar {
    width: 75px;
    height: 75px;
    background-color: #999;
    background-size: cover;
    background-position: center;
    margin-bottom: 10px;
    border-radius: 50%;
  }
  .cast-member.search-result .cast-avatar {
    color: #fff;
    display: inline-block;
    margin-bottom: 20px;
    width: 50px;
    height: 50px;
    line-height: 150px;
  }
  .cast-member.search-result .cast-title {
    display: inline-block;
    vertical-align: top;
    color: #000;
    height: 50px;
    margin: 0 0 0 10px;
    line-height: 50px;
  }
</style>
