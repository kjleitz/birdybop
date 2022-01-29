<template>
  <div class="search-results-view">
    <search-header />

    <main class="birdybop-search-results">
      <loading-splash v-if="searching" class="loading-splash"/>

      <template v-if="!searching && !results.length">
        No results found for "{{ query }}"
      </template>
      <template v-else>
        <article
          v-for="(result, index) in results"
          :key="index"
          class="search-result"
        >
          <a :href="result.url" class="search-result-url">{{ result.pretty_url }}</a>
          <a :href="result.url" class="search-result-title">{{ result.title }}</a>
          <p class="search-result-text">{{ result.content }}</p>
        </article>
      </template>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import store from "@/store";
import SearxResults from "@/types/SearxResults";
import SearxResult from "@/types/SearxResult";
import LoadingSplash from "@/components/LoadingSplash.vue";
import SearchHeader from "@/components/SearchHeader.vue";

export default Vue.extend({
  name: 'SearchResults',

  components: {
    LoadingSplash,
    SearchHeader,
  },

  computed: {
    searxResults(): SearxResults {
      return store.state.results;
    },

    results(): SearxResult[] {
      return this.searxResults.results;
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
  // .padded {
  //   padding-left: 2rem;
  //   padding-right: 2rem;

  //   @media (min-width: 640px) {
  //     padding-left: 4rem;
  //   }

  //   @media (min-width: 800px) {
  //     padding-left: 10rem;
  //   }
  // }

  .birdybop-search-results {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    // max-width: 640px;
    // width: 100%;
    // padding-top: 2rem;
    // padding-bottom: 2rem;

    .loading-splash {
      position: absolute;
      top: 12.5vh;
      left: 0;
      width: 100vw;
    }

    .search-result {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      font-size: 1rem;

      .search-result-url {
        color: #555;
        font-size: 0.875em;
      }

      .search-result-title {
        font-size: 1.25em;
      }

      .search-result-text {
        color: #333;
        font-size: 1em;
      }
    }
  }
}
</style>
