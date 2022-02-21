import type CommentVote from "@/types/CommentVote";

export function createInitialUserUpvote(userId: number, commentId: number): CommentVote {
  return {
    id: "0",
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
