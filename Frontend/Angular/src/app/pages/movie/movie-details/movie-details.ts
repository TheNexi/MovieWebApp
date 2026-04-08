import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movie-details',
  imports: [],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss',
})
export class MovieDetails {
  private readonly route = inject(ActivatedRoute);

  protected readonly movieId = this.route.snapshot.paramMap.get('id');
}
