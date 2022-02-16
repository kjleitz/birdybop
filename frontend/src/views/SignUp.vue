<template>
  <div class="sign-up-view">
    <SearchHeader />

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
    </main>
  </div>
</template>

<script setup lang="ts">
import type { UserCreateParams } from "@/api/userService";
import { ref, computed } from "vue";
import SearchHeader from "@/components/SearchHeader.vue";
import { catchHttpCode } from "@/lib/error-filters";
import { toastError } from "@/components/mixins/toasts";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useNavigationStore } from "@/stores/navigation";

const userStore = useUserStore();
const navigationStore = useNavigationStore();
const router = useRouter();

const form = ref({
  username: "",
  password: "",
  bio: "",
});

const userCreateParams = computed((): UserCreateParams => ({
  username: form.value.username,
  password: form.value.password,
  bio: form.value.bio,
}));

const onSubmit = (): void => {
  userStore.createUser(userCreateParams.value).then(() => {
    // toastSuccess(`Signed up as ${userStore.user.attributes.username}.`);
    router.push(navigationStore.intendedDestination || { name: "Home" });
  }).catch(catchHttpCode(401, (error) => {
    toastError(error.message);
  })).catch((error) => {
    toastError("Unable to log in.");
    console.error(error);
  });
};
</script>
