<template>
  <div class="comment-editor">
    <form action="#" @submit.prevent="onSubmit">
      <textarea
        ref="$bodyInput"
        v-if="!previewing"
        v-model.trim="form.body"
        :autofocus="autofocus"
        :disabled="creatingComment"
        name="body"
        class="body-textarea"
        placeholder="Write something."
        required
        rows="3"
      ></textarea>
      <CommentBody
        v-else
        :body="form.body"
        class="preview"
      />

      <div class="actions">
        <button :disabled="!form.body" type="submit" @click.prevent="onSubmit">
          Submit
        </button>
        <button :disabled="!form.body" class="secondary" @click.prevent="previewing = !previewing">
          {{ previewing ? "Edit" : "Preview" }}
        </button>
        <button v-if="cancelable" href="#" class="secondary" @click.prevent="onCancel">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { CommentCreateParams } from '@/api/commentService';
import CommentBody from '@/components/CommentBody.vue';
import { isA } from '@/lib/validators';
import { useCommentsStore } from '@/stores/comments';
import type { CommentSection } from '@/types/Comment';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, type PropType } from 'vue';

const commentsStore = useCommentsStore();

const $bodyInput = ref<HTMLTextAreaElement>();

const props = defineProps({
  sourcePath: {
    type: String,
    required: true,
  },

  sourceUrl: {
    type: String,
    default: "",
  },

  parentId: {
    type: Number as PropType<number | null>,
    default: null,
  },

  autofocus: {
    type: Boolean,
    default: false,
  },

  cancelable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits({
  "saved": isA(Boolean),
  "cancel": null,
});

const previewing = ref(false);

const form = ref({
  body: "",
  section: "discussion" as CommentSection,
});

const { creatingComment } = storeToRefs(commentsStore);

const commentCreateParams = computed((): CommentCreateParams => ({
  body: form.value.body,
  parentId: props.parentId,
  section: form.value.section,
}));

onMounted(() => {
  if (props.autofocus && $bodyInput.value) $bodyInput.value.focus();
});

const onSubmit = (): void => {
  commentsStore.createComment(
    props.sourcePath,
    commentCreateParams.value,
    props.sourceUrl,
  ).then(() => {
    emit("saved", true);
    form.value.body = "";
  }).catch((error) => {
    emit("saved", false);
    console.error(error);
  });
};

const onCancel = (): void => {
  emit("cancel");
};
</script>

<style lang="scss">
.comment-editor {
  width: 100%;
  position: relative;

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    .body-textarea {
      width: 100%;
      resize: vertical;
      margin-bottom: 0.25rem; // TODO: this should be all textareas
    }

    .actions {
      padding: 0.25rem 0;

      > * {
        + * {
          margin-left: 0.5rem;
        }
      }
    }
  }

  .preview {
    margin-left: 0.5rem;
  }
}
</style>
