<template>
  <div class="search-results-view">
    <SearchHeader />

    <main class="birdybop-search-results">
      <LoadingSplash v-if="searching" class="loading-splash"/>

      <template v-if="!searching && !results.length">
        <p>
          No results found for "{{ query }}"
        </p>
      </template>
      <template v-else>
        <SearchResult
          v-for="result in results"
          :key="result.attributes.url"
          :result="result"
          :sources="result.relationships.sources"
        />
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import LoadingSplash from "@/components/LoadingSplash.vue";
import SearchHeader from "@/components/SearchHeader.vue";
import SearchResult from "@/components/SearchResult.vue";
import { useSearchStore } from "@/stores/search";
import { useCollectionsStore } from "@/stores/collections";

const collectionsStore = useCollectionsStore();
const searchStore = useSearchStore();
const route = useRoute();

const results = computed(() => collectionsStore.collections.searxResult);
const searching = computed(() => searchStore.searching);
const query = computed(() => searchStore.query);

onMounted(() => {
  const q = (route.query.q as string) || "";
  if (q && q !== query.value && !searching.value) searchStore.search(q);
});

onBeforeRouteUpdate((to, _from, next) => {
  const q = (to.query.q as string) || "";
  if (q && q !== query.value && !searching.value) {
    searchStore.search(q).then(() => next());
  } else {
    next();
  }
});
</script>

<style lang="scss">
.search-results-view {
  .birdybop-search-results {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    .loading-splash {
      position: absolute;
      top: 12.5vh;
      left: 0;
      width: 100vw;
    }
  }
}
</style>
