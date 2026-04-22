
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieApiService } from './services/movie/movie-api.service';
import { AuthStateService } from './services/auth/auth-state.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly movieApi = inject(MovieApiService);
  private readonly authState = inject(AuthStateService);
  public get loggedIn() {
    return this.authState.isLoggedIn();
  }

  ngOnInit(): void {
    this.movieApi.getAllMovies().subscribe({
      next: (movies) => console.log(movies),
      error: (error: unknown) => console.error(error),
    });
  }

  logout() {
    this.authState.logout();
    window.location.href = '/login';
  }
}
