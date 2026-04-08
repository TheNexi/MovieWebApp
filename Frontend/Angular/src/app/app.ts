import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MovieApiService } from './services/movie/movie-api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly movieApi = inject(MovieApiService);

  ngOnInit(): void {
    this.movieApi.getAllMovies().subscribe({
      next: (movies) => console.log(movies),
      error: (error: unknown) => console.error(error),
    });
  }
}
