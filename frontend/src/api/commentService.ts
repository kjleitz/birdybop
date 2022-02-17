import backendApi from "@/api/backendApi";
import type Comment from "@/types/Comment";
import type { CommentCollectionResponse, CommentItemResponse, CommentSection } from "@/types/Comment";

export interface CommentCreateParams {
  body: string;
  parentId: number | null;
  section: CommentSection;
}

export type CommentUpdateParams = Partial<Comment["attributes"]>;

export function createComment(sourcePath: string, params: CommentCreateParams): Promise<Comment> {
  return backendApi
    .post<CommentItemResponse>(`/sources/${sourcePath}/comments`, { comment: params })
    .then(({ data }) => data);
}

export function fetchComments(sourcePath: string): Promise<Comment[]> {
  return backendApi
    .get<CommentCollectionResponse>(`/sources/${sourcePath}/comments`)
    .then(({ data }) => data);
}

export function fetchComment(id: number | string): Promise<Comment> {
  return backendApi
    .get<CommentItemResponse>(`/comments/${id}`)
    .then(({ data }) => data);
}

export function updateComment(id: number | string, params: CommentUpdateParams): Promise<Comment> {
  return backendApi
    .patch<CommentItemResponse>(`/comments/${id}`, { comment: params })
    .then(({ data }) => data);
}

export function deleteComment(id: number | string): Promise<void> {
  return backendApi.delete(`/comments/${id}`);
}