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

    <CommentBody :body="comment.attributes.body" class="body" />

    <footer>
      <small class="timestamp">
        <time :datetime="createdAtJson" :title="createdAtHuman">
          {{ createdAgo }}
        </time>
        <template v-if="edited">
          <UnicodeIcon name="bullet" />
          <time :datetime="editedAtJson" :title="editedAtHuman">
            (edited{{ showEditedAgo ? ` ${editedAgo}` : "" }})
          </time>
        </template>
      </small>
      <button :class="['secondary', 'small', 'upvote', { pressed: upvoted }]" @click.prevent.stop="onUpvoteClicked">
        <UnicodeIcon name="fat-arrow" direction="up" />
      </button>
      <button :class="['secondary', 'small', 'downvote', { pressed: downvoted }]" @click.prevent.stop="onDownvoteClicked">
        <UnicodeIcon name="fat-arrow" direction="down" />
      </button>
      <small>
        <!-- <a href="#" @click.prevent="onToggleReply" class="reply-btn"> -->
        <a href="#" @click.prevent="replying = !replying" class="reply-btn">
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
import CommentBody from "@/components/CommentBody.vue";
import CommentEditor from "@/components/CommentEditor.vue";
import { humanTimeAgo } from "@/lib/date-utils";
import { isA } from "@/lib/validators";
import { useCommentsStore } from "@/stores/comments";

const commentsStore = useCommentsStore();

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
const commentVoteState = computed(() => commentsStore.commentVoteState(id.value));
const upvoted = computed(() => commentVoteState.value === true); // `commentVoteState.value` can be `null`
const downvoted = computed(() => commentVoteState.value === false); // `commentVoteState.value` can be `null`

const createdAtDate = computed(() => new Date(props.comment.attributes.createdAt));
const createdAtJson = computed(() => createdAtDate.value.toJSON());
const createdAtHuman = computed(() => createdAtDate.value.toLocaleString());

const editedAtDate = computed(() => {
  const { editedAt } = props.comment.attributes;
  return editedAt ? new Date(editedAt) : null;
});
const editedAtJson = computed(() => editedAtDate.value?.toJSON() || "");
const editedAtHuman = computed(() => editedAtDate.value?.toLocaleString() || "");

const createdAgo = computed(() => humanTimeAgo(createdAtDate.value));
const editedAgo = computed(() => editedAtDate.value ? humanTimeAgo(editedAtDate.value) : "");

const edited = computed(() => !!editedAtDate.value && (editedAtDate.value.getTime() - createdAtDate.value.getTime()) > 60000);
const showEditedAgo = computed(() => edited.value && createdAgo.value !== editedAgo.value);

const onUpvoteClicked = () => {
  if (upvoted.value) {
    // User is removing their existing upvote
    commentsStore.deleteCommentVote(props.comment.id);
  } else {
    // User is upvoting the comment
    commentsStore.upvoteComment(props.comment.id);
  }
};

const onDownvoteClicked = () => {
  if (downvoted.value) {
    // User is removing their existing upvote
    commentsStore.deleteCommentVote(props.comment.id);
  } else {
    // User is upvoting the comment
    commentsStore.downvoteComment(props.comment.id);
  }
};

// const onToggleReply = () => {
//   const cancelingReply = replying.value;
//   replying.value = !replying.value;

//   if (cancelingReply) nextTick(() => {  })
// };
</script>

<style lang="scss">
@import "@/styles/mixins.scss";

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
      color: var(--text-light);
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
    justify-content: stretch;
    align-items: center;

    .timestamp {
      display: inline-block;
      flex-grow: 1;
      color: var(--text-light);
    }

    > * {
      + * {
        margin-left: 0.5rem;
      }
    }

    .reply-btn {
      display: inline-block;
      text-align: right;
      min-width: 3rem;
    }

    button {
      color: var(--text-light);

      &.upvote {
        @include on-true-hover {
          color: var(--upvote);
          border-color: var(--upvote);
        }

        &.pressed {
          color: var(--upvote);
          border-color: var(--upvote);
        }

        &.pressed {
          background-color: var(--upvote-bg);
        }
      }

      &.downvote {
        @include on-true-hover {
          color: var(--downvote);
          border-color: var(--downvote);
        }

        &.pressed {
          color: var(--downvote);
          border-color: var(--downvote);
        }

        &.pressed {
          background-color: var(--downvote-bg);
        }
      }
    }
  }
}
</style>
