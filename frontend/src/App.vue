<template>
  <router-view/>
</template>

<script setup lang="ts">
import { catchHttpCode } from "@/lib/error-filters";
import { useNavigationStore } from "@/stores/navigation";
import { useSessionStore } from "@/stores/session";
import { useRouter } from "vue-router";

const sessionStore = useSessionStore();
const navigationStore = useNavigationStore();
const router = useRouter();

sessionStore.refreshSession().then(() => {
  const { intendedDestination } = navigationStore;
  if (intendedDestination) router.push(intendedDestination);
}).catch(catchHttpCode(401, (error) => {
  console.log("Unauthenticated visitor:", error.message);
})).catch((error) => {
  console.error(error);
});
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
}

// for this: https://github.com/kevquirk/simple.css/issues/48#issuecomment-1021525315
:root {
  --reading-width: min(45rem, 90%);
}
// (and this)
body {
  grid-template-columns: 0fr 100% 0fr;
}

body, body * {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
