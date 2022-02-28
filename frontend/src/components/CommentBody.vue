<template>
  <div class="comment-body">
    <div class="rendered-markdown" v-html="bodyHtml"></div>
  </div>
</template>

<script setup lang="ts">import markdownToHtml from '@/lib/markdown-utils';
import { computed } from 'vue';

const props = defineProps({
  body: {
    type: String,
    required: true,
  },
});

const bodyHtml = computed(() => markdownToHtml(props.body));
</script>

<style lang="scss">
.comment-body {
  .rendered-markdown {
    > *:first-child {
      margin-top: 0.5rem;
    }

    > *:last-child {
      margin-bottom: 0.5rem;
    }
  }
}
</style>
