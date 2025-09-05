import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Components
import { LoginComponent } from './components/login/login.component';

const AUTH_COMPONENTS = [
  LoginComponent
];

const AUTH_ROUTES = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full' as const
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(AUTH_ROUTES),
    ...AUTH_COMPONENTS
  ],
  exports: [
    ...AUTH_COMPONENTS
  ]
})
export class AuthModule { }
