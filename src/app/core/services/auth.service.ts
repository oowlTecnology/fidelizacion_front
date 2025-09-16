import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { SecureStorageService } from './secure-storage.service';
import { User, LoginRequest, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private secureStorage: SecureStorageService
  ) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Mock login para desarrollo
    if (this.isMockLogin(credentials)) {
      return this.mockLogin(credentials);
    }
    
    return this.apiService.post<LoginResponse>('/auth/login', credentials)
      .pipe(
        tap(response => {
          this.setUser(response.user);
          this.setToken(response.token);
        })
      );
  }

  private isMockLogin(credentials: LoginRequest): boolean {
    // Verificar si es el usuario admin mockeado
    return credentials.email === 'admin@admin.com' && credentials.password === 'admin';
  }

  private mockLogin(credentials: LoginRequest): Observable<LoginResponse> {
    const mockUser: User = {
      id: '1',
      email: 'admin@admin.com',
      firstName: 'Admin',
      lastName: 'Usuario',
      role: 'admin' as any,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockResponse: LoginResponse = {
      user: mockUser,
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    };

    // Simular delay de red
    return new Observable(observer => {
      setTimeout(() => {
        this.setUser(mockResponse.user);
        this.setToken(mockResponse.token);
        observer.next(mockResponse);
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    this.clearUser();
    this.secureStorage.clearUserSession();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.secureStorage.isUserAuthenticated() && !!this.getCurrentUser();
  }

  getToken(): string | null {
    return this.secureStorage.getAuthToken();
  }

  private setUser(user: User): void {
    this.currentUserSubject.next(user);
    const sessionData = {
      user,
      loginTime: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
    this.secureStorage.setUserSession(sessionData, 24); // 24 horas de expiración
  }

  private setToken(token: string): void {
    this.secureStorage.setAuthToken(token, 24); // 24 horas de expiración
  }

  private clearUser(): void {
    this.currentUserSubject.next(null);
  }

  private loadUserFromStorage(): void {
    try {
      const sessionData = this.secureStorage.getUserSession();
      if (sessionData && sessionData.user) {
        this.currentUserSubject.next(sessionData.user);
        // Actualizar última actividad
        sessionData.lastActivity = new Date().toISOString();
        this.secureStorage.setUserSession(sessionData, 24);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      this.clearUser();
      this.secureStorage.clearUserSession();
    }
  }

  /**
   * Actualiza la última actividad del usuario
   */
  updateLastActivity(): void {
    try {
      const sessionData = this.secureStorage.getUserSession();
      if (sessionData) {
        sessionData.lastActivity = new Date().toISOString();
        this.secureStorage.setUserSession(sessionData, 24);
      }
    } catch (error) {
      console.error('Error updating last activity:', error);
    }
  }

  /**
   * Obtiene información de la sesión del usuario
   */
  getSessionInfo(): any {
    return this.secureStorage.getUserSession();
  }

  /**
   * Verifica si la sesión ha expirado
   */
  isSessionExpired(): boolean {
    try {
      const sessionData = this.secureStorage.getUserSession();
      if (!sessionData) return true;

      const lastActivity = new Date(sessionData.lastActivity);
      const now = new Date();
      const timeDiff = now.getTime() - lastActivity.getTime();
      const hoursDiff = timeDiff / (1000 * 3600);

      // Considerar expirada si no hay actividad por más de 24 horas
      return hoursDiff > 24;
    } catch (error) {
      return true;
    }
  }

  /**
   * Refresca el token de autenticación
   */
  refreshToken(): Observable<string> {
    // Implementar lógica de refresh token según tu API
    return new Observable(observer => {
      // Por ahora, simular refresh
      const newToken = 'refreshed-token-' + Date.now();
      this.setToken(newToken);
      observer.next(newToken);
      observer.complete();
    });
  }
}
