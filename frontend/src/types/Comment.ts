import JsonApi from "@/types/JsonApi";

export interface CommentAttributes {
  authorId: number;
  parentId: number;
  sourceId: number;
  body: string;
  section: string;
  commentsCount: string;
  karma: number;
  createdAt: string;
  updatedAt: string;
}

export type CommentRelationships = undefined;
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
