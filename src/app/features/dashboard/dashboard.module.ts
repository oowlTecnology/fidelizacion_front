import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Components
import { DashboardComponent } from './components/dashboard/dashboard.component';

const DASHBOARD_COMPONENTS = [
  DashboardComponent
];

const DASHBOARD_ROUTES = [
  {
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(DASHBOARD_ROUTES),
    ...DASHBOARD_COMPONENTS
  ],
  exports: [
    ...DASHBOARD_COMPONENTS
  ]
})
export class DashboardModule { }
