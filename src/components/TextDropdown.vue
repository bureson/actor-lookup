<template>
  <span class='text-drop-down' @mouseout='closeMenu' @mouseover='persistMenu'>
    <span @click='toggleMenu'>{{value}}</span>
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
        timeout: null
      };
    },
    methods: {
      closeMenu () {
        this.timeout = setTimeout(() => {
          this.open = false;
        }, 100);
      },
      persistMenu () {
        if (this.timeout) clearTimeout(this.timeout);
        this.open = true;
      },
      selectOption (option) {
        this.open = false;
        this.click(option);
      },
      toggleMenu () {
        this.open = !this.open;
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
  .text-drop-down ul li {
    padding: 2px 5px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
  }
</style>
