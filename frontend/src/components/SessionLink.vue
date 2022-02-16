<template>
  <div class="session-link">
    <!-- <Checkbox v-model="darkMode">dark</Checkbox> -->
    <Checkbox v-model:checked="darkMode">dark</Checkbox>
    <router-link v-if="!isLoggedIn" :to="{ name: 'SignIn' }">Sign in</router-link>
    <Dropdown v-else right>
      <template #label>{{ username }}</template>
      <template #items>
        <a href="#">foobar1</a>
        <a href="#">foobar2</a>
        <a href="#" @click.prevent="logOut">Sign out</a>
      </template>
    </Dropdown>
    <!-- <nav>
      <a href="#" class="light">light</a>
      <button href="#" class="dark">dark</button>
      <button href="#" class="auto">auto</button>
    </nav> -->
  </div>
</template>

<script setup lang="ts">
import { toastError } from "@/components/mixins/toasts";
import { computed, ref, watch } from "vue";
import Checkbox from "@/components/Checkbox.vue";
import Dropdown from "@/components/Dropdown.vue";
import { usePreferencesStore } from "@/stores/preferences";
import { useSessionStore } from "@/stores/session";
import { useUserStore } from "@/stores/user";

const preferencesStore = usePreferencesStore();
const sessionStore = useSessionStore();
const userStore = useUserStore();

const darkMode = ref(preferencesStore.darkMode);

const isLoggedIn = computed(() => sessionStore.isLoggedIn);
const username = computed(() => userStore.user.attributes.username);
// const userId = computed(() => store.user.id);

watch(darkMode, (newVal, _oldVal) => preferencesStore.setDarkMode(newVal));

const deleteSession = () => sessionStore.deleteSession();
const logOut = () => deleteSession().catch((error) => toastError(error.message));
</script>

<style lang="scss">
.session-link {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0.25rem 1rem;

  * + * {
    margin-left: 1rem;
  }
}
</style>
