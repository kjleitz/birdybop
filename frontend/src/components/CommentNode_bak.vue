<template>
  <div class="comment-node">
    <Comment
      v-bind="$attrs"
      :comment="comment"
      :source-path="sourcePath"
      class="comment"
    />

    <section :class="['children-area', { empty: !children.length }]">
      <div class="depth-indicator" tabindex="0"></div>
      <div class="children">
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
import { computed, type PropType } from "vue";
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

const children = computed(() => commentsStore.childrenOf(props.comment));
// const depthIndicatorStyle = computed(() => {

// });
</script>

<style lang="scss">
@import "@/styles/mixins.scss";

.comment-node {
  .comment {
    margin-bottom: 0.5rem;
  }

  .children-area {
    border-top: 1px solid var(--border);
    border-top-left-radius: var(--border-radius);
    border-bottom-left-radius: var(--border-radius);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;

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

    .children {
      flex-grow: 1;
    }
  }
}
</style>
