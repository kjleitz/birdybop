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


      <!-- <b-form @submit.prevent="createSource">
        <b-form-group label="Name" label-for="source-name-input">
          <b-form-input
            v-model="form.name"
            id="source-name-input"
            type="text"
            name="name"
            placeholder="Some Website"
            required
            autofocus
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Path" label-for="source-path-input">
          <b-form-input
            v-model="form.path"
            id="source-path-input"
            type="text"
            name="path"
            placeholder="https://some.website/community/knowledge"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Description" label-for="source-description-input">
          <b-form-textarea
            v-model="form.description"
            id="source-description-input"
            type="text"
            name="description"
            placeholder="Some Website collects community-submitted knowledge from users across the world."
            required
          ></b-form-textarea>
        </b-form-group>

        <b-button type="submit" variant="primary">
          Add source to Birdybop
        </b-button>
      </b-form> -->
    </main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
// import {
//   BButton,
//   BForm,
//   BFormGroup,
//   BFormInput,
//   BFormTextarea,
// } from "bootstrap-vue";
import store from "@/store";
import { SourceCreateParams } from "@/api/sourceService";
import { catchHttpCode } from "@/lib/error-filters";
import { toastError, toastSuccess } from "@/components/mixins/toasts";

export default Vue.extend({
  name: "SourcesNew",

  components: {
    // BButton,
    // BForm,
    // BFormGroup,
    // BFormInput,
    // BFormTextarea,
  },

  data() {
    return {
      form: {
        name: "",
        path: "",
        description: "",
      },
    };
  },

  computed: {
    sourceCreateParams(): SourceCreateParams {
      return {
        name: this.form.name.trim(),
        path: this.form.path.trim(),
        description: this.form.description.trim(),
      };
    },
  },

  methods: {
    toastError,
    toastSuccess,

    createSource(): void {
      store.dispatch("createSource", this.sourceCreateParams).then(() => {
        // this.toastSuccess(`Created source '${this.sourceCreateParams.name}'.`);
        this.$router.push({ name: "SourcesIndex" });
      }).catch(catchHttpCode(401, (error) => {
        this.toastError(error.message);
      })).catch(catchHttpCode(403, (error) => {
        this.toastError(error.message);
      })).catch(catchHttpCode(422, (error) => {
        this.toastError(error.message);
      })).catch((error) => {
        this.toastError("Failed to create source.");
        console.error(error);
      });
    },
  },
});
</script>
