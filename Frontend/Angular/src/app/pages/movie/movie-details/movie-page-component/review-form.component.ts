import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewRequest } from '../../../../services/movie/movie-types';
import { MovieApiService } from '../../../../services/movie/movie-api.service';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss']
})
export class ReviewFormComponent {

  @Input() movieId!: number;

  @Output() reviewAdded = new EventEmitter<void>();

  content = '';
  username = '';
  isAnonymous = false;

  error: string | null = null;
  success = false;
  isSubmitting = false;

  constructor(private api: MovieApiService) {}

  validate(value: string): string | null {
    if (!value.trim()) return 'Treść recenzji nie może być pusta.';
    if (value.trim().length < 5) return 'Recenzja jest za krótka (min. 5 znaków).';
    return null;
  }

  submit(): void {
    const validationError = this.validate(this.content);

    this.error = null;
    this.success = false;

    if (validationError) {
      this.error = validationError;
      return;
    }

    const payload: ReviewRequest = {
      content: this.content.trim()
    };

    this.isSubmitting = true;

    this.api.addReviewToMovie(this.movieId, payload).subscribe({
      next: () => {
        this.content = '';
        this.username = '';
        this.isAnonymous = false;

        this.success = true;

        this.reviewAdded.emit();

        setTimeout(() => (this.success = false), 2500);
      },
      error: (err) => {
        this.error =
          err?.error ?? 'Wystąpił błąd podczas dodawania recenzji.';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}