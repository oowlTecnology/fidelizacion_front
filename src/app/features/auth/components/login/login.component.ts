import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthActions } from '../../../../store/actions/auth.actions';
import { AuthStateClass } from '../../../../store/states/auth.state';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { LoginRequest } from '../../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Accede a tu cuenta de Fidelización
          </p>
          
          <!-- Credenciales de prueba -->
          <div class="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">Credenciales de Prueba</h3>
                <div class="mt-2 text-sm text-blue-700">
                  <p><strong>Email:</strong> admin@admin.com</p>
                  <p><strong>Password:</strong> admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email" class="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                formControlName="email"
                [class]="getInputClasses('email')"
                placeholder="Dirección de email">
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <p class="mt-1 text-sm text-red-600">Por favor ingresa un email válido</p>
              }
            </div>
            <div>
              <label for="password" class="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                formControlName="password"
                [class]="getInputClasses('password')"
                placeholder="Contraseña">
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <p class="mt-1 text-sm text-red-600">La contraseña debe tener al menos 4 caracteres</p>
              }
            </div>
          </div>

          @if (errorMessage) {
            <div class="text-red-600 text-sm text-center">
              {{ errorMessage }}
            </div>
          }

          <div class="space-y-3">
            <app-button
              [config]="buttonConfig"
              (onClick)="onSubmit()">
              Iniciar Sesión
            </app-button>
            
            <button
              type="button"
              (click)="fillTestCredentials()"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Usar Credenciales de Prueba
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  buttonConfig = {
    type: 'primary' as const,
    size: 'md' as const,
    disabled: false,
    loading: false,
    fullWidth: true
  };

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit(): void {
    // Suscribirse a cambios en el estado de autenticación
    this.store.select(AuthStateClass.loading).subscribe(loading => {
      this.buttonConfig.loading = loading;
    });

    this.store.select(AuthStateClass.error).subscribe(error => {
      this.errorMessage = error || '';
    });

    this.store.select(AuthStateClass.isAuthenticated).subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials: LoginRequest = this.loginForm.value;
      this.store.dispatch({ type: AuthActions.login, credentials });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
    }
  }

  fillTestCredentials(): void {
    this.loginForm.patchValue({
      email: 'admin@admin.com',
      password: 'admin'
    });
    // Marcar los campos como tocados para que se muestren como válidos
    this.loginForm.markAllAsTouched();
    this.loginForm.updateValueAndValidity();
    this.errorMessage = '';
  }

  getInputClasses(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    const baseClasses = 'appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm';
    
    if (fieldName === 'email') {
      const borderClasses = field?.invalid && field?.touched 
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500';
      return `${baseClasses} ${borderClasses} rounded-t-md`;
    } else {
      const borderClasses = field?.invalid && field?.touched 
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500';
      return `${baseClasses} ${borderClasses} rounded-b-md`;
    }
  }
}
