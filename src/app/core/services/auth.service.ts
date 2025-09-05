import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User, LoginRequest, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
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
    this.clearToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private clearUser(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
  }

  private clearToken(): void {
    localStorage.removeItem('token');
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.clearUser();
      }
    }
  }
}
