<template>
  <div class="session-link">
    <router-link v-if="!isLoggedIn" :to="{ name: 'SignIn' }">Sign in</router-link>
    <dropdown v-else right>
      <template #label>{{ username }}</template>
      <template #items>
        <a href="#">foobar1</a>
        <a href="#">foobar2</a>
        <a href="#">foobar3</a>
      </template>
    </dropdown>
    <checkbox v-model="darkMode">dark</checkbox>
  </div>
</template>

<script lang="ts">
import { toastError } from "@/components/mixins/toasts";
import store from "@/store";
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
// import {
//   BDropdown,
//   BDropdownItem,
//   BDropdownDivider,
// } from "bootstrap-vue";
import Checkbox from "@/components/Checkbox.vue";
import Dropdown from "@/components/Dropdown.vue";

export default Vue.extend({
  name: "SessionLink",

  components: {
    // BDropdown,
    // BDropdownItem,
    // BDropdownDivider,
    Checkbox,
    Dropdown,
  },

  data() {
    return {
      darkMode: store.state.darkMode,
    };
  },

  computed: {
    ...mapGetters(["isLoggedIn"]),

    username(): string {
      return store.state.user.attributes.username;
    },

    userId(): string {
      return store.state.user.id;
    },
  },

  watch: {
    darkMode(newVal: boolean, _oldVal: boolean): void {
      store.commit("setDarkMode", newVal);
    },
  },

  methods: {
    ...mapActions(["deleteSession"]),

    toastError,

    logOut(): void {
      this.deleteSession().catch((error) => {
        this.toastError(error.message);
      });
    },
  },
});
</script>

<style lang="scss">
.session-link {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0.25rem 1rem;
}
</style>
