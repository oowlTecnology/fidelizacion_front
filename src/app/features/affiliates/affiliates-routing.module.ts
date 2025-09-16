import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AffiliatesListComponent } from './components/affiliates-list/affiliates-list.component';

const routes: Routes = [
  {
    path: '',
    component: AffiliatesListComponent
  },
  {
    path: 'new',
    component: AffiliatesListComponent // Temporal hasta crear el componente
  },
  {
    path: 'verification',
    component: AffiliatesListComponent // Temporal hasta crear el componente
  },
  {
    path: ':id',
    component: AffiliatesListComponent // Temporal hasta crear el componente
  },
  {
    path: ':id/edit',
    component: AffiliatesListComponent // Temporal hasta crear el componente
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AffiliatesRoutingModule { }
