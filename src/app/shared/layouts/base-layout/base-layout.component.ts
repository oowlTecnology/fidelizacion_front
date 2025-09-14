import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <div class="flex items-center">
              <h1 class="text-xl font-bold text-gray-900">{{ title }}</h1>
            </div>
            
            <!-- Navigation -->
            <nav class="hidden md:flex space-x-8">
              @for (item of navigationItems; track item.label) {
                <a 
                  [routerLink]="item.route" 
                  class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  [class.bg-gray-100]="item.active">
                  {{ item.label }}
                </a>
              }
            </nav>

            <!-- User Menu -->
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-700">{{ userInfo }}</span>
              <button 
                (click)="onLogout()"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: []
})
export class BaseLayoutComponent {
  @Input() title: string = 'Fidelización';
  @Input() userInfo: string = '';
  @Input() navigationItems: Array<{label: string, route: string, active?: boolean}> = [];

  onLogout(): void {
    // Este método será implementado por los layouts específicos
  }
}
