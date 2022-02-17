<template>
  <article class="link-card">
    <div class="vote-area">
      <button
        :class="['upvote', { pressed: upvoted }]"
        @click="emit('update:upvoted', !upvoted)"
      >
        <UnicodeIcon name="triangle-sm" direction="up"/>
      </button>

      <span class="karma">{{ karma }}</span>

      <button
        :class="['downvote', { pressed: downvoted }]"
        @click="$emit('update:downvoted', !downvoted)"
      >
        <UnicodeIcon name="triangle-sm" direction="down"/>
      </button>
    </div>

    <div class="info-area">
      <a :href="url" class="link-url">{{ url }}</a>
      <a :href="url" class="link-title">{{ title }}</a>
      <p class="link-description">{{ description }}</p>
      <div class="links-area">
        <slot name="links"></slot>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { isA } from "@/lib/validators";
import UnicodeIcon from "@/components/UnicodeIcon.vue";

defineProps({
  karma: {
    type: Number,
    default: 0,
  },

  url: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },

  upvoted: {
    type: Boolean,
    default: false,
  },

  downvoted: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits({
  "update:upvoted": isA(Boolean),
  "update:downvoted": isA(Boolean),
});
</script>

<style lang="scss">
.link-card {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 1rem;

  .vote-area {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 3rem;

    .upvote {
      &.pressed {
        color: var(--upvote);
      }
    }

    .downvote {
      &.pressed {
        color: var(--downvote);
      }
    }
  }

  .info-area {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }

  .link-url {
    color: var(--text-light);
    font-size: 0.875em;
    line-height: 1;
  }

  .link-title {
    font-size: 1.25em;
  }
}
</style>
