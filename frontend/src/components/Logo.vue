<template>
  <h1 class="logo">
    <router-link :to="{ name: 'Home' }">
      birdybop
    </router-link>
  </h1>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: "Logo",
});
</script>

<style lang="scss">
h1.logo {
  font-family: Helvetica;

  a {
    text-decoration: none;
    color: inherit;
  }
}
</style>
