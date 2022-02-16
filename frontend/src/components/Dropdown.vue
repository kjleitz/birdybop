<template>
  <!--
    The `@keydown.enter` on this root-level `span` is for when an "enter" event
    bubbles from someone selecting one of the links in the dropdown (children of
    the menu) and you want it to close after the link's "clicked."
   -->
  <span
    ref="$el"
    :class="['dropdown', { right, left }]"
    @keydown.prevent.exact.up="focusPrevItem"
    @keydown.prevent.exact.down="focusNextItem"
    @keydown.esc="expanded = false"
    @keydown.enter="expanded && $nextTick(() => expanded = false)"
    @focusout="handleChildBlur"
  >
    <a
      ref="$label"
      tabindex="0"
      href="#"
      :class="['label', { expanded, right, left }]"
      @click.prevent="expanded = !expanded"
      @keydown.prevent.exact.enter="expanded = !expanded"
    >
      <UnicodeIcon v-if="left" name="triangle-sm" :direction="triangleDirection" />
      <slot name="label"></slot>
      <UnicodeIcon v-if="right" name="triangle-sm" :direction="triangleDirection" />
    </a>
    <nav ref="$menu" v-show="expanded" :class="['menu', { right, left }]">
      <slot name="items"></slot>
    </nav>
  </span>
</template>

<script setup lang="ts">
import UnicodeIcon from "@/components/UnicodeIcon.vue";
import { bound } from "@/lib/utils";
import { computed, nextTick, ref } from "vue";

// PROPS

const props = defineProps({
  right: {
    type: Boolean,
    default: false,
  },
});

// REFS

const $el = ref<HTMLSpanElement>();
const $menu = ref<HTMLElement>();
const $label = ref<HTMLAnchorElement>();

// DATA

const expanded = ref(false);
const focusIndex = ref(-1);

// COMPUTED

const left = computed(() => !props.right);
const collapsed = computed(() => !expanded.value);
const triangleDirection = computed(() => expanded.value ? "up" : "down");

// METHODS

const collapse = (): void => {
  expanded.value = false;
};

const expand = (): void => {
  expanded.value = true;
};

const focusItem = (index: number): void => {
  const $items = $menu.value?.children;
  if (!$items) return;

  focusIndex.value = bound(index, -1, $items.length - 1);

  if (focusIndex.value < 0) {
    if (expanded.value) collapse();
    $label.value?.focus();
  } else {
    if (collapsed.value) expand();
    const $item = $items[focusIndex.value] as HTMLElement;
    if ($item) $item.focus();
  }
};

const focusPrevItem = (): void => {
  if (focusIndex.value > -1) focusIndex.value -= 1;

  focusItem(focusIndex.value);
};

const focusNextItem = (): void => {
  if (!expanded.value) {
    expanded.value = true;
    nextTick(() => focusItem(0));
  } else {
    focusItem(focusIndex.value + 1);
  }
};

// HOLY SHIT THIS WORKS SO WELL
const handleChildBlur = (event: FocusEvent): void => {
  const $newlyFocusedElement = event.relatedTarget as HTMLElement | null;
  const isChildOfThisElement = $el.value?.contains($newlyFocusedElement);
  if (isChildOfThisElement) return;

  expanded.value = false;
};
</script>

<style lang="scss">
.dropdown {
  display: inline-block;
  position: relative;
  // margin: 0 0.25rem;

  &.right {
    margin-right: 0.5rem;
  }

  &.left {
    margin-left: 0.5rem;
  }

  .menu {
    position: absolute;
    top: 100%;
    z-index: 10;
    border-left: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    border-right: 1px solid var(--border);
    padding: 0;
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);

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
      white-space: nowrap;

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
