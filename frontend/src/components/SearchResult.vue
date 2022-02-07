<template>
  <article class="search-result">
    <a :href="result.attributes.url" class="search-result-title">{{ result.attributes.title }}</a>
    <a :href="result.attributes.url" class="search-result-url">{{ result.attributes.url }}</a>
    <p class="search-result-text">{{ result.attributes.content }}</p>
    <nav class="source-links">
      <span v-for="([segment, source], index) in segmentSources" :key="index" class="source-link-couplet">
        <span class="path-segment source-link-separator">
          <!-- <template v-if="index === 0">&#x21B3;</template> -->
          <template v-if="index === 0">&rdsh;</template>
          <template v-else>/</template>
        </span>
        <router-link
          v-if="source"
          :to="{ name: 'SourceShow', params: { sourceId: source.id } }"
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

<script lang="ts">
import Vue, { PropType } from "vue";
import SearchResult from "@/types/SearxResult";
import Source from "@/types/Source";
import store from "@/store";

export default Vue.extend({
  name: "SearchResult",

  props: {
    result: {
      type: Object as PropType<SearchResult>,
      required: true,
    },
  },

  computed: {
    segmentSources(): [string, Source | undefined][] {
      return this.result.attributes.pathSegments.map((segment, index) => {
        const path = this.result.attributes.pathFamily[index];

        // TODO: This is inefficient
        const segmentSource = store.state.db.source.find((source) => {
          return source.attributes.path === path;
        });

        return [decodeURIComponent(segment), segmentSource];
      });
    },
  },
});
</script>

<style lang="scss">
.search-result {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 1rem;
  max-width: 100%;

  .search-result-url {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    font-size: 0.875rem;
    color: #555;
  }

  .search-result-title {
    font-size: 1.25rem;
  }

  .search-result-text {
    color: #333;
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .source-links {
    max-width: 100%;
    margin-bottom: 1rem;
    line-height: 1.25rem;

    .source-link-couplet {
      display: inline-block;
      white-space: nowrap;
      margin-right: 0.25rem;
      color: #aaa;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;

      &:last-of-type {
        margin-right: 0;
      }

      .source-link {
        color: #555;
      }

      .path-segment {
        // display: inline-block;
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
