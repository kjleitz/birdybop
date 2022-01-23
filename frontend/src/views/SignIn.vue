<template>
  <div class="sign-in-view">
    <search-header />

    <main>
      <p>
        Don't have an account yet? <router-link :to="{ name: 'SignUp' }">Click here to sign up.</router-link>
      </p>

      <b-form @submit.prevent="onSubmit">
        <b-form-group label="Username" label-for="sign-in-username-input">
          <b-form-input
            v-model="form.username"
            id="sign-in-username-input"
            type="text"
            name="username"
            required
            autofocus
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Password" label-for="sign-in-password-input">
          <b-form-input
            v-model="form.password"
            id="sign-in-password-input"
            type="password"
            name="password"
            required
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">
          Sign in
        </b-button>
      </b-form>
    </main>
  </div>
</template>

<script lang="ts">
import { SessionCreateParams } from "@/api/sessionService";
import store from "@/store";
import {
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
} from "bootstrap-vue";
import Vue from "vue";
import SearchHeader from "@/components/SearchHeader.vue";
import { toastSuccess, toastError } from "@/components/mixins/toasts";
import { catchHttpCode } from "@/lib/error-filters";

export default Vue.extend({
  name: "SignIn",

  components: {
    BButton,
    BForm,
    BFormGroup,
    BFormInput,
    SearchHeader,
  },

  data() {
    return {
      form: {
        username: "",
        password: "",
      },
    };
  },

  computed: {
    sessionCreateParams(): SessionCreateParams {
      return {
        username: this.form.username,
        password: this.form.password,
      };
    },
  },

  methods: {
    toastSuccess,
    toastError,

    onSubmit(): void {
      store.dispatch("createSession", this.sessionCreateParams).then(() => {
        // this.toastSuccess(`Signed in as '${store.state.user.attributes.username}'.`);
        const { intendedDestination } = store.state;
        this.$router.push(intendedDestination || { name: "Home" });
      }).catch(catchHttpCode(401, (error) => {
        this.toastError(error.message);
      })).catch((error) => {
        this.toastError("Unable to sign in.");
        console.error(error);
      });
    },
  },
});
</script>
