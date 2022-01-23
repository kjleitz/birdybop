<template>
  <div class="home-view">
    <session-link class="session-link" />
    <!-- <div class="top-nav">
      <router-link v-if="!loggedIn" :to="{ name: 'SignIn' }">Sign in</router-link>
      <b-dropdown v-else :text="username" variant="link" right>
        <b-dropdown-item :to="{ name: 'UserShow' }">Profile</b-dropdown-item>
        <b-dropdown-divider />
        <b-dropdown-item @click.prevent="logOut">Sign out</b-dropdown-item>
      </b-dropdown>
    </div> -->

    <section class="birdybop-search">
      <logo class="logo"/>
      <div class="search-area">
        <search-bar class="search-bar"/>
      </div>
    </section>
    <!-- TODO: remove -->
    <!-- TODO: remove -->
    <!-- TODO: remove -->
    <!-- TODO: remove -->
    <!-- TODO: remove -->
    <!-- TODO: remove -->
    <!-- TODO: remove -->
    <!-- TODO: remove -->
    <!-- TODO: remove -->
    <!-- TODO: remove -->
    <!-- TODO: remove -->
    <!-- TODO: remove -->
    <!-- TODO: remove -->
    <!-- TODO: remove -->
    <!-- TODO: remove -->
    <!-- <router-link :to="{ name: 'About' }">howdy</router-link>
    <a href="/foobar123">this should 404</a>
    <a href="https://www.example.com">external</a> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Logo from "@/components/Logo.vue";
import SearchBar from "@/components/SearchBar.vue";
// import store from "@/store";
// import { toastSuccess } from "@/components/mixins/toasts";
// import {
//   BDropdown,
//   BDropdownItem,
//   BDropdownDivider,
// } from "bootstrap-vue";
import SessionLink from "@/components/SessionLink.vue";

export default Vue.extend({
  name: 'Home',

  components: {
    // BDropdown,
    // BDropdownItem,
    // BDropdownDivider,
    Logo,
    SearchBar,
    SessionLink,
  },

  computed: {
    // loggedIn(): boolean {
    //   return store.getters.isLoggedIn;
    // },

    // username(): string {
    //   return store.state.user.attributes.username;
    // },
  },

  methods: {
    // toastSuccess,

    // logOut(): void {
    //   store.dispatch("deleteSession").then(() => {
    //     this.toastSuccess("Logged out.");
    //   });
    // },
  },
});
</script>

<style lang="scss">
.home-view {
  position: relative;
  width: 100%;

  .birdybop-search {
    position: absolute;
    top: 50vh;
    left: 0;
    width: 100%;
    transform: translateY(-100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    .logo {
      font-size: 4rem;

      @media (min-width: 640px) {
        font-size: 8rem;
      }
    }

    .search-area {
      max-width: 640px;
      width: 100%;
      padding: 0 2rem;

      .search-bar {
        width: 100%;
      }
    }
  }
}
</style>
