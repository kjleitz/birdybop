<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { catchHttpCode } from "@/lib/error-filters";
import store from "@/store";
import Vue from "vue";

export default Vue.extend({
  name: "App",

  created(): void {
    store.dispatch("refreshSession").then(() => {
      console.log("Authenticated visitor.");
      const { intendedDestination } = store.state;
      if (intendedDestination) this.$router.push(intendedDestination);
    }).catch(catchHttpCode(401, (error) => {
      console.log("Unauthenticated visitor:", error.message);
    })).catch((error) => {
      console.error(error);
    });
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

$main-sm-padding-x: 2rem;
$main-md-padding-x: 6rem;
$main-lg-padding-x: 12.5rem;
$main-max-width: 640px;

main {
  padding-left: $main-sm-padding-x;
  padding-right: $main-sm-padding-x;
  max-width: calc((2 * $main-sm-padding-x) + $main-max-width);
  width: 100%;
  padding-top: 2rem;
  padding-bottom: 2rem;

  @media (min-width: 640px) {
    padding-left: $main-md-padding-x;
    max-width: calc($main-sm-padding-x + $main-md-padding-x + $main-max-width);
  }

  @media (min-width: 800px) {
    padding-left: $main-lg-padding-x;
    max-width: calc($main-sm-padding-x + $main-lg-padding-x + $main-max-width);
  }
}
</style>
