import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from './services/auth/auth-state.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const user = localStorage.getItem('user');

  if (user) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};