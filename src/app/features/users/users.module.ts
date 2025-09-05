import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Components
import { UsersListComponent } from './components/users-list/users-list.component';

const USERS_COMPONENTS = [
  UsersListComponent
];

const USERS_ROUTES = [
  {
    path: '',
    component: UsersListComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(USERS_ROUTES),
    ...USERS_COMPONENTS
  ],
  exports: [
    ...USERS_COMPONENTS
  ]
})
export class UsersModule { }
