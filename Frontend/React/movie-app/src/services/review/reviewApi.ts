import API from "../../api/axios";
import type { Review } from "./reviewTypes";

export const addReview = (movieId: number, content: string) =>
  API.post<Review>(`/reviews/${movieId}`, { content });

export const getMovieReviews = (movieId: number) =>
  API.get<Review[]>(`/reviews/movie/${movieId}`);