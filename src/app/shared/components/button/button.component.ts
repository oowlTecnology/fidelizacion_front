import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonConfig, ButtonType, ButtonSize } from '../../models/button.model';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="buttonClasses"
      [disabled]="config.disabled || config.loading"
      (click)="onClick.emit($event)"
      type="button">
      @if (config.loading) {
        <span class="animate-spin mr-2">⟳</span>
      }
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      @apply px-4 py-2 rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
    }
    .btn-primary { @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500; }
    .btn-secondary { @apply bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500; }
    .btn-success { @apply bg-green-600 text-white hover:bg-green-700 focus:ring-green-500; }
    .btn-danger { @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500; }
    .btn-warning { @apply bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500; }
    .btn-info { @apply bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500; }
    .btn-light { @apply bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400; }
    .btn-dark { @apply bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-600; }
    .btn-sm { @apply px-3 py-1.5 text-sm; }
    .btn-md { @apply px-4 py-2; }
    .btn-lg { @apply px-6 py-3 text-lg; }
    .btn-full { @apply w-full; }
    .btn:disabled { @apply opacity-50 cursor-not-allowed; }
  `]
})
export class ButtonComponent {
  @Input() config: ButtonConfig = {
    type: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false
  };
  
  @Output() onClick = new EventEmitter<Event>();

  get buttonClasses(): string {
    const classes = ['btn'];
    classes.push(`btn-${this.config.type}`);
    classes.push(`btn-${this.config.size}`);
    
    if (this.config.fullWidth) {
      classes.push('btn-full');
    }
    
    return classes.join(' ');
  }
}
