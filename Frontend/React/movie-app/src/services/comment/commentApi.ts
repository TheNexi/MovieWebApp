import API from "../../api/axios";
import type { Comment } from "./commentTypes";

export const addComment = (reviewId: number, content: string) =>
  API.post<Comment>(`/comments/${reviewId}`, { content });

export const getComments = (reviewId: number) =>
  API.get<Comment[]>(`/comments/review/${reviewId}`);