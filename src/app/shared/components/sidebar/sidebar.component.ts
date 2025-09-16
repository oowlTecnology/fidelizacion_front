import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  badge?: string;
  badgeColor?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar-container" [class.collapsed]="collapsed">
      <!-- Header del sidebar -->
      <div class="sidebar-header">
        <div class="logo-section">
          <img 
            src="assets/logo.png" 
            alt="Logo" 
            class="logo"
            *ngIf="!collapsed">
          <img 
            src="assets/logo-icon.png" 
            alt="Logo" 
            class="logo-icon"
            *ngIf="collapsed">
          <span class="app-name" *ngIf="!collapsed">Sistema Político</span>
        </div>
        <button 
          class="toggle-btn"
          (click)="toggleSidebar()"
          [attr.aria-label]="collapsed ? 'Expandir menú' : 'Contraer menú'">
          <i class="fas" [class.fa-angle-left]="!collapsed" [class.fa-angle-right]="collapsed"></i>
        </button>
      </div>

      <!-- Información del usuario -->
      <div class="user-info" *ngIf="!collapsed && currentUser">
        <div class="user-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="user-details">
          <div class="user-name">{{ currentUser.firstName }} {{ currentUser.lastName }}</div>
          <div class="user-role">{{ getRoleLabel(currentUser.role) }}</div>
        </div>
      </div>

      <!-- Navegación principal -->
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li 
            *ngFor="let item of menuItems" 
            class="nav-item"
            [class.active]="isActiveRoute(item.route)"
            [class.has-children]="item.children?.length">
            
            <!-- Item principal -->
            <a 
              *ngIf="!item.children"
              [routerLink]="item.route"
              class="nav-link"
              (click)="onNavClick(item)">
              <i class="fas" [class]="'fa-' + item.icon"></i>
              <span class="nav-label" *ngIf="!collapsed">{{ item.label }}</span>
              <span 
                *ngIf="item.badge && !collapsed" 
                class="nav-badge"
                [class]="'badge-' + (item.badgeColor || 'primary')">
                {{ item.badge }}
              </span>
            </a>

            <!-- Item con submenú -->
            <div *ngIf="item.children" class="nav-link-wrapper">
              <button 
                class="nav-link nav-link-parent"
                [class.expanded]="expandedItems.includes(item.id)"
                (click)="toggleSubmenu(item.id)">
                <i class="fas" [class]="'fa-' + item.icon"></i>
                <span class="nav-label" *ngIf="!collapsed">{{ item.label }}</span>
                <span 
                  *ngIf="item.badge && !collapsed" 
                  class="nav-badge"
                  [class]="'badge-' + (item.badgeColor || 'primary')">
                  {{ item.badge }}
                </span>
                <i 
                  class="fas fa-chevron-down chevron" 
                  *ngIf="!collapsed"
                  [class.rotated]="expandedItems.includes(item.id)"></i>
              </button>
              
              <!-- Submenú -->
              <ul 
                class="submenu"
                [class.expanded]="expandedItems.includes(item.id)"
                *ngIf="!collapsed">
                <li *ngFor="let child of item.children" class="submenu-item">
                  <a 
                    [routerLink]="child.route"
                    class="submenu-link"
                    [class.active]="isActiveRoute(child.route)"
                    (click)="onNavClick(child)">
                    <span class="submenu-label">{{ child.label }}</span>
                    <span 
                      *ngIf="child.badge" 
                      class="submenu-badge"
                      [class]="'badge-' + (child.badgeColor || 'secondary')">
                      {{ child.badge }}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>

      <!-- Footer del sidebar -->
      <div class="sidebar-footer" *ngIf="!collapsed">
        <button class="logout-btn" (click)="logout()">
          <i class="fas fa-sign-out-alt"></i>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>

    <!-- Overlay para móvil -->
    <div 
      class="sidebar-overlay" 
      [class.active]="showOverlay"
      (click)="closeSidebar()"
      *ngIf="showOverlay">
    </div>
  `,
  styles: [`
    .sidebar-container {
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      width: 280px;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
      transition: all 0.3s ease;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      box-shadow: 2px 0 10px rgba(37, 99, 235, 0.2);
    }

    .sidebar-container.collapsed {
      width: 70px;
    }

    .sidebar-header {
      padding: 1.5rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo, .logo-icon {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }

    .app-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: white;
    }

    .toggle-btn {
      background: rgba(255, 255, 255, 0.15);
      border: none;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .toggle-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: scale(1.05);
    }

    .user-info {
      padding: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }

    .user-details {
      flex: 1;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.9rem;
    }

    .user-role {
      font-size: 0.8rem;
      opacity: 0.8;
    }

    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 0;
    }

    .nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-item {
      margin: 0.25rem 0;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: all 0.2s ease;
      border-radius: 0 25px 25px 0;
      margin-right: 1rem;
      position: relative;
    }

    .nav-link:hover,
    .nav-item.active .nav-link {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      transform: translateX(5px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .nav-link i {
      width: 20px;
      text-align: center;
      font-size: 1.1rem;
    }

    .nav-label {
      flex: 1;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .nav-badge {
      background: #ef4444;
      color: white;
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      border-radius: 10px;
      font-weight: 600;
    }

    .badge-primary {
      background: #2563eb;
      color: white;
    }

    .badge-secondary {
      background: #64748b;
      color: white;
    }

    .badge-success {
      background: #059669;
      color: white;
    }

    .badge-warning {
      background: #d97706;
      color: white;
    }

    .nav-link-parent {
      width: 100%;
      border: none;
      background: none;
      cursor: pointer;
      justify-content: space-between;
    }

    .chevron {
      transition: transform 0.2s ease;
      font-size: 0.8rem;
    }

    .chevron.rotated {
      transform: rotate(180deg);
    }

    .submenu {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 0 0 15px 0;
      margin-right: 1rem;
      border-left: 3px solid rgba(255, 255, 255, 0.2);
    }

    .submenu.expanded {
      max-height: 300px;
    }

    .submenu-item {
      margin: 0;
    }

    .submenu-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.6rem 1rem 0.6rem 2.5rem;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 0.85rem;
      transition: all 0.2s ease;
    }

    .submenu-link:hover,
    .submenu-link.active {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      transform: translateX(3px);
      border-left: 3px solid rgba(255, 255, 255, 0.4);
    }

    .submenu-badge {
      font-size: 0.65rem;
      padding: 0.15rem 0.4rem;
      border-radius: 8px;
      font-weight: 600;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logout-btn {
      width: 100%;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      padding: 0.75rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.25);
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
    }

    .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .sidebar-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .sidebar-container {
        transform: translateX(-100%);
        width: 280px;
      }

      .sidebar-container.mobile-open {
        transform: translateX(0);
      }

      .sidebar-container.collapsed {
        width: 280px;
      }
    }

    /* Tooltip para items colapsados */
    .sidebar-container.collapsed .nav-link {
      position: relative;
    }

    .sidebar-container.collapsed .nav-link:hover::after {
      content: attr(data-tooltip);
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      background: #1f2937;
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
      white-space: nowrap;
      z-index: 1001;
      margin-left: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    /* Scroll personalizado */
    .sidebar-nav::-webkit-scrollbar {
      width: 4px;
    }

    .sidebar-nav::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
    }

    .sidebar-nav::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
    }

    .sidebar-nav::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  `]
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;
  @Input() showOverlay = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Output() sidebarToggle = new EventEmitter<boolean>();

  currentUser: any = null;
  expandedItems: string[] = [];

  menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Panel Principal',
      icon: 'tachometer-alt',
      route: '/dashboard'
    },
    {
      id: 'afiliados',
      label: 'Afiliados',
      icon: 'users',
      children: [
        {
          id: 'afiliados-lista',
          label: 'Lista de Afiliados',
          icon: 'list',
          route: '/affiliates'
        },
        {
          id: 'afiliados-nuevo',
          label: 'Nuevo Afiliado',
          icon: 'user-plus',
          route: '/affiliates/new'
        },
        {
          id: 'afiliados-verificacion',
          label: 'Verificación',
          icon: 'check-circle',
          route: '/affiliates/verification',
          badge: '3',
          badgeColor: 'warning'
        }
      ]
    },
    {
      id: 'eventos',
      label: 'Eventos',
      icon: 'calendar-alt',
      children: [
        {
          id: 'eventos-lista',
          label: 'Próximos Eventos',
          icon: 'calendar-check',
          route: '/events'
        },
        {
          id: 'eventos-crear',
          label: 'Crear Evento',
          icon: 'plus-circle',
          route: '/events/new'
        },
        {
          id: 'eventos-historial',
          label: 'Historial',
          icon: 'history',
          route: '/events/history'
        }
      ]
    },
    {
      id: 'comunicaciones',
      label: 'Comunicaciones',
      icon: 'bullhorn',
      children: [
        {
          id: 'mensajes',
          label: 'Mensajes',
          icon: 'envelope',
          route: '/communications/messages',
          badge: '5',
          badgeColor: 'primary'
        },
        {
          id: 'noticias',
          label: 'Noticias',
          icon: 'newspaper',
          route: '/communications/news'
        },
        {
          id: 'redes-sociales',
          label: 'Redes Sociales',
          icon: 'share-alt',
          route: '/communications/social'
        }
      ]
    },
    {
      id: 'territorio',
      label: 'Territorio',
      icon: 'map-marked-alt',
      children: [
        {
          id: 'zonas',
          label: 'Zonas',
          icon: 'map',
          route: '/territory/zones'
        },
        {
          id: 'lideres',
          label: 'Líderes',
          icon: 'crown',
          route: '/territory/leaders'
        },
        {
          id: 'coordinadores',
          label: 'Coordinadores',
          icon: 'user-tie',
          route: '/territory/coordinators'
        }
      ]
    },
    {
      id: 'finanzas',
      label: 'Finanzas',
      icon: 'coins',
      children: [
        {
          id: 'aportes',
          label: 'Aportes',
          icon: 'hand-holding-usd',
          route: '/finance/contributions'
        },
        {
          id: 'gastos',
          label: 'Gastos',
          icon: 'receipt',
          route: '/finance/expenses'
        },
        {
          id: 'reportes-financieros',
          label: 'Reportes',
          icon: 'chart-pie',
          route: '/finance/reports'
        }
      ]
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: 'chart-bar',
      children: [
        {
          id: 'reportes-afiliacion',
          label: 'Afiliación',
          icon: 'chart-line',
          route: '/reports/affiliation'
        },
        {
          id: 'reportes-participacion',
          label: 'Participación',
          icon: 'chart-area',
          route: '/reports/participation'
        },
        {
          id: 'reportes-demografico',
          label: 'Demográfico',
          icon: 'chart-pie',
          route: '/reports/demographic'
        }
      ]
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: 'cog',
      route: '/settings'
    },
    {
      id: 'ayuda',
      label: 'Ayuda y Soporte',
      icon: 'question-circle',
      route: '/help'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
    this.sidebarToggle.emit(this.collapsed);
  }

  closeSidebar(): void {
    this.showOverlay = false;
    this.sidebarToggle.emit(false);
  }

  toggleSubmenu(itemId: string): void {
    const index = this.expandedItems.indexOf(itemId);
    if (index > -1) {
      this.expandedItems.splice(index, 1);
    } else {
      this.expandedItems.push(itemId);
    }
  }

  onNavClick(item: MenuItem): void {
    // Actualizar actividad del usuario
    this.authService.updateLastActivity();
    
    // Cerrar sidebar en móvil
    if (window.innerWidth <= 768) {
      this.closeSidebar();
    }
  }

  isActiveRoute(route: string | undefined): boolean {
    if (!route) return false;
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  getRoleLabel(role: string): string {
    const roleLabels: { [key: string]: string } = {
      'admin': 'Administrador',
      'coordinator': 'Coordinador',
      'leader': 'Líder',
      'affiliate': 'Afiliado',
      'volunteer': 'Voluntario',
      'secretary': 'Secretario',
      'treasurer': 'Tesorero',
      'president': 'Presidente',
      'vice-president': 'Vicepresidente'
    };
    return roleLabels[role] || role;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
