<template>
  <div class="sources-new-view">
    <main>
      <p>
        Add a source website (or section of a website) for searches. It will be
        crawled shortly, and become available for voting and discussion by other
        Birdybop users.
      </p>

      <form action="#" @submit.prevent="createSource">
        <label>
          Name
          <input
            v-model="form.name"
            type="text"
            name="name"
            placeholder="Some Website"
            required
            autofocus
          />
        </label>

        <label>
          Path
          <input
            v-model="form.path"
            type="text"
            name="path"
            placeholder="https://some.website/community/knowledge"
            required
          />
        </label>

        <label>
          Description
          <textarea
            v-model="form.description"
            name="description"
            placeholder="Some Website collects community-submitted knowledge from users across the world."
            required
          ></textarea>
        </label>

        <button type="submit" @click="createSource">
          Add source to Birdybop
        </button>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { catchHttpCode } from "@/lib/error-filters";
import { toastError } from "@/components/mixins/toasts";
import { useRouter } from "vue-router";
import { useSourcesStore } from "@/stores/sources";

const sourcesStore = useSourcesStore();
const router = useRouter();

const form = ref({
  name: "",
  path: "",
  description: "",
});

const sourceCreateParams = computed(() => ({
  name: form.value.name.trim(),
  path: form.value.path.trim(),
  description: form.value.description.trim(),
}));

const createSource = (): void => {
  sourcesStore.createSource(sourceCreateParams.value).then(() => {
    // toastSuccess(`Created source '${sourceCreateParams.value.name}'.`);
    router.push({ name: "SourcesIndex" });
  }).catch(catchHttpCode(401, (error) => {
    toastError(error.message);
  })).catch(catchHttpCode(403, (error) => {
    toastError(error.message);
  })).catch(catchHttpCode(422, (error) => {
    toastError(error.message);
  })).catch((error) => {
    toastError("Failed to create source.");
    console.error(error);
  });
};
</script>
