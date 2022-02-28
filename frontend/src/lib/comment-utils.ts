import { sequentialId } from "@/lib/utils";
import type CommentVote from "@/types/CommentVote";

export function createInitialUserUpvote(userId: number, commentId: number): CommentVote {
  return {
    id: sequentialId("initialUserUpvote"),
    type: "commentVote",
    attributes: {
      userId,
      commentId,
      upvote: true,
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
    },
    relationships: undefined,
    links: undefined,
    meta: undefined,
  };
}

export function identifyingKeyForCommentVote(commentVote: CommentVote): string {
  const { userId, commentId } = commentVote.attributes;
  return `${userId}${commentId}`;
}
