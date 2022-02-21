import backendApi from "@/api/backendApi";
import type Comment from "@/types/Comment";
import type { CommentCollectionResponseWithCommentVotes, CommentItemResponse, CommentSection } from "@/types/Comment";
import type { CommentVoteItemResponse } from "@/types/CommentVote";
import type CommentVote from "@/types/CommentVote";

export interface CommentCreateParams {
  body: string;
  parentId: number | null;
  section: CommentSection;
}

export type CommentUpdateParams = Partial<Comment["attributes"]>;

export interface CommentVoteCreateParams {
  upvote: boolean;
}

export function createComment(sourcePath: string, params: CommentCreateParams): Promise<Comment> {
  return backendApi
    .post<CommentItemResponse>(`/sources/${sourcePath}/comments`, { comment: params })
    .then(({ data }) => data);
}

export function fetchComments(sourcePath: string): Promise<CommentCollectionResponseWithCommentVotes> {
  return backendApi
    .get<CommentCollectionResponseWithCommentVotes>(`/sources/${sourcePath}/comments`)
    .then((resp) => resp);
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

export function deleteCommentVote(commentId: number | string): Promise<void> {
  return backendApi.delete(`/comments/${commentId}/comment_votes`);
}

export function createCommentVote(commentId: number | string, params: CommentVoteCreateParams): Promise<CommentVote> {
  // TODO: Return type (`CommentVoteItemResponse`)
  return backendApi
    .post<CommentVoteItemResponse>(`/comments/${commentId}/comment_votes`, { comment_vote: params })
    .then(({ data }) => data);
}
