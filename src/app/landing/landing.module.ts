import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { TalleresPageComponent } from './pages/talleres-page/talleres-page.component';
import { EsmaltesPageComponent } from './pages/esmaltes-page/esmaltes-page.component';


@NgModule({
  declarations: [
    LayoutPageComponent,
    MainPageComponent,
    ContactPageComponent,
    TalleresPageComponent,
    EsmaltesPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LandingRoutingModule,
    SharedModule
  ]
})
export class LandingModule { }
