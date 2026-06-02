import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface MovieProduct {
  id: number;
  title: string;
  description: string;
  averageRating: number;
  durationMinutes: number;
  posterUrl: string;
  releaseDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdvancedSearchService {

  private readonly API_URL = 'http://localhost:8080/api/v1/movies';

  constructor(private http: HttpClient) {}
  getAllMovies(): Observable<MovieProduct[]> {
    return this.http.get<MovieProduct[]>(
      `${this.API_URL}/first/10000`
    );
  }

  searchMovies(query: string): Observable<MovieProduct[]> {
    const q = query?.toLowerCase().trim() || '';

    return this.getAllMovies().pipe(
      map(movies => {
        if (!q) return movies;

        return movies.filter(m =>
          m.title.toLowerCase().includes(q)
        );
      })
    );
  }
}