<template>
  <span class="unicode-icon">
    <span class="glyph" v-html="code" :style="glyphStyle"></span>
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

const enum Direction {
  Up = "up",
  Right = "right",
  Down = "down",
  Left = "left",
}

// for rotating
const DIRECTION_ROTATE_DEGREES = {
  [Direction.Up]: 0,
  [Direction.Right]: 90,
  [Direction.Down]: 180,
  [Direction.Left]: 270,
} as const;

type Glyph = string | {
  code: string;
  orientation: Direction;
};

const GLYPHS = {
  // "symbol-name": "<unicode>",
  // "symbol-name": { code: "<unicode>", orientation: "<direction it's already rotated>" },
  "caret": "&#x2303;",
  "arrowhead": "&#x2B9D;",
  "triangle-sm": { code: "&#x1F892;", orientation: Direction.Right },
} as const;

export default Vue.extend({
  name: "UnicodeIcon",

  props: {
    name: {
      type: String as PropType<keyof typeof GLYPHS>,
      required: true,
    },

    direction: {
      type: String as PropType<Direction>,
      default: Direction.Up,
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
  },

  computed: {
    glyph(): Glyph {
      return GLYPHS[this.name];
    },

    code(): string {
      return typeof this.glyph === "string" ? this.glyph : this.glyph.code;
    },

    nativeOrientation(): Direction {
      return typeof this.glyph === "string" ? Direction.Up : this.glyph.orientation;
    },

    uprightRotation(): number {
      const alreadyRotated = (DIRECTION_ROTATE_DEGREES[this.nativeOrientation] || 0);
      return 360 - alreadyRotated;
    },

    directionRotation(): number {
      return DIRECTION_ROTATE_DEGREES[this.direction] || 0;
    },

    finalRotation(): number {
      const degrees = this.uprightRotation + this.directionRotation + this.rotateDegrees;
      return Math.round(degrees) % 360;
    },

    scaleX(): number {
      return this.mirror ? -1 : 1;
    },

    transformRule(): string {
      const degrees = this.finalRotation;
      const rotate = degrees === 0 ? "" : `rotate(${degrees}deg)`;
      const scale = this.mirror ? " scale(-1, 1)" : "";
      return `${rotate}${scale}`;
    },

    glyphStyle(): Partial<CSSStyleDeclaration> {
      const transform = this.transformRule;
      return transform ? { transform } : {};
    },
  },
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
  }
}
</style>
