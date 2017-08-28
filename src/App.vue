<template>
  <div id="app">
  <hero></hero>
  <my-component></my-component>
  </div>
</template>

<script>
  import MyComponent from './components/MyComponent';
  import Hero from './components/Hero';

  export default {
    name: 'app',
    components: {
      Hero,
      MyComponent
    },
  };
</script>

<style>
</style>
