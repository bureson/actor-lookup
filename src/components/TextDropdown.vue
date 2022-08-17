<template>
  <span class='text-drop-down' @click='openMenu' @mouseout='closeMenu' @mouseover='persistMenu'>
    <span>{{value}}</span>
    <ul v-if='open'>
      <li v-for='option in optionList' :key='option' @click='() => this.click(option)'>{{option}}</li>
    </ul>
  </span>
</template>

<script>
  export default {
    name: 'TextDropdown',
    props: ['click', 'value', 'optionList'],
    data () {
      return {
        open: false,
        closeTimeout: null
      };
    },
    methods: {
      closeMenu () {
        this.closeTimeout = setTimeout(() => {
          this.open = false;
        }, 100);
      },
      persistMenu () {
        if (this.closeTimeout) clearTimeout(this.closeTimeout);
        this.open = true;
      },
      selectOption (option) {
        this.open = false;
        this.click(option);
      },
      openMenu () {
        this.open = true;
      }
    }
  }
</script>

<style>
  .text-drop-down {
    position: relative;
  }
  .text-drop-down span {
    text-decoration: underline;
    text-decoration-style: dotted;
    cursor: pointer;
  }
  .text-drop-down ul {
    display: block;
    position: absolute;
    left: 0;
    background: #fff;
    top: 20px;
  }
  .dark .text-drop-down ul {
    background: #333;
  }
  .text-drop-down ul li {
    padding: 2px 5px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
  }
</style>
