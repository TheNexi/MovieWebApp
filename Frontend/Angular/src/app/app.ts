
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStateService } from './services/auth/auth-state.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly authState = inject(AuthStateService);
  public get loggedIn() {
    return this.authState.isLoggedIn();
  }

  logout() {
    this.authState.logout();
    window.location.href = '/login';
  }
}
