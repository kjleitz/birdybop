<template>
  <div class="sources-index-view">
    <section class="source-cards">
      <source-card
        v-for="source in sources"
        :key="source.id"
        :source="source"
        class="source-card"
      />
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import store from "@/store";
import Source from "@/types/Source";
import SourceCard from "@/components/SourceCard.vue";

export default Vue.extend({
  name: "SourcesIndex",

  components: {
    SourceCard,
  },

  computed: {
    sources(): Source[] {
      return store.state.sources;
    },
  },

  beforeRouteEnter(_to, _from, next): void {
    if (!store.state.sources.length && !store.state.loadingSources) {
      store.dispatch("fetchSources").then(() => next());
    } else {
      next();
    }
  },
});
</script>

<style lang="scss">
.sources-index-view {
  .source-cards {
    padding: 1rem;

    .source-card {
      margin-bottom: 1rem;
    }
  }
}
</style>
