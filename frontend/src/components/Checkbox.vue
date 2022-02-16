<template>
  <span :class="['checkbox', { right, left }]">
    <label>
      <slot v-if="right"></slot>
      <input
        type="checkbox"
        v-bind="$attrs"
        :checked="checked"
        @change.prevent="$emit('update:checked', ($event.target as HTMLInputElement).checked)"
      />
      <slot v-if="left"></slot>
    </label>
  </span>
</template>

<script lang="ts">
import { isA } from "@/lib/validators";
import { defineComponent } from "vue";

export default defineComponent({
  inheritAttrs: false,

  emits: {
    "update:checked": isA(Boolean),
  },

  props: {
    right: {
      type: Boolean,
      default: false,
    },

    checked: {
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

<style lang="scss">
.checkbox {
  display: inline-block;

  input[type="checkbox"] {
    display: inline-block;
    margin: 0;
    vertical-align: middle;
    cursor: pointer;
  }

  &.right {
    input[type="checkbox"] {
      margin-left: 0.25em;
    }
  }

  &.left {
    input[type="checkbox"] {
      margin-right: 0.25em;
    }
  }

  label {
    cursor: pointer;
  }
}
</style>
