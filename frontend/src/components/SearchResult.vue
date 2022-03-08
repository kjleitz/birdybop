<template>
  <article tabindex="0" class="search-result" @click="onClickResult">
    <a :href="result.attributes.url" class="search-result-title">{{ result.attributes.title }}</a>
    <a :href="result.attributes.url" class="search-result-url">{{ result.attributes.url }}</a>
    <p class="search-result-text">{{ result.attributes.content || "(no description)" }}</p>
    <div class="view-discussion">
      <router-link :to="sourceDiscussionLink" class="view-discussion-link">
        View discussion
      </router-link>
    </div>
    <SourcePathSegmentLinks
      :sanitized-path="result.attributes.sanitizedPath"
      class="segment-links"
    />
  </article>
</template>

<script setup lang="ts">
import type SearxResult from "@/types/SearxResult";
import SourcePathSegmentLinks from "@/components/SourcePathSegmentLinks.vue";
import { encodeUriComponentBase64 } from "@/lib/encoding-utils";
import { computed, type PropType } from "vue";
import { useRouter, type RouteLocationRaw } from "vue-router";

const router = useRouter();

const props = defineProps({
  result: {
    type: Object as PropType<SearxResult>,
    required: true,
  },
});

const encodedSourcePath = computed(() => {
  return encodeUriComponentBase64(props.result.attributes.sanitizedPath);
});

const encodedSourceUrl = computed(() => {
  return encodeUriComponentBase64(props.result.attributes.url);
});

const sourceDiscussionLink = computed<RouteLocationRaw>(() => ({
  name: "SourceShow",
  params: { encodedSourcePath: encodedSourcePath.value },
  query: { encodedSourceUrl: encodedSourceUrl.value },
}));

const onClickResult = (event: MouseEvent): void => {
  // If they clicked a link, let it go.
  const target = event.target as HTMLElement | null;
  if (target && `${target.tagName}`.toLowerCase() === "a") return;

  // Otherwise, go to the discussion page.
  router.push(sourceDiscussionLink.value);
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
  padding: 0.25rem 1rem;

  @include on-mobile {
    padding: 0.25rem 0rem;
  }

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

  .view-discussion {
    font-size: small;
  }

  .segment-links {
    font-size: small;
  }

  // .source-links {
  //   max-width: 100%;
  //   margin-bottom: 1rem;
  //   line-height: 1.25rem;
  //   padding: 0;
  //   display: flex;
  //   justify-content: flex-start;
  //   align-items: center;
  //   flex-wrap: wrap;
  //   font-size: small;

  //   .source-link-couplet {
  //     display: inline-block;
  //     white-space: nowrap;
  //     margin-right: 0.25rem;
  //     color: var(--text-light);
  //     max-width: 100%;
  //     overflow: hidden;
  //     text-overflow: ellipsis;

  //     &:last-of-type {
  //       margin-right: 0;
  //     }

  //     .source-link {
  //       color: var(--accent);
  //       border: 0;
  //       margin: 0;
  //       padding: 0;
  //     }

  //     .path-segment {
  //       display: inline-block;
  //       // font-size: 0.875rem;
  //     }

  //     .path-segment + .path-segment {
  //       margin-left: 0.25rem;
  //     }

  //     .source-link-separator {
  //       font-family: 'Courier New', Courier, monospace;
  //     }
  //   }
  // }
}
</style>
