<template>
  <h1 class="logo">
    <router-link :to="{ name: 'Home' }">
      birdybop
    </router-link>
  </h1>
</template>

<style lang="scss">
h1.logo {
  font-family: Helvetica;
  font-weight: normal;

  a {
    text-decoration: none;
    color: var(--text);
  }
}
</style>
