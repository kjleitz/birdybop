<template>
  <header class="search-header">
    <session-link />
    <logo class="logo" />
    <search-bar class="search-bar" />
  </header>
</template>

<script lang="ts">
import Vue from "vue";
import Logo from "@/components/Logo.vue";
import SearchBar from "@/components/SearchBar.vue";
import SessionLink from "@/components/SessionLink.vue";

export default Vue.extend({
  name: "SearchHeader",

  components: {
    Logo,
    SearchBar,
    SessionLink,
  },
});
</script>

<style lang="scss">
.search-header {
  padding-top: 0rem;
  padding-bottom: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  border-bottom: 1px solid rgba(0, 0 , 0, 0.125);
  background-color: rgba(0, 0 , 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;

  @media (min-width: 640px) {
    padding-top: 2rem;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .session-link {
    position: absolute;
    top: 0;
    right: 0;
  }

  h1.logo {
    padding-top: 1rem;
    padding-right: 1rem;
    padding-bottom: 1rem;
    margin-bottom: 0;
    font-size: 2.25rem;

    @media (min-width: 640px) {
      font-size: 2.5rem;
      padding-top: 0rem;
      padding-bottom: 0rem;
      padding-left: 0rem;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }
  }

  .search-bar {
    max-width: 640px;
    width: 100%;
  }
}
</style>
