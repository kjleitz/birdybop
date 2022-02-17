<template>
  <div class="user-show-view">
    user show
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';

onMounted(() => { /* fetch user */ });
onBeforeRouteUpdate(() => { /* fetch user */ });
</script>
