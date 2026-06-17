import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Movie } from '../../../../services/movie/movie-types';
import { MovieApiService } from '../../../../services/movie/movie-api.service';
import { ReviewFormComponent } from './review-form.component';

@Component({
  selector: 'app-movie-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ReviewFormComponent],
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviePageComponent implements OnInit {

  movie: Movie | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private api: MovieApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMovie();
  }

  loadMovie(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error = 'Brak ID filmu';
      this.loading = false;
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;
    this.error = '';

    this.api.getMovieById(id).subscribe({
      next: (data) => {
        this.movie = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Nie udało się pobrać filmu';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}