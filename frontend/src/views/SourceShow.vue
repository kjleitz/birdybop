<template>
  <div class="source-show-view">
    <main>
      <LoadingSplash v-if="loadingSource" class="loading-splash"/>
      <template v-else-if="!source">
        <p>
          No existing source for path "{{ sourcePath }}"
        </p>
      </template>
      <template v-else>
        <a :href="source.attributes.path" class="search-result-title">{{ source.attributes.name }}</a>
        <a :href="source.attributes.path" class="search-result-url">{{ source.attributes.path }}</a>
        <p class="search-result-text">{{ source.attributes.description || "(no description)" }}</p>
      </template>
    </main>
  </div>
</template>

<script lang="ts">
import { decodeUriComponentBase64 } from "@/lib/encoding-utils";

const sourcePathFromRoute = (route: RouteLocationNormalized): string => {
  return decodeUriComponentBase64(route.params.encodedSourcePath as string);
};
</script>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import type Source from "@/types/Source";
import { onBeforeRouteUpdate, useRoute, type RouteLocationNormalized } from "vue-router";
import LoadingSplash from "@/components/LoadingSplash.vue";
import { useSourcesStore } from "@/stores/sources";
import { useCollectionsStore } from "@/stores/collections";

const sourcesStore = useSourcesStore();
const collectionsStore = useCollectionsStore();
const route = useRoute();

const sourceForPath = (sourcePath: string): Source | undefined => {
  return collectionsStore.collections.source.find(source => source.attributes.path === sourcePath);
};

const loadingSource = computed(() => sourcesStore.loadingSource);
const sourcePath = computed(() => sourcePathFromRoute(route));
const source = computed(() => sourceForPath(sourcePath.value));

onMounted(() => {
  if (!source.value) sourcesStore.fetchSource(sourcePath.value);
});

onBeforeRouteUpdate((to, _from, next) => {
  const sourcePath = sourcePathFromRoute(to);
  const source = sourceForPath(sourcePath);

  if (!source) {
    sourcesStore.fetchSource(sourcePath).then(() => next());
  } else {
    next();
  }
});
</script>
