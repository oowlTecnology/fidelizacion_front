import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicLayoutComponent } from '../../layouts/dynamic-layout/dynamic-layout.component';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [CommonModule, DynamicLayoutComponent],
  template: `
    <app-dynamic-layout></app-dynamic-layout>
  `,
  styles: []
})
export class AppLayoutComponent {}
