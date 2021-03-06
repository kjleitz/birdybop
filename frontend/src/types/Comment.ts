import type { CommentVoteCollectionResponse } from "@/types/CommentVote";
import type JsonApi from "@/types/JsonApi";

export type CommentSection = "discussion" | "q_and_a" | "warnings" | "tips";

export interface CommentAttributes {
  authorId: number;
  authorUsername: number;
  body: string;
  commentsCount: string;
  downvoteCount: number;
  upvoteCount: number;
  laplaceRank: number;
  karma: number;
  parentId: number;
  section: CommentSection;
  sourceId: number;
  createdAt: string;
  updatedAt: string;
  editedAt: string | null;
}

export type CommentRelationships = {
  children: JsonApi.CollectionRelationshipDetails;
};

// export type CommentRelationships = undefined;

export type CommentLinks = undefined;
export type CommentMeta = undefined;

type Comment = JsonApi.ResourceData<
  "comment",
  CommentAttributes,
  CommentRelationships,
  CommentLinks,
  CommentMeta
>;

export default Comment;

export type CommentItemResponse<
  M extends JsonApi.Meta | undefined = undefined,
> = JsonApi.ItemResponse<
  Comment,
  undefined,
  undefined,
  M
>;

export type CommentCollectionResponse<
  M extends JsonApi.Meta | undefined = undefined,
> = JsonApi.CollectionResponse<
  Comment[],
  undefined,
  undefined, // TODO: This should have pagination links
  M
>;

// export type CommentCollectionResponseWithCommentVotes = CommentCollectionResponse<{
//   commentVotes: {
//     commentId: number;
//     upvote: boolean;
//   }[];
// }>;

export type CommentCollectionResponseWithCommentVotes = CommentCollectionResponse<{
  currentUserCommentVotes: CommentVoteCollectionResponse;
}>;
