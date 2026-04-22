import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private user: string | null = localStorage.getItem('user');

  login(user: string) {
    this.user = user;
    localStorage.setItem('user', user); 
  }

  logout() {
    this.user = null;
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user'); 
  }

  getUser(): string | null {
    return localStorage.getItem('user');
  }
}