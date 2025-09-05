import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container" [class.fullscreen]="fullscreen">
      <div class="spinner">
        <div class="spinner-inner"></div>
      </div>
      @if (message) {
        <p class="loading-message">{{ message }}</p>
      }
    </div>
  `,
  styles: [`
    .loading-container {
      @apply flex flex-col items-center justify-center p-8;
    }
    .loading-container.fullscreen {
      @apply fixed inset-0 bg-white bg-opacity-75 z-50;
    }
    .spinner {
      @apply w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin;
    }
    .spinner-inner {
      @apply w-full h-full border-4 border-transparent border-t-blue-400 rounded-full animate-spin;
      animation-duration: 0.8s;
      animation-direction: reverse;
    }
    .loading-message {
      @apply mt-4 text-gray-600 text-sm;
    }
  `]
})
export class LoadingComponent {
  @Input() message: string = 'Cargando...';
  @Input() fullscreen: boolean = false;
}
