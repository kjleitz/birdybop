<template>
  <article v-bind="$attrs" :class="['comment', { collapsed }]">
    <!-- TODO: different colors and *textures* (fill patterns) for comment hierarchy lines -->
    <!-- IDEA: info on the left side, actions to the right side -->

    <header>
      <small class="info">
        <span class="karma">
          {{ comment.attributes.karma }}
        </span>
        <UnicodeIcon name="bullet" />
        <router-link :to="{ name: 'UserShow', params: { username } }" class="username">
          {{ username }}
        </router-link>
      </small>

      <small class="toggle-collapse" tabindex="0" @click.prevent.stop="emit('update:collapsed', !collapsed)">
        <a v-if="collapsed" href="#" @click.prevent.stop="emit('update:collapsed', !collapsed)">
          expand
        </a>
        <template v-else>&nbsp;</template>
      </small>
    </header>

    <div class="body">
      <div class="rendered-markdown" v-html="bodyHtml"></div>
    </div>

    <footer>
      <small class="timestamp">
        <time :datetime="createdAtJson" :title="createdAtHuman">
          {{ createdAgo }}
        </time>
        <template v-if="edited">
          <UnicodeIcon name="bullet" />
          <time :datetime="updatedAtJson" :title="updatedAtHuman">
            (edited{{ showUpdatedAgo ? ` ${updatedAgo}` : "" }})
          </time>
        </template>
      </small>
      <small>
        <a href="#" @click.prevent="replying = !replying">
          {{ replying ? "cancel" : "reply"}}
        </a>
      </small>
    </footer>
  </article>

  <CommentEditor
    v-if="replying"
    :source-path="sourcePath"
    :parent-id="id"
    autofocus
    @cancel="replying = false"
    @saved="replying = false"
  />
</template>

<script setup lang="ts">
import type Comment from "@/types/Comment";
import { computed, ref, type PropType } from "vue";
import UnicodeIcon from "@/components/UnicodeIcon.vue";
import CommentEditor from "./CommentEditor.vue";
import markdownToHtml from "@/lib/markdown-utils";
import { humanTimeAgo } from "@/lib/date-utils";
import { isA } from "@/lib/validators";

const props = defineProps({
  comment: {
    type: Object as PropType<Comment>,
    required: true,
  },

  // TODO: sourcePath shouldn't be drilled like this
  sourcePath: {
    type: String,
    required: true,
  },

  depth: {
    type: Number,
    default: 0,
  },

  collapsed: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits({
  "update:collapsed": isA(Boolean),
});

const replying = ref(false);

const id = computed(() => parseInt(props.comment.id, 10));
const username = computed(() => props.comment.attributes.authorUsername);
const bodyHtml = computed(() => markdownToHtml(props.comment.attributes.body));

const createdAtDate = computed(() => new Date(props.comment.attributes.createdAt));
const createdAtJson = computed(() => createdAtDate.value.toJSON());
const createdAtHuman = computed(() => createdAtDate.value.toLocaleString());

const updatedAtDate = computed(() => new Date(props.comment.attributes.updatedAt));
const updatedAtJson = computed(() => updatedAtDate.value.toJSON());
const updatedAtHuman = computed(() => updatedAtDate.value.toLocaleString());

const createdAgo = computed(() => humanTimeAgo(createdAtDate.value));
const updatedAgo = computed(() => humanTimeAgo(updatedAtDate.value));

const edited = computed(() => updatedAtDate.value.getTime() - createdAtDate.value.getTime() > 60000);
const showUpdatedAgo = computed(() => createdAgo.value !== updatedAgo.value);
</script>

<style lang="scss">
.comment {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;

  &.collapsed {
    color: var(--text-light);

    a {
      color: inherit;
    }

    .body, footer {
      display: none;
    }
  }

  .unicode-icon-bullet {
    color: var(--text-light);
  }

  header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .info {
      flex-wrap: nowrap;
      white-space: nowrap;
    }

    .toggle-collapse {
      display: inline-block;
      flex-grow: 1;
      margin-left: 1rem;
      width: 100%;
      text-align: right;
      cursor: pointer;

      a {
        display: inline-block;
        width: 100%;
      }
    }
  }

  .body {
    .rendered-markdown {
      > *:first-child {
        margin-top: 0.5rem;
      }

      > *:last-child {
        margin-bottom: 0.5rem;
      }
    }
  }

  footer {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .timestamp {
      color: var(--text-light);
    }
  }
}
</style>
