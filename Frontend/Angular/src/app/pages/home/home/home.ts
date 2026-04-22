import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from '../../../services/auth/auth-state.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor(private authState: AuthStateService, private router: Router) {}

  logout() {
    this.authState.logout();
    this.router.navigate(['/login']);
  }
}
