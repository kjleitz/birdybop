<template>
  <div class="source-show-view">
    <main>
      <LoadingSplash v-if="!alreadyLoaded && (loadingSource || loadingComments)" class="loading-splash"/>
      <template v-else>
        <section v-if="source" class="source-info">
          <!-- <span>{{ source.id || "(not persisted)" }}</span> -->
          <a :href="sourceUrl" class="source-title">{{ source.attributes.name }}</a>
          <a :href="sourceUrl" class="source-url">{{ sourceUrl }}</a>
          <p class="source-text">{{ source.attributes.description || "(no description)" }}</p>

          <SourcePathSegmentLinks
            :sanitized-path="sourcePath"
            :active-path="sourcePath"
          />
        </section>

        <section class="comments-section">
          <CommentEditor :source-path="sourcePath" :source-url="sourceUrl" :cancelable="false" />

          <!-- TODO: sorting and filters go here -->

          <CommentNode
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
            :source-path="sourcePath"
          />
        </section>
      </template>
    </main>
  </div>
</template>

<script lang="ts">
import { decodeUriComponentBase64 } from "@/lib/encoding-utils";

const sourcePathFromRoute = (route: RouteLocationNormalized): string => {
  return decodeUriComponentBase64(route.params.encodedSourcePath as string);
};

const defaultSourceUrlFromRoute = (route: RouteLocationNormalized): string => {
  // We'll just assume the site supports HTTPS, and that they have the proper
  // redirects in place in case we've stripped `www.` and/or `m.` from the
  // subdomains... :grimacing: :sweat_smile:
  return `https://${sourcePathFromRoute(route)}`;
};

const sourceUrlFromRoute = (route: RouteLocationNormalized): string => {
  const { encodedSourceUrl } = route.query;
  return encodedSourceUrl
    ? decodeUriComponentBase64(encodedSourceUrl as string)
    : defaultSourceUrlFromRoute(route);
};
</script>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type Source from "@/types/Source";
import { onBeforeRouteUpdate, useRoute, type RouteLocationNormalized } from "vue-router";
import LoadingSplash from "@/components/LoadingSplash.vue";
import CommentNode from "@/components/CommentNode.vue";
import CommentEditor from "@/components/CommentEditor.vue";
import { useSourcesStore } from "@/stores/sources";
import { useCollectionsStore } from "@/stores/collections";
import { storeToRefs } from "pinia";
import { useCommentsStore } from "@/stores/comments";
import { promiseDebouncer } from "@/lib/promise-utils";
import SourcePathSegmentLinks from "../components/SourcePathSegmentLinks.vue";

const sourcesStore = useSourcesStore();
const commentsStore = useCommentsStore();
const collectionsStore = useCollectionsStore();
const route = useRoute();

const sourceForPath = (sourcePath: string): Source | undefined => {
  return collectionsStore.collections.source.find(source => source.attributes.path === sourcePath);
};

const alreadyLoaded = ref(false);

const { loadingSource } = storeToRefs(sourcesStore);
const { loadingComments } = storeToRefs(commentsStore);
const sourcePath = computed(() => sourcePathFromRoute(route));
const sourceUrl = computed(() => sourceUrlFromRoute(route));
const source = computed(() => sourceForPath(sourcePath.value));
const comments = computed(() => collectionsStore.collections.comment.filter((comment) => !comment.attributes.parentId));
// const firstComment = computed(() => comments.value[0]);

watch([loadingSource, loadingComments], ([newLoadingSource, newLoadingComments], [oldLoadingSource, oldLoadingComments]) => {
  // If either are still loading, bail.
  if (newLoadingSource || newLoadingComments) return;

  // Okay, neither are still loading...
  // If neither _were_ loading, bail.
  if (!(oldLoadingSource || oldLoadingComments)) return;

  // Okay, the last of the initial loading has stopped.
  // Let's kill the canary.
  alreadyLoaded.value = true;
});

const fetchSource = promiseDebouncer((sourcePath: string, sourceUrl?: string): Promise<void> => {
  return sourcesStore.fetchSource(sourcePath, sourceUrl);
});

const fetchComments = promiseDebouncer((sourcePath: string): Promise<void> => {
  return commentsStore.fetchComments(sourcePath);
});

onMounted(() => {
  const path = sourcePath.value;
  const url = sourceUrl.value;
  alreadyLoaded.value = false;
  if (!source.value) {
    fetchSource(path, url).then(() => fetchComments(path));
  } else {
    fetchComments(path);
  }
});

onBeforeRouteUpdate((to, _from, next) => {
  const sourcePath = sourcePathFromRoute(to);
  const sourceUrl = sourceUrlFromRoute(to);
  const source = sourceForPath(sourcePath);

  if (!source) {
    fetchSource(sourcePath, sourceUrl)
      .then(() => fetchComments(sourcePath))
      .then(() => next());
  } else {
    fetchComments(sourcePath).then(() => next());
  }
});
</script>

<style lang="scss">
.source-show-view {
  .source-info {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 1rem;
    max-width: 100%;
    width: 100%;
    // border: 1px solid transparent;
    // border-radius: var(--border-radius);
    padding: 0.25rem 0;
  }

  .source-url {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    font-size: 0.875rem;
    color: var(--text-light);
  }

  .source-title {
    font-size: 1.25rem;
  }

  .source-text {
    color: var(--text);
    font-size: 1rem;
    // margin-bottom: 0.25rem;
    margin: 0.5rem 0 0.25rem;
  }
}
</style>
