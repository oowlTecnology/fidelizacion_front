import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User, UserRole } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor() { }

  getUsers(page: number = 1, limit: number = 10): Observable<{ users: User[]; pagination: any }> {
    // Mock data para usuarios
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'admin@admin.com',
        firstName: 'Admin',
        lastName: 'Usuario',
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '2',
        email: 'juan.perez@email.com',
        firstName: 'Juan',
        lastName: 'Pérez',
        role: UserRole.USER,
        isActive: true,
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-21')
      },
      {
        id: '3',
        email: 'maria.garcia@email.com',
        firstName: 'María',
        lastName: 'García',
        role: UserRole.MODERATOR,
        isActive: true,
        createdAt: new Date('2024-01-17'),
        updatedAt: new Date('2024-01-22')
      },
      {
        id: '4',
        email: 'carlos.lopez@email.com',
        firstName: 'Carlos',
        lastName: 'López',
        role: UserRole.USER,
        isActive: false,
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-23')
      },
      {
        id: '5',
        email: 'ana.martinez@email.com',
        firstName: 'Ana',
        lastName: 'Martínez',
        role: UserRole.USER,
        isActive: true,
        createdAt: new Date('2024-01-19'),
        updatedAt: new Date('2024-01-24')
      },
      {
        id: '6',
        email: 'pedro.rodriguez@email.com',
        firstName: 'Pedro',
        lastName: 'Rodríguez',
        role: UserRole.MODERATOR,
        isActive: true,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-25')
      },
      {
        id: '7',
        email: 'lucia.fernandez@email.com',
        firstName: 'Lucía',
        lastName: 'Fernández',
        role: UserRole.USER,
        isActive: true,
        createdAt: new Date('2024-01-21'),
        updatedAt: new Date('2024-01-26')
      },
      {
        id: '8',
        email: 'diego.sanchez@email.com',
        firstName: 'Diego',
        lastName: 'Sánchez',
        role: UserRole.USER,
        isActive: false,
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-27')
      },
      {
        id: '9',
        email: 'sofia.gonzalez@email.com',
        firstName: 'Sofía',
        lastName: 'González',
        role: UserRole.USER,
        isActive: true,
        createdAt: new Date('2024-01-23'),
        updatedAt: new Date('2024-01-28')
      },
      {
        id: '10',
        email: 'miguel.torres@email.com',
        firstName: 'Miguel',
        lastName: 'Torres',
        role: UserRole.MODERATOR,
        isActive: true,
        createdAt: new Date('2024-01-24'),
        updatedAt: new Date('2024-01-29')
      }
    ];

    // Simular paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = mockUsers.slice(startIndex, endIndex);

    const pagination = {
      page,
      limit,
      total: mockUsers.length,
      totalPages: Math.ceil(mockUsers.length / limit)
    };

    // Simular delay de red
    return of({ users: paginatedUsers, pagination }).pipe(delay(600));
  }

  createUser(user: Partial<User>): Observable<User> {
    // Mock crear usuario
    const newUser: User = {
      id: Date.now().toString(),
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role || UserRole.USER,
      isActive: user.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return of(newUser).pipe(delay(500));
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    // Mock actualizar usuario
    const updatedUser: User = {
      id,
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role || UserRole.USER,
      isActive: user.isActive ?? true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    };

    return of(updatedUser).pipe(delay(500));
  }

  deleteUser(id: string): Observable<{ id: string }> {
    // Mock eliminar usuario
    return of({ id }).pipe(delay(300));
  }
}
