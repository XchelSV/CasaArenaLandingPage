import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Amplify } from 'aws-amplify';
import 'aws-amplify/auth/enable-oauth-listener';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}


Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: environment.COGNITO_USER_POOL_ID,
      userPoolClientId: environment.COGNITO_APP_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: environment.COGNITO_DOMAIN,
          scopes: ['openid', 'profile'],
          redirectSignIn: [environment.COGNITO_REDIRECT_SIGN_IN],
          redirectSignOut: [environment.COGNITO_REDIRECT_SIGN_IN],
          responseType: 'code',
        },
      },
    },
  },
});

platformBrowserDynamic().bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()], })
  .catch(err => console.error(err));
