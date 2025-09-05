import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Components
import { ButtonComponent } from './components/button/button.component';
import { LoadingComponent } from './components/loading/loading.component';

const SHARED_COMPONENTS = [
  ButtonComponent,
  LoadingComponent
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...SHARED_COMPONENTS
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    ...SHARED_COMPONENTS
  ]
})
export class SharedModule { }
