import { Injectable } from '@angular/core';
import { fetchAuthSession, getCurrentUser, signInWithRedirect, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { environment } from 'src/environments/environment';

export interface CognitoSession {
  username: string;
  accessToken: string;
  idToken: string;
}

@Injectable({ providedIn: 'root' })
export class CognitoAuthService {
  get isHostedUiConfigured(): boolean {
    return Boolean(environment.COGNITO_DOMAIN.trim());
  }

  async login(): Promise<void> {
    if (!this.isHostedUiConfigured) {
      throw new Error('Falta configurar COGNITO_DOMAIN.');
    }

    await signInWithRedirect();
  }

  async getSession(): Promise<CognitoSession | null> {
    try {
      const [user, session] = await Promise.all([getCurrentUser(), fetchAuthSession()]);
      const accessToken = session.tokens?.accessToken?.toString();
      const idToken = session.tokens?.idToken?.toString();

      if (!accessToken || !idToken) {
        return null;
      }

      return { username: user.username, accessToken, idToken };
    } catch {
      return null;
    }
  }

  async hasActiveSession(): Promise<boolean> {
    return (await this.getSession()) !== null;
  }

  async waitForOAuthCallback(): Promise<boolean> {
    return new Promise((resolve) => {
      const timeout = window.setTimeout(() => {
        stopListening();
        resolve(false);
      }, 10_000);

      const stopListening = Hub.listen('auth', ({ payload }) => {
        if (payload.event !== 'signInWithRedirect' && payload.event !== 'signInWithRedirect_failure') {
          return;
        }

        window.clearTimeout(timeout);
        stopListening();
        resolve(payload.event === 'signInWithRedirect');
      });
    });
  }

  async logout(): Promise<void> {
    await signOut();
  }
}
