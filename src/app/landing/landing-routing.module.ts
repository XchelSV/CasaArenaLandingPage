import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { TalleresPageComponent } from './pages/talleres-page/talleres-page.component';
import { EsmaltesPageComponent } from './pages/esmaltes-page/esmaltes-page.component';
import { EngobesPageComponent } from './pages/engobes-page/engobes-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: 'home', component: MainPageComponent },
      { path: 'talleres', component: TalleresPageComponent },
      { path: 'catalogo/esmaltes', component: EsmaltesPageComponent },
      { path: 'catalogo/engobes', component: EngobesPageComponent },
      { path: 'contact', component: ContactPageComponent },
      { path: '**', redirectTo: 'home' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
