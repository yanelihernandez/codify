import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const isLogged = await authService.isAuthReady();

  if (isLogged) {
    return true;
  } else {
    toastService.show(' Debes iniciar sesión para reservar una clase');
    sessionStorage.setItem('redirectAfterLogin', state.url);

    return router.createUrlTree(['/sign-in']);
  }
};
