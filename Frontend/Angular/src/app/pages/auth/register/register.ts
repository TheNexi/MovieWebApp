
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthApiService } from '../../../services/auth/auth-api.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.scss',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class Register {
  username = '';
  password = '';
  error = '';
  success = '';

  constructor(private authApi: AuthApiService, private router: Router) {}

      onSubmit() {
    this.error = '';
    this.success = '';

    this.authApi.register({
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        console.log("REGISTER RESPONSE:", res);

        this.success = 'Rejestracja udana! Możesz się zalogować.';

        setTimeout(() => this.router.navigate(['/login']), 1200);
      },

      error: (err) => {
        let msg = err?.error;

        if (typeof msg !== 'string') {
          msg = msg?.message || 'Błąd rejestracji';
        }

        if (typeof msg === 'string') {
          if (msg.toLowerCase().includes('forbidden')) {
            msg = 'Nie masz uprawnień do rejestracji.';
          } else if (
            msg.toLowerCase().includes('conflict') ||
            msg.toLowerCase().includes('exists')
          ) {
            msg = 'Użytkownik o tej nazwie już istnieje.';
          }
        }

        this.error = msg;
      }
    });
  }
}
