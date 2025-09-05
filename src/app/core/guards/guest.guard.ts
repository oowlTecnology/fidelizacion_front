import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthStateClass } from '../../store/states/auth.state';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router
  ) {}

  canActivate(): boolean {
    const isAuthenticated = this.store.selectSnapshot(AuthStateClass.isAuthenticated);
    
    if (!isAuthenticated) {
      return true;
    }
    
    this.router.navigate(['/dashboard']);
    return false;
  }
}
