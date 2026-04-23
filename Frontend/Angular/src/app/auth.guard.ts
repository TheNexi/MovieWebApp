import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from './services/auth/auth-state.service';
import { AuthApiService } from './services/auth/auth-api.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authApi = inject(AuthApiService);
  const authState = inject(AuthStateService);

  const user = localStorage.getItem('user');
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  try {
    await firstValueFrom(authApi.isAuthorized());
    return true;
  } catch (e) {
    authState.logout();
    router.navigate(['/login']);
    return false;
  }
};