import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthStateClass } from '../../store/states/auth.state';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): boolean {
    // Verificar autenticación usando el servicio
    const isAuthenticated = this.authService.isAuthenticated();
    
    // Verificar si la sesión ha expirado
    if (isAuthenticated && this.authService.isSessionExpired()) {
      this.authService.logout();
      this.router.navigate(['/auth']);
      return false;
    }
    
    if (isAuthenticated) {
      // Actualizar última actividad
      this.authService.updateLastActivity();
      return true;
    }
    
    this.router.navigate(['/auth']);
    return false;
  }
}
