<template>
  <div class="home-view">
    <SessionLink class="session-link" />

    <section class="birdybop-search">
      <Logo class="logo"/>
      <div class="search-area">
        <SearchBar class="search-bar"/>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Logo from "@/components/Logo.vue";
import SearchBar from "@/components/SearchBar.vue";
import SessionLink from "@/components/SessionLink.vue";
import { useSearchStore } from "@/stores/search";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const searchStore = useSearchStore();
const route = useRoute();

onMounted(() => {
  if (!route.query.q) searchStore.setQuery("");
});
</script>

<style lang="scss">
.home-view {
  position: relative;
  width: 100%;

  .birdybop-search {
    position: absolute;
    top: 50vh;
    left: 0;
    width: 100%;
    transform: translateY(-100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    .logo {
      font-size: 4rem;

      @media (min-width: 640px) {
        font-size: 8rem;
      }
    }

    .search-area {
      max-width: 640px;
      width: 100%;
      padding: 0 2rem;

      .search-bar {
        width: 100%;
      }
    }
  }
}
</style>
