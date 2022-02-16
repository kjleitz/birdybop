<template>
  <div class="sources-view">
    <SearchHeader />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import SearchHeader from "@/components/SearchHeader.vue";
</script>
