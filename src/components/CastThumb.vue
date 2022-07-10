<template>
  <li class='cast-member'>
    <div class='cast-avatar' v-bind:style='{ "background-image": `url(https://image.tmdb.org/t/p/w200/${cast.profile_path})`}'></div>
    {{cast.original_name}}
  </li>
</template>

<script>
  export default {
    name: 'CastThumb',
    props: ['cast']
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
