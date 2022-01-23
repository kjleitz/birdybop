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

main {
  padding-left: 2rem;
  padding-right: 2rem;
  max-width: 640px;
  width: 100%;
  padding-top: 2rem;
  padding-bottom: 2rem;

  @media (min-width: 640px) {
    padding-left: 4rem;
  }

  @media (min-width: 800px) {
    padding-left: 10rem;
  }
}
</style>
