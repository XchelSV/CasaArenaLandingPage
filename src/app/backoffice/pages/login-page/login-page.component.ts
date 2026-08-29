import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoAuthService } from '../../services/cognito-auth.service';

@Component({
  selector: 'app-backoffice-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: false,
})
export class LoginPageComponent implements OnInit {
  errorMessage = '';
  isLoading = false;

  constructor(
    private readonly auth: CognitoAuthService,
    private readonly router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    if (await this.auth.hasActiveSession()) {
      await this.router.navigate(['/backoffice/orders']);
    }
  }

  async signIn(): Promise<void> {
    this.errorMessage = '';
    this.isLoading = true;

    try {
      await this.auth.login();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'No fue posible iniciar sesión.';
      this.isLoading = false;
    }
  }
}
