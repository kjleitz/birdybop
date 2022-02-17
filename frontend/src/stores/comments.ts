import type Comment from "@/types/Comment";
import { createComment, fetchComment, fetchComments, type CommentCreateParams } from "@/api/commentService";
import { encodeUriComponentBase64 } from "@/lib/encoding-utils";
import { useCollectionsStore } from "@/stores/collections";
import { defineStore } from "pinia";
import { useSourcesStore } from "@/stores/sources";

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
      return fetchComments(encodedSourcePath).then((comments) => {
        collectionsStore.addToCollection(comments);
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
      const sourcesStore = useSourcesStore();
      const encodedSourcePath = encodeUriComponentBase64(sourcePath);
      return createComment(encodedSourcePath, params).then((comment) => {
        collectionsStore.addToCollection(comment);
        return sourcesStore.fetchSource(sourcePath);
      }).finally(() => {
        this.setCreatingComment(false);
      });
    },
  },
});
