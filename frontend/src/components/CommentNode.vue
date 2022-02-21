<template>
  <div class="comment-node">
    <div class="depth-indicator" tabindex="0" @click.prevent="collapsed = !collapsed"></div>
    <section class="comment-area">
      <Comment
        v-bind="$attrs"
        v-model:collapsed="collapsed"
        :comment="comment"
        :source-path="sourcePath"
        class="comment"
      />

      <div v-if="!collapsed" class="children">
        <CommentNode
          v-for="child in children"
          :key="child.id"
          :comment="child"
          :depth="depth + 1"
          :source-path="sourcePath"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type CommentType from "@/types/Comment";
import { computed, ref, type PropType } from "vue";
import Comment from "@/components/Comment.vue";
import { useCommentsStore } from "@/stores/comments";

const commentsStore = useCommentsStore();

const props = defineProps({
  comment: {
    type: Object as PropType<CommentType>,
    required: true,
  },

  sourcePath: {
    type: String,
    required: true,
  },

  depth: {
    type: Number,
    default: 0,
  },
});

const collapsed = ref(false);

const children = computed(() => commentsStore.childrenOf(props.comment));
</script>

<style lang="scss">
@import "@/styles/mixins.scss";

.comment-node {
  border-top: 1px solid var(--border);
  border-top-left-radius: var(--border-radius);
  border-bottom-left-radius: var(--border-radius);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  margin-top: 0.25rem;

  &.empty {
    border-top-color: transparent;

    .depth-indicator {
      display: none;
    }
  }

  .depth-indicator {
    // border-top: 0.35rem solid var(--accent);
    // border-right: 0.35rem solid transparent;
    border-left: 0.35rem solid var(--accent);
    // border-bottom: 0.35rem solid transparent;
    border-radius: var(--border-radius);
    width: 1rem;
    // min-height: 1rem;
    // background-color: var(--accent);
    // margin-right: 0.5rem;
    opacity: 0.5;

    @include on-true-hover {
      opacity: 1;
      cursor: pointer;
    }
  }

  // .comment {
  //   &:not(.collapsed) {
  //     margin-bottom: 0.5rem;
  //   }
  // }

  .comment-area {
    // flex-grow: 1;
    width: 100%;

    .children {
      margin-top: 0.5rem;
    }
  }
  // .children {
  //   flex-grow: 1;
  // }
}
</style>
