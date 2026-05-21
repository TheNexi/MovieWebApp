import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieApiService } from '../../../services/movie/movie-api.service';
import { catchError, finalize, of } from 'rxjs';

type MeasureMode = 'json' | 'render';

interface PerformanceLog {
  id: number;
  mode: MeasureMode;
  limit: number;
  durationMs: number;
  durationSec: string;
  timestamp: string;
  status: 'success' | 'error';
}

@Component({
  selector: 'app-movie-details',
  imports: [CommonModule],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly movieApi = inject(MovieApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly movieId = this.route.snapshot.paramMap.get('id');

  protected readonly limits = [10, 100, 1000, 2500, 5000, 10000];

  protected measureMode: MeasureMode = 'json';

  protected movies: any[] = [];

  protected loadingLimit: number | null = null;

  protected currentStatus = 'Gotowe do pomiaru';

  protected logs: PerformanceLog[] = [];

  protected currentRun: PerformanceLog | null = null;

  protected imageSession = Date.now();

  private idCounter = 0;

  protected setMode(mode: MeasureMode): void {
    this.measureMode = mode;

    this.movies = [];

    this.currentStatus =
      mode === 'json'
        ? 'Tryb: JSON only'
        : 'Tryb: Full DOM render';

    this.cdr.markForCheck();
  }

  protected clearLogs(): void {
    this.logs = [];
    this.currentRun = null;

    this.cdr.markForCheck();
  }

  private moveCurrentToHistory(): void {
    if (this.currentRun) {
      this.logs = [this.currentRun, ...this.logs];
    }
  }

  protected fetchMovies(limit: number): void {
    this.imageSession = Date.now();

    this.moveCurrentToHistory();

    this.loadingLimit = limit;

    const start = performance.now();

    this.currentRun = {
      id: ++this.idCounter,
      mode: this.measureMode,
      limit,
      durationMs: 0,
      durationSec: '0',
      timestamp: new Date().toLocaleTimeString(),
      status: 'success',
    };

    this.currentStatus = `Pobieranie ${limit} filmów...`;

    if (this.measureMode === 'json') {
      this.movies = [];
    }

    this.cdr.markForCheck();

    this.movieApi
      .getFirstMovies(limit)
      .pipe(
        catchError(() => {
          const durationMs = performance.now() - start;

          if (this.currentRun) {
            this.currentRun = {
              ...this.currentRun,
              durationMs: Math.round(durationMs),
              durationSec: (durationMs / 1000).toFixed(2),
              status: 'error',
            };
          }

          this.currentStatus = 'Błąd requestu';

          return of([]);
        }),
        finalize(() => {
          this.loadingLimit = null;
          this.cdr.markForCheck();
        })
      )
      .subscribe((movies) => {
        const jsonTime = performance.now() - start;

        if (this.measureMode === 'json') {
          if (this.currentRun) {
            this.currentRun = {
              ...this.currentRun,
              durationMs: Math.round(jsonTime),
              durationSec: (jsonTime / 1000).toFixed(2),
              status: 'success',
            };
          }

          this.currentStatus = `JSON: ${movies.length} rekordów`;

          this.cdr.markForCheck();

          return;
        }

        this.movies = movies;

        requestAnimationFrame(() => {
          const renderTime = performance.now() - start;

          if (this.currentRun) {
            this.currentRun = {
              ...this.currentRun,
              durationMs: Math.round(renderTime),
              durationSec: (renderTime / 1000).toFixed(2),
              status: 'success',
            };
          }

          this.currentStatus = `DOM Render: ${movies.length} elementów`;

          this.cdr.markForCheck();
        });
      });
  }

  protected trackById(index: number, movie: any): any {
    return movie?.id;
  }
}