<template>
  <header class="search-header">
    <SessionLink />
    <Logo class="logo" />
    <SearchBar class="search-bar" />
  </header>
</template>

<script setup lang="ts">
import Logo from "@/components/Logo.vue";
import SearchBar from "@/components/SearchBar.vue";
import SessionLink from "@/components/SessionLink.vue";
</script>

<style lang="scss">
.search-header {
  padding-top: 2rem;
  padding-bottom: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-bottom: 1px solid var(--border);
  background-color: var(--accent-bg);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding-top: 2rem;
    padding-bottom: 2rem;
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .session-link {
    position: absolute;
    top: 0;
    right: 0;
  }

  h1.logo {
    padding-top: 1rem;
    padding-bottom: 1rem;
    margin: 0;
    font-size: 2.25rem;

    @media (min-width: 640px) {
      font-size: 2.5rem;
      padding-top: 0rem;
      padding-right: 2rem;
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
