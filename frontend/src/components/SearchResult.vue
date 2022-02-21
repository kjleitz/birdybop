<template>
  <article tabindex="0" class="search-result" @click="onClickResult">
    <a :href="result.attributes.url" class="search-result-title">{{ result.attributes.title }}</a>
    <a :href="result.attributes.url" class="search-result-url">{{ result.attributes.url }}</a>
    <p class="search-result-text">{{ result.attributes.content || "(no description)" }}</p>
    <nav class="source-links">
      <span v-for="([segment, source], index) in segmentSources" :key="index" class="source-link-couplet">
        <span class="path-segment source-link-separator">
          <!-- <template v-if="index === 0">&#x21B3;</template> -->
          <template v-if="index === 0">&rdsh;</template>
          <template v-else>/</template>
        </span>
        <router-link
          v-if="source"
          :to="{ name: 'SourceShow', params: { encodedSourcePath: encodeUriComponentBase64(source.attributes.path) } }"
          class="path-segment source-link"
        >
          ({{ source.attributes.karma }}) {{ segment }}
        </router-link>
        <span v-else class="path-segment">
          {{ segment }}
        </span>
      </span>
    </nav>
  </article>
</template>

<script setup lang="ts">
import type SearchResult from "@/types/SearxResult";
import type Source from "@/types/Source";
import { encodeUriComponentBase64 } from "@/lib/encoding-utils";
import { computed, type PropType } from "vue";
import { useRouter } from "vue-router";
import { useCollectionsStore } from "@/stores/collections";

const router = useRouter();

const props = defineProps({
  result: {
    type: Object as PropType<SearchResult>,
    required: true,
  },
});

const segmentSources = computed((): [string, Source | undefined][] => {
  const store = useCollectionsStore();

  return props.result.attributes.pathSegments.map((segment, index) => {
    const path = props.result.attributes.pathFamily[index];
    // TODO: Something else, this is inefficient
    const segmentSource = store.collections.source.find((source) => source.attributes.path === path);
    return [decodeURIComponent(segment), segmentSource];
  });
});

const onClickResult = (event: MouseEvent): void => {
  // If they clicked a link, let it go.
  const target = event.target as HTMLElement | null;
  if (target && `${target.tagName}`.toLowerCase() === "a") return;

  // Otherwise, go to the discussion page.
  const encodedSourcePath = encodeUriComponentBase64(props.result.attributes.sanitizedPath);
  router.push({ name: 'SourceShow', params: { encodedSourcePath } });
};
</script>

<style lang="scss">
@import "@/styles/mixins.scss";

.search-result {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 1rem;
  max-width: 100%;
  width: 100%;
  border: 1px solid transparent;
  border-radius: var(--border-radius);
  padding: 0.25rem 0;

  @include on-true-hover {
    border: 1px solid var(--border);
    cursor: pointer;
  }

  .search-result-url {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    font-size: 0.875rem;
    color: var(--text-light);
  }

  .search-result-title {
    font-size: 1.25rem;
  }

  .search-result-text {
    color: var(--text);
    font-size: 1rem;
    // margin-bottom: 0.25rem;
    margin: 0.5rem 0 0.25rem;
  }

  .source-links {
    max-width: 100%;
    margin-bottom: 1rem;
    line-height: 1.25rem;
    padding: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;

    .source-link-couplet {
      display: inline-block;
      white-space: nowrap;
      margin-right: 0.25rem;
      color: var(--text-light);
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;

      &:last-of-type {
        margin-right: 0;
      }

      .source-link {
        color: var(--accent);
        border: 0;
        margin: 0;
        padding: 0;
      }

      .path-segment {
        display: inline-block;
        font-size: 0.875rem;
      }

      .path-segment + .path-segment {
        margin-left: 0.25rem;
      }

      .source-link-separator {
        font-family: 'Courier New', Courier, monospace;
      }
    }
  }
}
</style>
