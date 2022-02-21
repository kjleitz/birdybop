import type Comment from "@/types/Comment";
import { createComment, createCommentVote, deleteCommentVote, fetchComment, fetchComments, type CommentCreateParams } from "@/api/commentService";
import { encodeUriComponentBase64 } from "@/lib/encoding-utils";
import { useCollectionsStore } from "@/stores/collections";
import { defineStore } from "pinia";
import { useSourcesStore } from "@/stores/sources";
import type CommentVote from "@/types/CommentVote";
import { createInitialUserUpvote } from "@/lib/comment-utils";
import { useUserStore } from "@/stores/user";

export const useCommentsStore = defineStore("comments", {
  state: () => ({
    loadingComment: false,
    loadingComments: false,
    creatingComment: false,
  }),

  getters: {
    childrenOf(): (parentComment: Comment) => Comment[] {
      const collectionsStore = useCollectionsStore();

      return (parentComment) => {
        const id = parseInt(parentComment.id, 10);

        return collectionsStore
          .collections
          .comment
          .filter(({ attributes: { parentId } }) => id === parentId);
      };
    },

    commentVoteState(): (commentId: string | number) => boolean | null {
      const collectionsStore = useCollectionsStore();

      return (commentId) => {
        const id = typeof commentId === "number" ? commentId : parseInt(commentId, 10);
        const vote = collectionsStore
          .collections
          .commentVote
          .find(({ attributes: { commentId } }) => id === commentId);

        return vote?.attributes.upvote ?? null;
      };
    },
  },

  actions: {
    setLoadingComment(loadingComment: boolean): void {
      this.loadingComment = loadingComment;
    },

    setLoadingComments(loadingComments: boolean): void {
      this.loadingComments = loadingComments;
    },

    setCreatingComment(creatingComment: boolean): void {
      this.creatingComment = creatingComment;
    },

    fetchComments(sourcePath: string): Promise<void> {
      this.setLoadingComments(true);
      const collectionsStore = useCollectionsStore();
      const encodedSourcePath = encodeUriComponentBase64(sourcePath);
      collectionsStore.clearCollection("comment");
      return fetchComments(encodedSourcePath).then((response) => {
        collectionsStore.addToCollection(response.data);
        const commentVotes = response.meta.currentUserCommentVotes;
        if (commentVotes) collectionsStore.addToCollection(commentVotes.data);
      }).finally(() => {
        this.setLoadingComments(false);
      });
    },

    fetchComment(id: string): Promise<void> {
      this.setLoadingComment(true);
      const collectionsStore = useCollectionsStore();
      return fetchComment(id).then((comment) => {
        collectionsStore.addToCollection(comment);
      }).finally(() => {
        this.setLoadingComment(false);
      });
    },

    createComment(sourcePath: string, params: CommentCreateParams): Promise<void> {
      this.setCreatingComment(true);
      const collectionsStore = useCollectionsStore();
      const userStore = useUserStore();
      const sourcesStore = useSourcesStore();
      const encodedSourcePath = encodeUriComponentBase64(sourcePath);

      return createComment(encodedSourcePath, params).then((comment) => {
        comment.attributes.karma += 1; // fake an initial upvote
        comment.attributes.upvoteCount += 1; // fake an initial upvote
        comment.attributes.laplaceRank = 1; // put it at the top of the list
        collectionsStore.addToCollection(comment, item => item.id, true);

        // Instead of making another API call to fetch what we already know is a
        // default initial author upvote on a created comment, we'll just make
        // one on the client, all fake-like.
        const userId = parseInt(userStore.user.id, 10);
        const commentId = parseInt(comment.id, 10);
        const upvote = createInitialUserUpvote(userId, commentId);
        collectionsStore.addToCollection(upvote);

        // Fetch the source, because it may have just been created, and/or it
        // may be updated with new info.
        return sourcesStore.fetchSource(sourcePath);
      }).finally(() => {
        this.setCreatingComment(false);
      });
    },

    updateKarma(commentId: number | string, fromVote: boolean | null, toVote: boolean | null): void {
      if (fromVote === toVote) return;

      const collectionsStore = useCollectionsStore();
      const comment = collectionsStore.collections.comment.find(({ id }) => id === commentId);
      if (!comment) return;

      // If this seems to be missing cases, remember: `fromVote` and `toVote`
      // are guarded above so they CANNOT be equal.
      let karmaDelta = 0;
      if (fromVote === null) {
        // null => true:  +1
        // null => false: -1
        karmaDelta = toVote ? 1 : -1;
      } else if (fromVote) {
        // true => null:  -1
        // true => false: -2
        karmaDelta = toVote === null ? -1 : -2;
      } else {
        // false => null: +1
        // false => true: +2
        karmaDelta = toVote === null ? 1 : 2;
      }

      comment.attributes.karma += karmaDelta;
    },

    deleteCommentVote(commentId: number | string): Promise<void> {
      const collectionsStore = useCollectionsStore();
      const oldVote = this.commentVoteState(commentId);

      return deleteCommentVote(commentId).then(() => {
        collectionsStore.removeFromCollectionByKey(
          "commentVote",
          commentId,
          commentVote => `${commentVote.attributes.commentId}`,
        );

        this.updateKarma(commentId, oldVote, null);
      });
    },

    voteOnComment(commentId: number | string, upvote: boolean): Promise<CommentVote> {
      const collectionsStore = useCollectionsStore();
      const oldVote = this.commentVoteState(commentId);

      return createCommentVote(commentId, { upvote }).then((commentVote) => {
        collectionsStore.addToCollection(commentVote);
        this.updateKarma(commentId, oldVote, commentVote.attributes.upvote);
        return commentVote;
      });
    },

    upvoteComment(commentId: number | string): Promise<CommentVote> {
      return this.voteOnComment(commentId, true);
    },

    downvoteComment(commentId: number | string): Promise<CommentVote> {
      return this.voteOnComment(commentId, false);
    },
  },
});
