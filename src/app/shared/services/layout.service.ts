import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { AuthStateClass } from '../../store/states/auth.state';
import { User } from '../../core/models/user.model';

export type LayoutType = 'admin' | 'user' | 'default';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private currentLayoutSubject = new BehaviorSubject<LayoutType>('default');
  public currentLayout$ = this.currentLayoutSubject.asObservable();

  constructor(private store: Store) {
    // Suscribirse a cambios en el usuario para actualizar el layout
    this.store.select(AuthStateClass.user).subscribe(user => {
      this.updateLayout(user);
    });
  }

  updateLayout(user: User | null): void {
    if (!user) {
      this.setLayout('default');
      return;
    }

    // Determinar el layout basado en el rol del usuario
    switch (user.role) {
      case 'admin':
        this.setLayout('admin');
        break;
      case 'moderator':
        this.setLayout('admin'); // Los moderadores usan el layout de admin
        break;
      case 'user':
      default:
        this.setLayout('user');
        break;
    }
  }

  setLayout(layout: LayoutType): void {
    this.currentLayoutSubject.next(layout);
  }

  getCurrentLayout(): LayoutType {
    return this.currentLayoutSubject.value;
  }

  getLayoutForRole(role: string): LayoutType {
    switch (role) {
      case 'admin':
      case 'moderator':
        return 'admin';
      case 'user':
        return 'user';
      default:
        return 'default';
    }
  }
}
