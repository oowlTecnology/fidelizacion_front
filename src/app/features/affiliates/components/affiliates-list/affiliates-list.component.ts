import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { AffiliatesService } from '../../services/affiliates.service';
import { Affiliate, AffiliateFilters, AffiliateSearchResult, AffiliateStats } from '../../models/affiliate.model';

@Component({
  selector: 'app-affiliates-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="affiliates-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="title-section">
            <h1 class="page-title">
              <i class="fas fa-users"></i>
              Gestión de Afiliados
            </h1>
            <p class="page-subtitle">Administra y supervisa todos los afiliados del partido</p>
          </div>
          <div class="header-actions">
            <a 
              routerLink="/affiliates/new" 
              class="btn btn-primary">
              <i class="fas fa-user-plus"></i>
              Nuevo Afiliado
            </a>
          </div>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card">
          <div class="stat-icon total">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.total }}</div>
            <div class="stat-label">Total Afiliados</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon verified">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.verified }}</div>
            <div class="stat-label">Verificados</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon pending">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.pending }}</div>
            <div class="stat-label">Pendientes</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon new">
            <i class="fas fa-user-plus"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.newThisMonth }}</div>
            <div class="stat-label">Nuevos este mes</div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters-section">
        <div class="filters-grid">
          <div class="filter-group">
            <label for="search">Buscar</label>
            <input 
              type="text" 
              id="search"
              [(ngModel)]="filters.search"
              (ngModelChange)="onSearchChange($event)"
              placeholder="Nombre, cédula o email..."
              class="form-input">
          </div>
          
          <div class="filter-group">
            <label for="status">Estado</label>
            <select 
              id="status"
              [(ngModel)]="filters.status"
              (ngModelChange)="onFiltersChange()"
              class="form-select">
              <option value="all">Todos</option>
              <option value="verified">Verificados</option>
              <option value="pending">Pendientes</option>
              <option value="rejected">Rechazados</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="membershipType">Tipo de Membresía</label>
            <select 
              id="membershipType"
              [(ngModel)]="filters.membershipType"
              (ngModelChange)="onFiltersChange()"
              class="form-select">
              <option value="">Todos</option>
              <option value="basic">Básica</option>
              <option value="active">Activa</option>
              <option value="vip">VIP</option>
              <option value="founder">Fundador</option>
              <option value="honorary">Honorario</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="city">Ciudad</label>
            <input 
              type="text" 
              id="city"
              [(ngModel)]="filters.city"
              (ngModelChange)="onFiltersChange()"
              placeholder="Ciudad..."
              class="form-input">
          </div>
        </div>
      </div>

      <!-- Tabla de afiliados -->
      <div class="table-container">
        <div class="table-header">
          <h3>Lista de Afiliados</h3>
          <div class="table-actions">
            <button class="btn btn-secondary btn-sm">
              <i class="fas fa-download"></i>
              Exportar
            </button>
          </div>
        </div>
        
        <div class="table-responsive">
          <table class="affiliates-table">
            <thead>
              <tr>
                <th>Afiliado</th>
                <th>Contacto</th>
                <th>Estado</th>
                <th>Tipo</th>
                <th>Fecha Ingreso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let affiliate of (searchResult?.affiliates || [])" class="table-row">
                <td class="affiliate-info">
                  <div class="affiliate-avatar">
                    <i class="fas fa-user"></i>
                  </div>
                  <div class="affiliate-details">
                    <div class="affiliate-name">
                      {{ affiliate.personalInfo.firstName }} {{ affiliate.personalInfo.lastName }}
                    </div>
                    <div class="affiliate-id">
                      ID: {{ affiliate.membershipInfo.membershipNumber }}
                    </div>
                  </div>
                </td>
                
                <td class="contact-info">
                  <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    {{ affiliate.contactInfo.primaryPhone }}
                  </div>
                  <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    {{ affiliate.contactInfo.email }}
                  </div>
                  <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    {{ affiliate.contactInfo.address.city }}
                  </div>
                </td>
                
                <td class="status-cell">
                  <span 
                    class="status-badge"
                    [class.verified]="affiliate.verificationStatus.isVerified"
                    [class.pending]="!affiliate.verificationStatus.isVerified">
                    <i class="fas" 
                       [class.fa-check-circle]="affiliate.verificationStatus.isVerified"
                       [class.fa-clock]="!affiliate.verificationStatus.isVerified"></i>
                    {{ affiliate.verificationStatus.isVerified ? 'Verificado' : 'Pendiente' }}
                  </span>
                </td>
                
                <td class="membership-type">
                  <span 
                    class="membership-badge"
                    [class]="'badge-' + affiliate.membershipInfo.membershipType">
                    {{ getMembershipTypeLabel(affiliate.membershipInfo.membershipType) }}
                  </span>
                </td>
                
                <td class="join-date">
                  {{ affiliate.membershipInfo.joinDate | date:'dd/MM/yyyy' }}
                </td>
                
                <td class="actions">
                  <div class="action-buttons">
                    <a 
                      [routerLink]="['/affiliates', affiliate.id]"
                      class="btn btn-sm btn-outline"
                      title="Ver detalles">
                      <i class="fas fa-eye"></i>
                    </a>
                    <a 
                      [routerLink]="['/affiliates', affiliate.id, 'edit']"
                      class="btn btn-sm btn-outline"
                      title="Editar">
                      <i class="fas fa-edit"></i>
                    </a>
                    <button 
                      *ngIf="!affiliate.verificationStatus.isVerified"
                      (click)="verifyAffiliate(affiliate.id)"
                      class="btn btn-sm btn-success"
                      title="Verificar">
                      <i class="fas fa-check"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div *ngIf="loading" class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Cargando afiliados...</span>
          </div>
          
          <div *ngIf="!loading && (!searchResult?.affiliates || searchResult?.affiliates?.length === 0)" 
               class="empty-state">
            <i class="fas fa-users"></i>
            <h3>No se encontraron afiliados</h3>
            <p>No hay afiliados que coincidan con los filtros aplicados.</p>
          </div>
        </div>
        
        <!-- Paginación -->
        <div class="pagination" *ngIf="searchResult && searchResult.total > 0">
          <div class="pagination-info">
            Mostrando {{ (currentPage - 1) * pageSize + 1 }} - 
            {{ Math.min(currentPage * pageSize, searchResult.total) }} 
            de {{ searchResult.total }} afiliados
          </div>
          <div class="pagination-controls">
            <button 
              [disabled]="currentPage === 1"
              (click)="changePage(currentPage - 1)"
              class="btn btn-sm btn-outline">
              <i class="fas fa-chevron-left"></i>
              Anterior
            </button>
            <span class="page-info">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            <button 
              [disabled]="currentPage === totalPages"
              (click)="changePage(currentPage + 1)"
              class="btn btn-sm btn-outline">
              Siguiente
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .affiliates-container {
      padding: 2rem;
      background-color: #f8fafc;
      min-height: 100vh;
    }

    .page-header {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .page-title i {
      color: #2563eb;
    }

    .page-subtitle {
      color: #64748b;
      margin: 0;
      font-size: 1rem;
    }

    .header-actions .btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: #2563eb;
      color: white;
      border: none;
    }

    .btn-primary:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
    }

    .stat-icon.total {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    }

    .stat-icon.verified {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
    }

    .stat-icon.pending {
      background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    }

    .stat-icon.new {
      background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    }

    .stat-content {
      flex: 1;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      line-height: 1;
    }

    .stat-label {
      color: #64748b;
      font-size: 0.9rem;
      margin-top: 0.25rem;
    }

    .filters-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-weight: 600;
      color: #374151;
      font-size: 0.9rem;
    }

    .form-input,
    .form-select {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.9rem;
      transition: border-color 0.2s ease;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .table-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .table-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .table-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .affiliates-table {
      width: 100%;
      border-collapse: collapse;
    }

    .affiliates-table th {
      background: #f8fafc;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 1px solid #e5e7eb;
    }

    .affiliates-table td {
      padding: 1rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .table-row:hover {
      background: #f8fafc;
    }

    .affiliate-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .affiliate-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1rem;
    }

    .affiliate-name {
      font-weight: 600;
      color: #1e293b;
    }

    .affiliate-id {
      font-size: 0.8rem;
      color: #64748b;
    }

    .contact-info {
      font-size: 0.9rem;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
      color: #64748b;
    }

    .contact-item i {
      width: 12px;
      color: #9ca3af;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .status-badge.verified {
      background: #dcfce7;
      color: #166534;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .membership-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      color: white;
    }

    .badge-basic {
      background: #6b7280;
    }

    .badge-active {
      background: #2563eb;
    }

    .badge-vip {
      background: #7c3aed;
    }

    .badge-founder {
      background: #dc2626;
    }

    .badge-honorary {
      background: #059669;
    }

    .actions {
      width: 120px;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .btn-sm {
      padding: 0.5rem;
      border-radius: 6px;
      font-size: 0.8rem;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      transition: all 0.2s ease;
    }

    .btn-outline {
      background: transparent;
      border: 1px solid #d1d5db;
      color: #6b7280;
    }

    .btn-outline:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
      color: #374151;
    }

    .btn-success {
      background: #059669;
      border: 1px solid #059669;
      color: white;
    }

    .btn-success:hover {
      background: #047857;
      border-color: #047857;
    }

    .loading-state,
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #64748b;
    }

    .loading-state i {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: #2563eb;
    }

    .empty-state i {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: #9ca3af;
    }

    .pagination {
      padding: 1.5rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .pagination-info {
      color: #64748b;
      font-size: 0.9rem;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .page-info {
      color: #64748b;
      font-size: 0.9rem;
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
      border: none;
    }

    .btn-secondary:hover {
      background: #4b5563;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .affiliates-container {
        padding: 1rem;
      }

      .header-content {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .filters-grid {
        grid-template-columns: 1fr;
      }

      .table-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .pagination {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `]
})
export class AffiliatesListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  loading = false;
  searchResult: AffiliateSearchResult | null = null;
  stats: AffiliateStats | null = null;
  
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  
  filters: AffiliateFilters = {
    search: '',
    status: 'all'
  };

  Math = Math;

  constructor(private affiliatesService: AffiliatesService) {}

  ngOnInit(): void {
    this.loadAffiliates();
    this.loadStats();
    
    // Configurar búsqueda con debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 1;
      this.loadAffiliates();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAffiliates(): void {
    this.loading = true;
    this.affiliatesService.getAffiliates(this.filters, this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.searchResult = result;
        this.totalPages = Math.ceil((result?.total || 0) / this.pageSize);
        this.loading = false;
      });
  }

  loadStats(): void {
    this.affiliatesService.getAffiliateStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        this.stats = stats;
      });
  }

  onSearchChange(value: any): void {
    this.filters.search = value;
    this.searchSubject.next(value);
  }

  onFiltersChange(): void {
    this.currentPage = 1;
    this.loadAffiliates();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadAffiliates();
    }
  }

  verifyAffiliate(id: string): void {
    if (confirm('¿Estás seguro de que quieres verificar este afiliado?')) {
      this.affiliatesService.verifyAffiliate(id, 'current-user', 'Verificado desde la lista')
        .pipe(takeUntil(this.destroy$))
        .subscribe(success => {
          if (success) {
            this.loadAffiliates();
            this.loadStats();
          }
        });
    }
  }

  getMembershipTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'basic': 'Básica',
      'active': 'Activa',
      'vip': 'VIP',
      'founder': 'Fundador',
      'honorary': 'Honorario'
    };
    return labels[type] || type;
  }
}
