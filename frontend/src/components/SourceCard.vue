<template>
  <LinkCard
    :karma="source.attributes.karma"
    :url="source.attributes.path"
    :title="source.attributes.name"
    :description="source.attributes.description"
    :upvoted="upvoted"
    :downvoted="downvoted"
    class="source-card"
    @update:upvoted="onUpvoteClicked"
    @update:downvoted="onDownvoteClicked"
  >
    <template #links>
      <router-link
        :to="{ name: 'SourceCommentsIndex', params: { sourceId: source.id } }"
        class="source-comments"
      >
        {{ source.attributes.commentsCount }} comments
      </router-link>
    </template>
  </LinkCard>
</template>

<script setup lang="ts">
import type Source from "@/types/Source";
import { ref, type PropType } from "vue";
import LinkCard from "@/components/LinkCard.vue";

defineProps({
  source: {
    type: Object as PropType<Source>,
    required: true,
  },
});

const upvoted = ref(false);
const downvoted = ref(false);

const onUpvoteClicked = (newUpvoted: boolean): void => {
  upvoted.value = newUpvoted;
  downvoted.value = false;
};

const onDownvoteClicked = (newDownvoted: boolean): void => {
  downvoted.value = newDownvoted;
  upvoted.value = false;
};
</script>

<style lang="scss">
.source-card {
  // ...
}
</style>
