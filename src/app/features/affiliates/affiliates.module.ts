import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AffiliatesRoutingModule } from './affiliates-routing.module';
import { AffiliatesListComponent } from './components/affiliates-list/affiliates-list.component';
import { AffiliatesService } from './services/affiliates.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AffiliatesRoutingModule,
    AffiliatesListComponent
  ],
  providers: [
    AffiliatesService
  ]
})
export class AffiliatesModule { }
