<template>
  <article class="link-card">
    <div class="vote-area">
      <!-- <b-button
        :pressed.sync="upvotePressed"
        size="sm"
        variant="outline-success"
        class="upvote"
        @click="$emit('upvote-clicked')"
      >
        <b-icon-caret-up-fill />
      </b-button> -->
      <button
        :class="['upvote', { pressed: upvoted }]"
        @click="$emit('upvote-clicked')"
      >
        &#x2303;
      </button>
      <span class="karma">{{ karma }}</span>
      <!-- <b-button
        :pressed.sync="downvotePressed"
        size="sm"
        variant="outline-success"
        class="downvote"
        @click="$emit('downvote-clicked')"
      >
        <b-icon-caret-down-fill />
      </b-button> -->
      <button
        :class="['downvote', { pressed: downvoted }]"
        @click="$emit('downvote-clicked')"
      >
        &#x2304;
      </button>
    </div>
    <div class="info-area">
      <a :href="url" class="link-url">{{ url }}</a>
      <a :href="url" class="link-title">{{ title }}</a>
      <p class="link-description">{{ description }}</p>
      <div class="links-area">
        <slot name="links"></slot>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import Vue from "vue";
// import {
//   BButton,
//   BIconCaretDownFill,
//   BIconCaretUpFill,
// } from "bootstrap-vue";

export default Vue.extend({
  name: "LinkCard",

  components: {
    // BButton,
    // BIconCaretDownFill,
    // BIconCaretUpFill,
  },

  props: {
    karma: {
      type: Number,
      default: 0,
    },

    url: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    upvoted: {
      type: Boolean,
      default: false,
    },

    downvoted: {
      type: Boolean,
      default: false,
    },
  },

  // data() {
  //   return {
  //     upvotePressed: this.upvoted,
  //     downvotePressed: this.downvoted,
  //   };
  // },

  // watch: {
  //   upvoted(newVal: boolean, oldVal: boolean): void {
  //     if (newVal !== oldVal && newVal !== this.upvotePressed) this.upvotePressed = newVal;
  //   },

  //   downvoted(newVal: boolean, oldVal: boolean): void {
  //     if (newVal !== oldVal && newVal !== this.downvotePressed) this.downvotePressed = newVal;
  //   },

  //   upvotePressed(newVal: boolean, oldVal: boolean): void {
  //     if (newVal !== oldVal && newVal !== this.upvoted) this.$emit("update:upvoted", newVal);
  //   },

  //   downvotePressed(newVal: boolean, oldVal: boolean): void {
  //     if (newVal !== oldVal && newVal !== this.downvoted) this.$emit("update:downvoted", newVal);
  //   },
  // },
});
</script>

<style lang="scss">
.link-card {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 1rem;

  .vote-area {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 3rem;

    .upvote {
      &.pressed {
        color: orangered;
      }
    }

    .downvote {
      &.pressed {
        color: slateblue;
      }
    }
  }

  .info-area {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }

  .link-url {
    color: #555;
    font-size: 0.875em;
    line-height: 1;
  }

  .link-title {
    font-size: 1.25em;
  }

  .link-description {
    // color: #333;
  }
}
</style>
