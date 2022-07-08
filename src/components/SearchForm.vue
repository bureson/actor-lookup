<template>
  <input v-model='search' placeholder='What is your name' />
  <button @click='callHelloWorld'>Click me</button>
  <p>{{greeting}}</p>
</template>

<script>
  import { getFunctions, httpsCallable } from 'firebase/functions';
  export default {
    data() {
      return {
        greeting: '',
        search: ''
      };
    },
    methods: {
      callHelloWorld() {
        const functions = getFunctions();
        const testWorld = httpsCallable(functions, 'testWorld');
        return testWorld({ name: this.search }).then(response => {
          this.greeting = response.data.message;
        });
      }
    }
  }
</script>

<style>
</style>
