<template>
  <!-- <article class="source-card">
    <div class="vote-area">
      <button class="upvote">^</button>
      <span class="karma">{{ source.attributes.karma }}</span>
      <button class="downvote">v</button>
    </div>
    <div class="info-area">
      <a :href="source.attributes.path" class="source-path">{{ source.attributes.path }}</a>
      <a :href="source.attributes.path" class="source-title">{{ source.attributes.name }}</a>
      <p class="source-text">{{ source.attributes.description }}</p>
      <div class="actions">
        <router-link
          :to="{ name: 'SourceCommentsIndex', params: { sourceId: source.id } }"
          class="source-comments"
        >
          {{ source.attributes.commentsCount }} comments
        </router-link>
      </div>
    </div>
  </article> -->
  <link-card
    :karma="source.attributes.karma"
    :url="source.attributes.path"
    :title="source.attributes.name"
    :description="source.attributes.description"
    :upvoted.sync="foobarUp"
    :downvoted.sync="foobarDown"
    class="source-card"
    @upvote-clicked="onUpvoteClicked"
    @downvote-clicked="onDownvoteClicked"
  >
    <template #links>
      <router-link
        :to="{ name: 'SourceCommentsIndex', params: { sourceId: source.id } }"
        class="source-comments"
      >
        {{ source.attributes.commentsCount }} comments
      </router-link>
    </template>
  </link-card>
  <!-- <b-card class="source-card">
    <div class="vote-area">
      <button class="upvote">^</button>
      <span class="karma">{{ source.attributes.karma }}</span>
      <button class="downvote">v</button>
    </div>
    <b-card-body class="info-area">
      <b-card-title>{{ source.attributes.name }}</b-card-title>
      <b-card-sub-title>{{ source.attributes.path }}</b-card-sub-title>
      <b-card-text>{{ source.attributes.description }}</b-card-text>
      <router-link
        :to="{ name: 'SourceCommentsIndex', params: { sourceId: source.id } }"
        class="source-comments"
      >
        {{ source.attributes.commentsCount }} comments
      </router-link>
    </b-card-body>
  </b-card> -->
</template>

<script lang="ts">
import Source from "@/types/Source";
import Vue, { PropType } from "vue";
// import {
//   BCard,
//   BCardBody,
//   BCardTitle,
//   BCardSubTitle,
//   BCardText,
// } from "bootstrap-vue";
import LinkCard from "@/components/LinkCard.vue";

export default Vue.extend({
  name: "SourceCard",

  components: {
    // BCard,
    // BCardBody,
    // BCardTitle,
    // BCardSubTitle,
    // BCardText,
    LinkCard,
  },

  props: {
    source: {
      type: Object as PropType<Source>,
      required: true,
    },
  },

  data() {
    return {
      // TODO: these should be from the source meta, and should alter the source
      // TODO: these should be from the source meta, and should alter the source
      // TODO: these should be from the source meta, and should alter the source
      // TODO: these should be from the source meta, and should alter the source
      // TODO: these should be from the source meta, and should alter the source
      // TODO: these should be from the source meta, and should alter the source
      // TODO: these should be from the source meta, and should alter the source
      // TODO: these should be from the source meta, and should alter the source
      // TODO: these should be from the source meta, and should alter the source
      // TODO: these should be from the source meta, and should alter the source
      // TODO: these should be from the source meta, and should alter the source
      // TODO: these should be from the source meta, and should alter the source
      // TODO: these should be from the source meta, and should alter the source
      // TODO: these should be from the source meta, and should alter the source
      // TODO: these should be from the source meta, and should alter the source
      // TODO: these should be from the source meta, and should alter the source
      // TODO: these should be from the source meta, and should alter the source
      foobarUp: false,
      foobarDown: false,
    };
  },

  methods: {
    onUpvoteClicked(): void {

    },

    onDownvoteClicked(): void {

    },
  },
});
</script>

<style lang="scss">
.source-card {
  // display: flex;
  // flex-direction: row;
  // justify-content: flex-start;
  // align-items: stretch;

  // .vote-area {
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: center;
  //   align-items: center;
  //   width: 3rem;
  // }

  // .info-area {
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: space-between;
  //   align-items: flex-start;
  // }
}
</style>
