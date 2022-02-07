<template>
  <div class="search-bar">
    <form action="#" @submit.prevent="submitSearch">
      <input
        type="text"
        v-model="searchQuery"
        :disabled="searching"
        name="search"
        placeholder="Search"
        @keydown.prevent.exact.enter="submitSearch"
      />
      <button
        :disabled="searching"
        type="submit"
        @click="submitSearch"
      >
        <!-- TODO: spinner -->
        <span class="magnifying-glass">&#x26B2;</span>
      </button>
    </form>

    <!-- <b-input-group size="lg">
      <b-form-input
        v-model="searchQuery"
        :disabled="searching"
        :autofocus="!searchQuery"
        type="search"
        placeholder="Search"
        @keydown.prevent.exact.enter="submitSearch"
      ></b-form-input>

      <b-input-group-append>
        <b-button
          :disabled="searching"
          variant="primary"
          size="lg"
          @click="submitSearch"
        >
          <transition name="fade" mode="out-in">
            <b-icon-search v-if="!searching" key="icon-search"/>
            <b-icon-question-circle v-else key="icon-loading" animation="spin"/>
          </transition>
        </b-button>
      </b-input-group-append>
    </b-input-group> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store';
// import {
//   BButton,
//   BFormInput,
//   BIconQuestionCircle,
//   BIconSearch,
//   BInputGroup,
//   BInputGroupAppend,
// } from "bootstrap-vue";
import { filterNavDuplicated } from "@/lib/error-filters";

export default Vue.extend({
  name: "SearchBar",

  components: {
    // BButton,
    // BFormInput,
    // BIconQuestionCircle,
    // BIconSearch,
    // BInputGroup,
    // BInputGroupAppend,
  },

  data() {
    return {
      searchQuery: store.state.query || (this.$route.query.q as string) || "",
    };
  },

  computed: {
    searching(): boolean {
      return store.state.searching;
    },

    storeQuery(): string {
      return store.state.query;
    },
  },

  watch: {
    storeQuery(newVal: string, oldVal: string): void {
      if (newVal !== oldVal && newVal !== this.searchQuery) this.searchQuery = newVal;
    },
  },

  methods: {
    submitSearch(): void {
      if (!this.searchQuery) return;

      this.$router.push({
        name: "SearchResults",
        query: { q: this.searchQuery },
      }).catch(filterNavDuplicated);
    },
  },
});
</script>

<style lang="scss">
// .search-bar {
//   max-width: 640px;
//   width: 100%;
// }

.search-bar {
  .magnifying-glass {
    display: inline-block;
    transform: rotate(-45deg);
  }
}
</style>
