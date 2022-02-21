import type JsonApi from "@/types/JsonApi";

export interface CommentVoteAttributes {
  upvote: boolean;
  userId: number;
  commentId: number;
  createdAt: string;
  updatedAt: string;
}

export type CommentVoteRelationships = undefined;
export type CommentVoteLinks = undefined;
export type CommentVoteMeta = undefined;

type CommentVote = JsonApi.ResourceData<
  "commentVote",
  CommentVoteAttributes,
  CommentVoteRelationships,
  CommentVoteLinks,
  CommentVoteMeta
>;

export default CommentVote;

export type CommentVoteItemResponse<
  M extends JsonApi.Meta | undefined = undefined,
> = JsonApi.ItemResponse<
  CommentVote,
  undefined,
  undefined,
  M
>;

export type CommentVoteCollectionResponse<
  M extends JsonApi.Meta | undefined = undefined,
> = JsonApi.CollectionResponse<
  CommentVote[],
  undefined,
  undefined, // TODO: This should have pagination links
  M
>;
