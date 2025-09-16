import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="app-container">
      <!-- Sidebar -->
      <app-sidebar 
        [collapsed]="sidebarCollapsed"
        [showOverlay]="showSidebarOverlay"
        (collapsedChange)="onSidebarCollapse($event)"
        (sidebarToggle)="onSidebarToggle($event)">
      </app-sidebar>

      <!-- Main Content Area -->
      <div class="main-content" [class.sidebar-collapsed]="sidebarCollapsed">
        <!-- Top Header -->
        <header class="top-header">
          <div class="header-content">
            <!-- Mobile menu button -->
            <button 
              class="mobile-menu-btn"
              (click)="toggleMobileSidebar()"
              *ngIf="isMobile">
              <i class="fas fa-bars"></i>
            </button>

            <!-- Page Title -->
            <div class="page-title">
              <h1>{{ pageTitle }}</h1>
              <p class="page-subtitle" *ngIf="pageSubtitle">{{ pageSubtitle }}</p>
            </div>

            <!-- Header Actions -->
            <div class="header-actions">
              <!-- Notifications -->
              <button class="action-btn notification-btn" (click)="toggleNotifications()">
                <i class="fas fa-bell"></i>
                <span class="notification-badge" *ngIf="unreadNotifications > 0">
                  {{ unreadNotifications }}
                </span>
              </button>

              <!-- User Profile Dropdown -->
              <div class="user-dropdown" [class.active]="showUserDropdown">
                <button class="action-btn user-btn" (click)="toggleUserDropdown()">
                  <div class="user-avatar">
                    <i class="fas fa-user"></i>
                  </div>
                  <span class="user-name" *ngIf="currentUser">
                    {{ currentUser.firstName }}
                  </span>
                  <i class="fas fa-chevron-down"></i>
                </button>

                <!-- Dropdown Menu -->
                <div class="dropdown-menu" *ngIf="showUserDropdown">
                  <div class="dropdown-header">
                    <div class="user-info">
                      <div class="user-name">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</div>
                      <div class="user-email">{{ currentUser?.email }}</div>
                    </div>
                  </div>
                  <div class="dropdown-divider"></div>
                  <a href="#" class="dropdown-item">
                    <i class="fas fa-user"></i>
                    <span>Mi Perfil</span>
                  </a>
                  <a href="#" class="dropdown-item">
                    <i class="fas fa-cog"></i>
                    <span>Configuración</span>
                  </a>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item logout-item" (click)="logout()">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Notifications Panel -->
      <div class="notifications-panel" [class.active]="showNotifications">
        <div class="notifications-header">
          <h3>Notificaciones</h3>
          <button class="close-btn" (click)="toggleNotifications()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="notifications-content">
          <div class="notification-item" *ngFor="let notification of notifications">
            <div class="notification-icon">
              <i class="fas" [class]="'fa-' + notification.icon"></i>
            </div>
            <div class="notification-content">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-time">{{ notification.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      min-height: 100vh;
      background-color: #f8fafc;
    }

    .main-content {
      flex: 1;
      margin-left: 280px;
      transition: margin-left 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .main-content.sidebar-collapsed {
      margin-left: 70px;
    }

    .top-header {
      background: white;
      border-bottom: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      min-height: 70px;
    }

    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      font-size: 1.2rem;
      color: #64748b;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      transition: background-color 0.2s ease;
    }

    .mobile-menu-btn:hover {
      background-color: #f1f5f9;
    }

    .page-title h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .page-subtitle {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0.25rem 0 0 0;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .action-btn {
      background: none;
      border: none;
      padding: 0.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #64748b;
      position: relative;
    }

    .action-btn:hover {
      background-color: #f1f5f9;
    }

    .notification-btn {
      position: relative;
    }

    .notification-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background: #ef4444;
      color: white;
      font-size: 0.7rem;
      padding: 0.2rem 0.4rem;
      border-radius: 10px;
      min-width: 18px;
      text-align: center;
    }

    .user-dropdown {
      position: relative;
    }

    .user-btn {
      padding: 0.5rem 0.75rem;
      border: 1px solid #e2e8f0;
      background: white;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.9rem;
      border: 2px solid rgba(37, 99, 235, 0.2);
    }

    .user-name {
      font-weight: 500;
      color: #1e293b;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      min-width: 200px;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease;
    }

    .dropdown-menu.active {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-header {
      padding: 1rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .user-info .user-name {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.9rem;
    }

    .user-email {
      font-size: 0.8rem;
      color: #64748b;
      margin-top: 0.25rem;
    }

    .dropdown-divider {
      height: 1px;
      background: #f1f5f9;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: #64748b;
      text-decoration: none;
      transition: background-color 0.2s ease;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
    }

    .dropdown-item:hover {
      background-color: #f8fafc;
      color: #1e293b;
    }

    .logout-item {
      color: #ef4444;
    }

    .logout-item:hover {
      background-color: #fef2f2;
      color: #dc2626;
    }

    .page-content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }

    .notifications-panel {
      position: fixed;
      top: 0;
      right: -400px;
      width: 400px;
      height: 100vh;
      background: white;
      box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
      transition: right 0.3s ease;
      z-index: 1000;
      display: flex;
      flex-direction: column;
    }

    .notifications-panel.active {
      right: 0;
    }

    .notifications-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .notifications-header h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      color: #64748b;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      transition: background-color 0.2s ease;
    }

    .close-btn:hover {
      background-color: #f1f5f9;
    }

    .notifications-content {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }

    .notification-item {
      display: flex;
      gap: 0.75rem;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      transition: background-color 0.2s ease;
    }

    .notification-item:hover {
      background-color: #f8fafc;
    }

    .notification-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1rem;
      border: 2px solid rgba(37, 99, 235, 0.2);
    }

    .notification-content {
      flex: 1;
    }

    .notification-title {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }

    .notification-message {
      color: #64748b;
      font-size: 0.8rem;
      line-height: 1.4;
      margin-bottom: 0.25rem;
    }

    .notification-time {
      color: #94a3b8;
      font-size: 0.75rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
      }

      .main-content.sidebar-collapsed {
        margin-left: 0;
      }

      .mobile-menu-btn {
        display: block;
      }

      .header-content {
        padding: 1rem;
      }

      .page-content {
        padding: 1rem;
      }

      .notifications-panel {
        width: 100%;
        right: -100%;
      }

      .user-name {
        display: none;
      }
    }

    /* Animaciones */
    @keyframes slideIn {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0);
      }
    }

    .app-container {
      animation: slideIn 0.3s ease;
    }
  `]
})
export class SidebarLayoutComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  showSidebarOverlay = false;
  showUserDropdown = false;
  showNotifications = false;
  isMobile = false;
  currentUser: any = null;
  unreadNotifications = 3;

  pageTitle = 'Sistema de Fidelización Política';
  pageSubtitle = 'Gestiona afiliados, eventos y comunicaciones';

  notifications = [
    {
      icon: 'user-plus',
      title: 'Nuevo afiliado',
      message: 'María González se ha afiliado al partido',
      time: 'Hace 5 minutos'
    },
    {
      icon: 'calendar-check',
      title: 'Evento próximo',
      message: 'Asamblea general programada para mañana',
      time: 'Hace 1 hora'
    },
    {
      icon: 'hand-holding-usd',
      title: 'Nuevo aporte',
      message: 'Aporte de $50,000 recibido de sector empresarial',
      time: 'Hace 2 horas'
    },
    {
      icon: 'bullhorn',
      title: 'Comunicado publicado',
      message: 'Declaración oficial sobre reforma electoral',
      time: 'Hace 3 horas'
    },
    {
      icon: 'map-marked-alt',
      title: 'Nueva zona activada',
      message: 'Zona norte expandida con 3 nuevos líderes',
      time: 'Hace 4 horas'
    }
  ];

  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Verificar si es móvil
    this.checkIfMobile();
    window.addEventListener('resize', () => this.checkIfMobile());

    // Suscribirse a cambios del usuario
    const userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.subscriptions.push(userSub);

    // Cerrar dropdowns al hacer click fuera
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-dropdown')) {
        this.showUserDropdown = false;
      }
      if (!target.closest('.notifications-panel')) {
        this.showNotifications = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    window.removeEventListener('resize', () => this.checkIfMobile());
  }

  private checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.showSidebarOverlay = false;
    }
  }

  onSidebarCollapse(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;
  }

  onSidebarToggle(show: boolean): void {
    if (this.isMobile) {
      this.showSidebarOverlay = show;
    }
  }

  toggleMobileSidebar(): void {
    this.showSidebarOverlay = !this.showSidebarOverlay;
  }

  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
    this.showNotifications = false;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showUserDropdown = false;
  }

  logout(): void {
    this.authService.logout();
  }
}
