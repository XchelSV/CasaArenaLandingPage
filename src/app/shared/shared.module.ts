import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { CasaArenaHeaderComponent } from './components/casa-arena-header/casa-arena-header.component';
import { CasaArenaFooterComponent } from './components/casa-arena-footer/casa-arena-footer.component';
import { LandingRoutingModule } from '../landing/landing-routing.module';
import { ProductCardComponent } from './components/product-card/product-card.component';



@NgModule({
  declarations: [
    Error404PageComponent,
    CasaArenaHeaderComponent,
    CasaArenaFooterComponent,
    ProductCardComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
  ],
  exports: [
    CasaArenaHeaderComponent,
    CasaArenaFooterComponent,
    ProductCardComponent
  ]
})
export class SharedModule { }
