<template>
  <div :class='["tutorial-veil", { "enabled": this.tutorial }]'>
    <p>Start by typing a movie name ...</p>
  </div>
</template>

<script>
  export default {
    name: 'TutorialVeil',
    props: ['tutorial']
  }
</script>

<style>
  .tutorial-veil {
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: all 0.5s ease;
  }
  .tutorial-veil.enabled {
    z-index: 2;
    background: rgba(0, 0, 0, 0.7);
  }
  .tutorial-veil p {
    color: #fff;
    font-family: "Shadows Into Light", cursive;
    font-size: 3em;
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: 10%;
  }
</style>
