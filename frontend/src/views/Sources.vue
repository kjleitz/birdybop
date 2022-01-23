<template>
  <div class="sources-view">
    <search-header />
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SearchHeader from "@/components/SearchHeader.vue";

export default Vue.extend({
  name: "Sources",

  components: {
    SearchHeader,
  },
});
</script>
