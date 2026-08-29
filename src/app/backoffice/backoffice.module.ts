import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackofficeRoutingModule } from './backoffice-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { OrdersPageComponent } from './pages/orders-page/orders-page.component';

@NgModule({
  declarations: [LoginPageComponent, OrdersPageComponent],
  imports: [CommonModule, FormsModule, BackofficeRoutingModule],
})
export class BackofficeModule {}
