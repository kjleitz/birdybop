<template>
  <div class="sources-index-view">
    <section class="source-cards">
      <SourceCard
        v-for="source in sources"
        :key="source.id"
        :source="source"
        class="source-card"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import SourceCard from "@/components/SourceCard.vue";
import { useCollectionsStore } from "@/stores/collections";
import { useSourcesStore } from "@/stores/sources";

const collectionsStore = useCollectionsStore();
const sourcesStore = useSourcesStore();

const sources = computed(() => collectionsStore.collections.source);

onMounted(() => {
  if (!collectionsStore.collections.source.length && !sourcesStore.loadingSources) sourcesStore.fetchSources();
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
