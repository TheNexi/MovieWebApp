import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieApiService } from '../../../services/movie/movie-api.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-movie-details',
  imports: [CommonModule],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss',
})
export class MovieDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly movieApi = inject(MovieApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly movieId = this.route.snapshot.paramMap.get('id');
  protected readonly limits = [10, 100, 1000, 2500, 5000, 10000];
  protected logs: string[] = ['Gotowe'];
  protected loadingLimit: number | null = null;
  private addLog(message: string): void {
    this.logs = [...this.logs, message];
  }

  protected fetchMovies(limit: number): void {
    this.loadingLimit = limit;
    this.addLog(`Pobieranie ${limit} filmów...`);
    this.cdr.markForCheck();

    const start = performance.now();
    this.movieApi
      .getFirstMovies(limit)
      .pipe(
        catchError(() => {
          const durationMs = performance.now() - start;
          const durationSec = durationMs / 1000;
          this.addLog(
            `Pobieranie nie powiodło się po ${durationMs.toFixed(0)} ms (${durationSec.toFixed(2)} s).`
          );
          this.cdr.markForCheck();
          return of([]);
        }),
        finalize(() => {
          this.loadingLimit = null;
          this.cdr.markForCheck();
        })
      )
      .subscribe((movies) => {
        const durationMs = performance.now() - start;
        const count = Array.isArray(movies) ? movies.length : 0;
        const durationSec = durationMs / 1000;
        this.addLog(
          `Pobrano ${count} filmów w ${durationMs.toFixed(0)} ms (${durationSec.toFixed(2)} s).`
        );
        this.cdr.markForCheck();
      });
  }
}
