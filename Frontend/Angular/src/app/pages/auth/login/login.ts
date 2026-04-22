
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthApiService } from '../../../services/auth/auth-api.service';
import { AuthStateService } from '../../../services/auth/auth-state.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class Login {
  username = '';
  password = '';
  error = '';

  constructor(private authApi: AuthApiService, private router: Router, private authState: AuthStateService) {}

  onSubmit() {
    this.error = '';

    this.authApi.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        console.log("LOGIN RESPONSE:", res);
        this.authState.login(res);
        console.log("AFTER AUTH LOGIN");
        this.router.navigate(['/home']);
      },
      error: (err) => {
        let msg = err?.error;

        if (typeof msg !== 'string') {
          msg = msg?.message || 'Błąd logowania';
        }

        if (typeof msg === 'string') {
          if (msg.toLowerCase().includes('forbidden') || msg.toLowerCase().includes('unauthorized')) {
            msg = 'Nieprawidłowa nazwa użytkownika lub hasło.';
          } else if (msg.toLowerCase().includes('network')) {
            msg = 'Brak połączenia z serwerem.';
          }
        }

        this.error = msg;
      }
    });
  }
}
