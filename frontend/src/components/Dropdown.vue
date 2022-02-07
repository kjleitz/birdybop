<template>
  <!--
    The `@keydown.enter` on this root-level `span` is for when an "enter" event
    bubbles from someone selecting one of the links in the dropdown (children of
    the menu) and you want it to close after the link's "clicked."
   -->
  <span
    :class="['dropdown', { right, left }]"
    @keydown.prevent.exact.up="focusPrevItem"
    @keydown.prevent.exact.down="focusNextItem"
    @keydown.esc="expanded = false"
    @keydown.enter="expanded && $nextTick(() => expanded = false)"
    @focusout="handleChildBlur"
  >
    <a
      ref="label"
      tabindex="0"
      href="#"
      :class="['label', { expanded, right, left }]"
      @click.prevent="expanded = !expanded"
      @keydown.prevent.exact.enter="expanded = !expanded"
    >
      <unicode-icon v-if="left" name="triangle-sm" :direction="expanded ? 'up' : 'down'" />
      <slot name="label"></slot>
      <unicode-icon v-if="right" name="triangle-sm" :direction="expanded ? 'up' : 'down'" />
    </a>
    <nav ref="menu" v-show="expanded" :class="['menu', { right, left }]">
      <slot name="items"></slot>
    </nav>
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import UnicodeIcon from "@/components/UnicodeIcon.vue";
import { bound } from "@/lib/utils";

export default Vue.extend({
  name: "Dropdown",

  components: {
    UnicodeIcon,
  },

  props: {
    right: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      expanded: false,
      focusIndex: -1,
    };
  },

  computed: {
    left(): boolean {
      return !this.right;
    },

    collapsed(): boolean {
      return !this.expanded;
    },
  },

  methods: {
    collapse(): void {
      this.expanded = false;
    },

    expand(): void {
      this.expanded = true;
    },

    focusItem(index: number): void {
      const $items = (this.$refs.menu as HTMLElement).children;
      this.focusIndex = bound(index, -1, $items.length - 1);

      if (this.focusIndex < 0) {
        if (this.expanded) this.collapse();
        (this.$refs.label as HTMLElement).focus();
      } else {
        if (this.collapsed) this.expand();
        const $item = $items[this.focusIndex] as HTMLElement;
        if ($item) $item.focus();
      }
    },

    focusPrevItem(): void {
      if (this.focusIndex > -1) this.focusIndex -= 1;

      this.focusItem(this.focusIndex);
    },

    focusNextItem(): void {
      if (!this.expanded) {
        this.expanded = true;
        this.$nextTick(() => this.focusItem(0));
      } else {
        this.focusItem(this.focusIndex + 1);
      }
    },

    // HOLY SHIT THIS WORKS SO WELL
    handleChildBlur(event: FocusEvent): void {
      const $newlyFocusedElement = event.relatedTarget as HTMLElement | null;
      const isChildOfThisElement = this.$el.contains($newlyFocusedElement);
      if (isChildOfThisElement) return;

      this.expanded = false;
    },
  },
});
</script>

<style lang="scss">
.dropdown {
  display: inline-block;
  position: relative;
  margin: 0 0.25rem;

  // &.right {
  //   margin-right: 0.25rem;
  // }

  // &.left {
  //   margin-left: 0.25rem;
  // }

  .menu {
    position: absolute;
    top: 100%;
    z-index: 10;
    border-left: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    border-right: 1px solid var(--border);
    padding: 0;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;

    &.right {
      right: 0;
    }

    &.left {
      left: 0;
    }

    > * {
      z-index: 11;
      width: 100%;
      padding: 0.25rem 1rem;
      margin: 0;
      display: inline-block;
      border: unset;
      border-radius: unset;
      background-color: inherit;
      border-bottom: 1px solid var(--border);

      &:last-of-type {
        border-bottom: 0;
      }

      &:focus, &:hover {
        background-color: var(--accent-bg);
      }
    }
  }

  .label {
    white-space: nowrap;
    display: inline-block;
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;

    &.expanded {
      &.right {
        border-right: 1px solid var(--border);
      }

      &.left {
        border-left: 1px solid var(--border);
      }
    }
  }
}
</style>
