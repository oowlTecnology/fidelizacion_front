import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { UsersActions } from '../../../../store/actions/users.actions';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-900">Usuarios</h1>
            <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Nuevo Usuario
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        @if (loading) {
          <div class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="ml-2 text-gray-600">Cargando usuarios...</span>
          </div>
        }
        
        @if (!loading) {
          <div class="px-4 py-6 sm:px-0">
          <!-- Users Table -->
          <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <ul class="divide-y divide-gray-200">
              @for (user of users; track user.id) {
                <li class="px-6 py-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700">
                          {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.firstName }} {{ user.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ user.email }}
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          [class]="getRoleClass(user.role)">
                      {{ user.role }}
                    </span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          [class]="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ user.isActive ? 'Activo' : 'Inactivo' }}
                    </span>
                    <div class="flex space-x-1">
                      <button class="text-blue-600 hover:text-blue-900 text-sm font-medium">
                        Editar
                      </button>
                      <button class="text-red-600 hover:text-red-900 text-sm font-medium">
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
                </li>
              }
            </ul>
          </div>

          <!-- Pagination -->
          @if (pagination.totalPages > 1) {
            <div class="mt-6 flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Mostrando {{ (pagination.page - 1) * pagination.limit + 1 }} a 
              {{ Math.min(pagination.page * pagination.limit, pagination.total) }} de 
              {{ pagination.total }} resultados
            </div>
            <div class="flex space-x-2">
              @if (pagination.page > 1) {
                <button 
                  (click)="loadPage(pagination.page - 1)"
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Anterior
                </button>
              }
              @if (pagination.page < pagination.totalPages) {
                <button 
                  (click)="loadPage(pagination.page + 1)"
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Siguiente
                </button>
              }
            </div>
            </div>
          }

          <!-- Error Message -->
          @if (error) {
            <div class="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">Error al cargar los usuarios</h3>
                  <div class="mt-2 text-sm text-red-700">
                    <p>{{ error }}</p>
                  </div>
                </div>
              </div>
            </div>
          }
          </div>
        }
      </main>
    </div>
  `,
  styles: []
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  pagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  };

  // Exponer Math para el template
  Math = Math;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.loadUsers();
    this.subscribeToState();
  }

  private loadUsers(page: number = 1): void {
    this.store.dispatch({ type: UsersActions.loadUsers, page, limit: this.pagination.limit });
  }

  private subscribeToState(): void {
    this.store.select(state => state.users).subscribe(usersState => {
      this.loading = usersState.loading;
      this.error = usersState.error;
      this.users = usersState.users;
      this.pagination = usersState.pagination;
    });
  }

  loadPage(page: number): void {
    this.loadUsers(page);
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'moderator':
        return 'bg-yellow-100 text-yellow-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
