<template>
  <div class="sign-in-view">
    <SearchHeader />

    <main>
      <p>
        Don't have an account yet? <router-link :to="{ name: 'SignUp' }">Click here to sign up.</router-link>
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

        <button type="submit" @click="onSubmit">
          Sign in
        </button>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { SessionCreateParams } from "@/api/sessionService";
import { computed, ref } from "vue";
import SearchHeader from "@/components/SearchHeader.vue";
import { toastError } from "@/components/mixins/toasts";
import { catchHttpCode } from "@/lib/error-filters";
import { useRouter } from "vue-router";
import { useSessionStore } from "@/stores/session";
import { useNavigationStore } from "@/stores/navigation";

const sessionStore = useSessionStore();
const navigationStore = useNavigationStore();
const router = useRouter();

const form = ref({
  username: "",
  password: "",
});

const sessionCreateParams = computed((): SessionCreateParams => ({
  username: form.value.username,
  password: form.value.password,
}));

const onSubmit = (): void => {
  sessionStore.createSession(sessionCreateParams.value).then(() => {
    // toastSuccess(`Signed in as '${sessionStore.user.attributes.username}'.`);
    router.push(navigationStore.intendedDestination || { name: "Home" });
  }).catch(catchHttpCode(401, (error) => {
    toastError(error.message);
  })).catch((error) => {
    toastError("Unable to sign in.");
    console.error(error);
  });
};
</script>
