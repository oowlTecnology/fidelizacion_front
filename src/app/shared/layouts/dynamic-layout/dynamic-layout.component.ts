import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { AuthStateClass } from '../../../store/states/auth.state';
import { LayoutService, LayoutType } from '../../services/layout.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { UserLayoutComponent } from '../user-layout/user-layout.component';
import { DefaultLayoutComponent } from '../default-layout/default-layout.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dynamic-layout',
  standalone: true,
  imports: [
    CommonModule, 
    AdminLayoutComponent,
    UserLayoutComponent,
    DefaultLayoutComponent
  ],
  template: `
    <!-- Layout de Administrador -->
    @if (currentLayout === 'admin') {
      <app-admin-layout></app-admin-layout>
    }
    
    <!-- Layout de Usuario -->
    @else if (currentLayout === 'user') {
      <app-user-layout></app-user-layout>
    }
    
    <!-- Layout por Defecto -->
    @else {
      <app-default-layout></app-default-layout>
    }
  `,
  styles: []
})
export class DynamicLayoutComponent implements OnInit, OnDestroy {
  currentLayout: LayoutType = 'default';
  private layoutSubscription?: Subscription;

  constructor(
    private layoutService: LayoutService,
    private store: Store
  ) {}

  ngOnInit(): void {
    // Suscribirse a cambios en el layout
    this.layoutSubscription = this.layoutService.currentLayout$.subscribe(layout => {
      this.currentLayout = layout;
    });

    // Verificar el estado inicial del usuario
    const user = this.store.selectSnapshot(AuthStateClass.user);
    if (user) {
      this.layoutService.updateLayout(user);
    }
  }

  ngOnDestroy(): void {
    if (this.layoutSubscription) {
      this.layoutSubscription.unsubscribe();
    }
  }
}
