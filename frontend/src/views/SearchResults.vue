<template>
  <div class="search-results-view">
    <search-header />

    <main class="birdybop-search-results">
      <loading-splash v-if="searching" class="loading-splash"/>

      <template v-if="!searching && !results.length">
        No results found for "{{ query }}"
      </template>
      <template v-else>
        <search-result
          v-for="(result, index) in results"
          :key="index"
          :result="result"
          :sources="result.relationships.sources"
        />
      </template>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import store from "@/store";
import SearxResult from "@/types/SearxResult";
import LoadingSplash from "@/components/LoadingSplash.vue";
import SearchHeader from "@/components/SearchHeader.vue";
import SearchResultComponent from "@/components/SearchResult.vue";

export default Vue.extend({
  name: 'SearchResults',

  components: {
    LoadingSplash,
    SearchHeader,
    SearchResult: SearchResultComponent,
  },

  computed: {
    results(): SearxResult[] {
      return store.state.results;
    },

    searching(): boolean {
      return store.state.searching;
    },

    query(): string {
      return store.state.query;
    },
  },

  beforeRouteEnter(to, _from, next): void {
    const query = (to.query.q as string) || "";
    if (query && query !== store.state.query && !store.state.searching) {
      store.dispatch("search", query).then(() => next());
    } else {
      next();
    }
  },

  beforeRouteUpdate(to, _from, next): void {
    const query = (to.query.q as string) || "";
    if (query && query !== store.state.query && !store.state.searching) {
      store.dispatch("search", query).then(() => next());
    } else {
      next();
    }
  },
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
