import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { cognitoSessionGuard } from './guards/cognito-session.guard';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { OrdersPageComponent } from './pages/orders-page/orders-page.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'orders', component: OrdersPageComponent, canActivate: [cognitoSessionGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackofficeRoutingModule {}
