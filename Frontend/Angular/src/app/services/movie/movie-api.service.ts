import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CastMember, Movie, RatingRequest, ReviewRequest } from './movie-types';

@Injectable({
  providedIn: 'root',
})
export class MovieApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/v1';

  getAllMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.baseUrl}/movies/all`, {
      withCredentials: true,
    });
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.baseUrl}/movies/${id}`, {
      withCredentials: true,
    });
  }

  rateMovie(id: number, data: RatingRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/movies/${id}/rate`, data, {
      withCredentials: true,
    });
  }

  addReviewToMovie(id: number, data: ReviewRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/movies/${id}/review`, data, {
      withCredentials: true,
    });
  }

  getCast(id: number): Observable<CastMember[]> {
    return this.http.get<CastMember[]>(`${this.baseUrl}/movies/${id}/cast`, {
      withCredentials: true,
    });
  }

  getFirstMovies(limit: number): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.baseUrl}/movies/first/${limit}`, {
      withCredentials: true,
    });
  }
}