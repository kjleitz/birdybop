<template>
  <div class="search-bar">
    <form action="#" @submit.prevent="submitSearch">
      <input
        type="text"
        v-model="searchQuery"
        :disabled="searching"
        name="search"
        placeholder="Search"
        class="search-input"
        @keydown.prevent.exact.enter="submitSearch"
      />
      <button
        :disabled="searching"
        type="submit"
        class="search-button"
        @click="submitSearch"
      >
        <!-- TODO: spinner -->
        <UnicodeIcon name="magnifying-glass" :rotate-degrees="-45" />
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { filterNavDuplicated } from "@/lib/error-filters";
import UnicodeIcon from "@/components/UnicodeIcon.vue";
import { useRoute, useRouter, type LocationQueryValue } from "vue-router";
import { useSearchStore } from "@/stores/search";

const store = useSearchStore();
const route = useRoute();
const router = useRouter();

const searchQuery = ref(store.query || route.query.q as LocationQueryValue || "");

const searching = computed(() => store.searching);
const storeQuery = computed(() => store.query);

watch(storeQuery, (newVal, oldVal) => {
  if (newVal !== oldVal && newVal !== searchQuery.value) searchQuery.value = newVal;
});

const submitSearch = (): void => {
  if (!searchQuery.value) return;

  router.push({
    name: "SearchResults",
    query: { q: searchQuery.value },
  }).catch(filterNavDuplicated);
};
</script>

<style lang="scss">
.search-bar {
  position: relative;

  form {
    display: flex;
    justify-content: stretch;
    align-items: stretch;
    width: 100%;
    height: 100%;

    .search-input {
      flex-grow: 1;
      margin: 0;
    }

    .search-button {
      margin: 0 0 0 0.5rem;
    }

    .magnifying-glass {
      display: inline-block;
      transform: rotate(-45deg);
    }
  }

}
</style>
