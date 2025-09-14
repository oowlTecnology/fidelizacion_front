import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthStateClass } from '../../../store/states/auth.state';
import { AuthActions } from '../../../store/actions/auth.actions';
import { BaseLayoutComponent } from '../base-layout/base-layout.component';
import { User } from '../../../core/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, BaseLayoutComponent],
  template: `
    <app-base-layout
      [title]="'Mi Cuenta'"
      [userInfo]="userInfo"
      [navigationItems]="navigationItems"
      (onLogout)="logout()">
    </app-base-layout>
  `,
  styles: []
})
export class UserLayoutComponent implements OnInit, OnDestroy {
  userInfo: string = '';
  navigationItems: Array<{label: string, route: string, active?: boolean}> = [
    { label: 'Mi Dashboard', route: '/dashboard', active: true },
    { label: 'Mi Perfil', route: '/profile' },
    { label: 'Mis Actividades', route: '/activities' },
    { label: 'Configuración', route: '/settings' }
  ];

  private userSubscription?: Subscription;

  constructor(
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse a cambios en el usuario
    this.userSubscription = this.store.select(AuthStateClass.user).subscribe(user => {
      if (user) {
        this.userInfo = `${user.firstName} ${user.lastName}`;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.store.dispatch({ type: AuthActions.logout });
    this.router.navigate(['/auth']);
  }
}
