<template>
  <span class="checkbox">
    <label>
      <slot v-if="right"></slot>
      <input type="checkbox" v-bind="$attrs" v-on="$listeners"/>
      <slot v-if="left"></slot>
    </label>
  </span>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    right: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    left(): boolean {
      return !this.right;
    },
  },
});
</script>
