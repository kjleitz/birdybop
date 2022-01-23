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

type Comment = JsonApi.Document<"comment", CommentAttributes>;
export default Comment;
