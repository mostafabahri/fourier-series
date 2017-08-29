<template lang="pug">
  section.hero.is-dark.is-bold
    .hero-body
      .container
        h1.title {{title}}
        h2.subtitle {{subtitle}}

</template>

<script>
export default {
  name: 'hero',
  data() {
    return {
      title: 'Fourier Series',
      subtitle: 'By Mostafa Bahri',
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
