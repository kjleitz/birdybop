<template>
  <span :class="['unicode-icon', `unicode-icon-${name}`]">
    <span class="glyph" v-html="code" :style="glyphStyle"></span>
  </span>
</template>

<script lang="ts">
export type Direction = "up" | "down" | "left" | "right";

// for rotating
const DIRECTION_ROTATE_DEGREES = {
  up: 0,
  right: 90,
  down: 180,
  left: 270,
} as Record<Direction, number>;

type Glyph = string | {
  code: string;
  orientation: Direction;
};

const GLYPHS: Record<string, Glyph> = {
  // "symbol-name": "<unicode>",
  // "symbol-name": { code: "<unicode>", orientation: "<direction it's already rotated>" },
  "arrowhead": "&#x2B9D;",
  "bullet": "&bull;",
  "caret": "&#x2303;",
  "fat-arrow": "&#129093;",
  "interpunct": "&middot;",
  "magnifying-glass": "&#x26B2;",
  "triangle-lg": "&#9650;",
  // "triangle-lg": "&#25B2;",
  "triangle-sm": { code: "&#x1F892;", orientation: "right" },
};
</script>

<script setup lang="ts">
import { computed, type PropType, type StyleValue } from "vue";

const props = defineProps({
  name: {
    type: String as PropType<keyof typeof GLYPHS>,
    required: true,
  },

  direction: {
    type: String as PropType<Direction>,
    default: "up",
  },

  rotateDegrees: {
    type: Number,
    default: 0,
  },

  mirror: {
    type: Boolean,
    default: false,
  },

  //// TODO: spinning
  // spinRpm: {
  //   type: Number,
  //   default: 0,
  // },
});

const glyph = computed(() => GLYPHS[props.name]);

const code = computed(() => typeof glyph.value === "string" ? glyph.value : glyph.value.code);

const nativeOrientation = computed(() => typeof glyph.value === "string" ? "up" : glyph.value.orientation);

const uprightRotation = computed((): number => {
  const alreadyRotated = DIRECTION_ROTATE_DEGREES[nativeOrientation.value] || 0;
  return 360 - alreadyRotated;
});

const directionRotation = computed(() => DIRECTION_ROTATE_DEGREES[props.direction] || 0);

const finalRotation = computed((): number => {
  const degrees = uprightRotation.value + directionRotation.value + props.rotateDegrees;
  return Math.round(degrees) % 360;
});

const transformRule = computed((): string => {
  const degrees = finalRotation.value;
  const rotate = degrees === 0 ? "" : `rotate(${degrees}deg)`;
  const scale = props.mirror ? " scale(-1, 1)" : "";
  return `${rotate}${scale}`;
});

const glyphStyle = computed((): StyleValue => {
  const transform = transformRule.value;
  return transform ? { transform } : {};
});
</script>

<style lang="scss">
.unicode-icon {
  .glyph {
    display: inline-block;
    width: 1em;
    height: 1em;
    line-height: 1em;
    text-align: center;
    font-family: Arial;
  }
}
</style>
