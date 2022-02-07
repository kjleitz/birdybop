<template>
  <div class="sign-up-view">
    <search-header />

    <main>
      <p>
        Already have an account? <router-link :to="{ name: 'SignIn' }">Click here to sign in.</router-link>
      </p>

      <form action="#" @submit.prevent="onSubmit">
        <label>
          Username
          <input
            v-model="form.username"
            type="text"
            name="username"
            required
            autofocus
          />
        </label>

        <label>
          Password
          <input
            v-model="form.password"
            type="password"
            name="password"
            required
          />
        </label>

        <label>
          Bio
          <textarea
            v-model="form.bio"
            name="bio"
            placeholder="Tell us about yourself."
            required
          ></textarea>
        </label>

        <button type="submit" @click="onSubmit">
          Sign up
        </button>
      </form>

      <!-- <b-form @submit.prevent="onSubmit">
        <b-form-group label="Username" label-for="sign-up-username-input">
          <b-form-input
            v-model="form.username"
            id="sign-up-username-input"
            type="text"
            name="username"
            required
            autofocus
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Password" label-for="sign-up-password-input">
          <b-form-input
            v-model="form.password"
            id="sign-up-password-input"
            type="password"
            name="password"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Bio" label-for="sign-up-bio-input">
          <b-form-textarea
            v-model="form.bio"
            id="sign-up-bio-input"
            name="bio"
          ></b-form-textarea>
        </b-form-group>

        <b-button type="submit" variant="primary">
          Sign up
        </b-button>
      </b-form> -->
    </main>
  </div>
</template>

<script lang="ts">
import { UserCreateParams } from "@/api/userService";
import store from "@/store";
// import {
//   BButton,
//   BForm,
//   BFormGroup,
//   BFormInput,
//   BFormTextarea,
// } from "bootstrap-vue";
import Vue from "vue";
import SearchHeader from "@/components/SearchHeader.vue";
import { catchHttpCode } from "@/lib/error-filters";
import { toastSuccess, toastError } from "@/components/mixins/toasts";

export default Vue.extend({
  name: "SignUp",

  components: {
    // BButton,
    // BForm,
    // BFormGroup,
    // BFormInput,
    // BFormTextarea,
    SearchHeader,
  },

  data() {
    return {
      form: {
        username: "",
        password: "",
        bio: "",
      },
    };
  },

  computed: {
    userCreateParams(): UserCreateParams {
      return {
        username: this.form.username,
        password: this.form.password,
        bio: this.form.bio,
      };
    },
  },

  methods: {
    toastSuccess,
    toastError,

    onSubmit(): void {
      store.dispatch("createUser", this.userCreateParams).then(() => {
        // this.toastSuccess(`Signed up as ${store.state.user.attributes.username}.`);
        const { intendedDestination } = store.state;
        this.$router.push(intendedDestination || { name: "Home" });
      }).catch(catchHttpCode(401, (error) => {
        this.toastError(error.message);
      })).catch((error) => {
        this.toastError("Unable to log in.");
        console.error(error);
      });
    },
  },
});
</script>
