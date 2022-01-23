<template>
  <div class="loading-splash">
    <div class="loading-indicator">
      <div class="semicircle semi1"></div>
      <div class="semicircle semi2"></div>
      <div class="mask"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: "LoadingSplash",
});
</script>

<style lang="scss">
$spinner-width: 0.25rem;
$spinner-color: #d4d4d4;

@keyframes dizzy-spin {
  0% {
    transform: rotate(0deg);
    opacity: 0;
  }
  2% {
    opacity: 1;
  }
  98% {
    opacity: 1;
  }
  100% {
    transform: rotate(360deg);
    opacity: 0;
  }
}

@keyframes rotate-semi1 {
  0% {
    transform: rotate(0deg);
    // border-width: 0rem;
  }
  25% {
    transform: rotate(180deg);
  }
  50% {
    transform: rotate(180deg);
    // border-width: $spinner-width;
  }
  75% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(540deg);
    // border-width: 0rem;
  }
}

@keyframes rotate-semi2 {
  0% {
    transform: rotate(0deg);
    // border-width: 0rem;
  }
  25% {
    transform: rotate(180deg);
  }
  50% {
    transform: rotate(360deg);
    // border-width: $spinner-width;
  }
  75% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(540deg);
    // border-width: 0rem;
  }
}

@keyframes appear-mask {
  0% {
    transform: rotate(0deg) scale(1.1);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1.1);
    opacity: 1;
  }
  50% {
    transform: rotate(0deg) scale(1.1);
    opacity: 0;
  }
  75% {
    transform: rotate(180deg) scale(1.1);
    opacity: 0;
  }
  100% {
    transform: rotate(180deg) scale(1.1);
    opacity: 1;
  }
}

.loading-splash {
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  .loading-indicator {
    position: relative;
    width: 4rem;
    height: 4rem;

    transform-origin: center;
    animation-name: dizzy-spin;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-direction: normal;
    animation-timing-function: ease;
    // animation-timing-function: linear;

    .mask, .semicircle {
      position: absolute;
      top: 0;
      left: 0;
      transform-origin: center right;
      animation-duration: 2s;
      animation-iteration-count: infinite;
      animation-direction: normal;
      animation-timing-function: linear;
      width: 50%;
      height: 100%;
      border-top-left-radius: 100% 50%;
      border-bottom-left-radius: 100% 50%;
    }

    .mask {
      background-color: white;
      border: $spinner-width solid white;
      animation-timing-function: step-start;
      z-index: 10;
      animation-name: appear-mask;
    }

    .semicircle {
      z-index: 0;
      background-color: transparent;
      border-left: $spinner-width solid $spinner-color;
      border-top: $spinner-width solid $spinner-color;
      border-right: $spinner-width solid transparent;
      border-bottom: $spinner-width solid $spinner-color;

      &.semi1 {
        animation-name: rotate-semi1;
      }

      &.semi2 {
        animation-name: rotate-semi2;
      }

      &.semi3 {
        animation-name: rotate-semi3;
      }

      &.semi4 {
        animation-name: rotate-semi4;
      }
    }
  }
}
</style>
