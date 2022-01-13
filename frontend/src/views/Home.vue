<template>
  <div class="home-view">
    <section class="birdybop-search">
      <h1 class="logo">birdybop</h1>

      <div class="search-area">
        <b-input-group size="lg">
          <b-form-input
            type="search"
            placeholder="Search"
            autofocus
          ></b-form-input>

          <b-input-group-append>
            <b-button variant="primary"><b-icon-search /></b-button>
          </b-input-group-append>
        </b-input-group>
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
    <router-link :to="{ name: 'About' }">howdy</router-link>
    <a href="/foobar123">this should 404</a>
    <a href="https://www.example.com">external</a>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { BButton, BFormInput, BIconSearch, BInputGroup, BInputGroupAppend } from "bootstrap-vue";

export default Vue.extend({
  name: 'Home',
  components: {
    BFormInput,
    BInputGroup,
    BInputGroupAppend,
    BButton,
    BIconSearch,
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
      font-size: 8rem;
      font-family: Helvetica
    }

    .search-area {
      max-width: 640px;
      width: 100%;
    }
  }
}
</style>
