<template>
  <li :class='["cast-member", { "clickable": this.click }]' @click='this.select'>
    <div class='cast-avatar' :style='{ backgroundImage: `url(https://image.tmdb.org/t/p/w200/${cast.profile_path})`}' />
    {{cast.name}}
  </li>
</template>

<script>
  export default {
    name: 'CastThumb',
    props: ['cast', 'click'],
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
    margin: 0 10px 10px;
  }
  .cast-member.clickable {
    cursor: pointer;
  }
  .cast-avatar {
    width: 75px;
    height: 75px;
    background-color: #999;
    background-size: cover;
    background-position: center;
    margin-bottom: 10px;
    border-radius: 50%;
  }
</style>
