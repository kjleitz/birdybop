<template>
  <nav class="source-path-segment-links">
    <span
      v-for="([segment, sourcePath, encodedSourcePath, active], index) in segmentPathsInfo"
      :key="index"
      class="source-link-couplet"
    >
      <span class="path-segment source-link-separator">
        <!-- <template v-if="index === 0">&rdsh;</template> -->
        <UnicodeIcon v-if="index === 0" name="return-reverse" />
        <template v-else>/</template>
      </span>
      <router-link
        :to="{ name: 'SourceShow', params: { encodedSourcePath } }"
        :class="['path-segment', 'source-link', { active }]"
        :title="`${active ? 'Viewing' : 'View'} discussion for this source (${sourcePath})`"
      >
        {{ segment }}
      </router-link>
    </span>
  </nav>
</template>

<script setup lang="ts">
import { encodeUriComponentBase64 } from '@/lib/encoding-utils';
import { computed } from 'vue';
import UnicodeIcon from './UnicodeIcon.vue';

const props = defineProps({
  // For a url like "https://en.m.www.foo.com/bar/baz?bam=123#yeah",
  // the `sanitizedPath` would be: "en.foo.com/bar/baz"
  sanitizedPath: {
    type: String,
    required: true,
  },

  // This path segment will be bold (or otherwise emphasized) in the list of
  // path segment links
  activePath: {
    type: String,
    default: "",
  },
});

const pathSegments = computed(() => props.sanitizedPath.split("/"));

type SegmentPathInfo = [
  humanSegment: string,
  sourcePath: string,
  encodedSourcePath: string,
  active: boolean
];

const segmentPathsInfo = computed<SegmentPathInfo[]>(() => pathSegments.value.map((segment, index) => {
  const humanSegment = decodeURIComponent(segment);
  const sourcePath = pathSegments.value.slice(0, index + 1).join("/");
  const encodedSourcePath = encodeUriComponentBase64(sourcePath);
  const active = props.activePath === sourcePath;
  return [humanSegment, sourcePath, encodedSourcePath, active];
}));
</script>

<style lang="scss">
.source-path-segment-links {
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

      &.active {
        font-weight: bold;
        color: var(--text);
      }
    }

    .path-segment + .path-segment {
      margin-left: 0.25rem;
    }

    .source-link-separator {
      font-family: 'Courier New', Courier, monospace;
    }
  }
}
</style>
