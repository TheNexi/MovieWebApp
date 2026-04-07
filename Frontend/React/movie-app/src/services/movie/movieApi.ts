import API from "../../api/axios";
import type { Movie, RatingRequest, ReviewRequest } from "./movieTypes";

export const getAllMovies = () =>
  API.get<Movie[]>("/movies/all");

export const getMovieById = (id: number) =>
  API.get<Movie>(`/movies/${id}`);

export const rateMovie = (id: number, data: RatingRequest) =>
  API.post(`/movies/${id}/rate`, data);

export const addReviewToMovie = (id: number, data: ReviewRequest) =>
  API.post(`/movies/${id}/review`, data);

export const getCast = (id: number) =>
  API.get(`/movies/${id}/cast`);