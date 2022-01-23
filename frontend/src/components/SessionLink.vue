<template>
  <div class="session-link">
    <router-link v-if="!isLoggedIn" :to="{ name: 'SignIn' }">Sign in</router-link>
    <b-dropdown v-else :text="username" variant="link" right>
      <b-dropdown-item :to="{ name: 'UserShow' }">Profile</b-dropdown-item>
      <b-dropdown-divider />
      <b-dropdown-item @click.prevent="logOut">Sign out</b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script lang="ts">
import { toastError } from "@/components/mixins/toasts";
import store from "@/store";
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import {
  BDropdown,
  BDropdownItem,
  BDropdownDivider,
} from "bootstrap-vue";

export default Vue.extend({
  name: "SessionLink",

  components: {
    BDropdown,
    BDropdownItem,
    BDropdownDivider,
  },

  computed: {
    ...mapGetters(["isLoggedIn"]),

    username(): string {
      return store.state.user.attributes.username;
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
