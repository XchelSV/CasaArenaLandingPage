import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CognitoAuthService } from '../services/cognito-auth.service';

export const cognitoSessionGuard: CanActivateFn = async () => {
  const auth = inject(CognitoAuthService);
  const router = inject(Router);

  if (await auth.hasActiveSession()) {
    return true;
  }

  const isOAuthCallback = new URLSearchParams(window.location.search).has('code');
  if (isOAuthCallback && await auth.waitForOAuthCallback() && await auth.hasActiveSession()) {
    return true;
  }

  return router.createUrlTree(['/backoffice/login']);
};
