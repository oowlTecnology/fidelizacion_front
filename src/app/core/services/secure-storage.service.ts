import { Injectable } from '@angular/core';
import { EncryptionService } from './encryption.service';

export interface SecureStorageItem {
  data: any;
  timestamp: number;
  expires?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SecureStorageService {
  private readonly STORAGE_PREFIX = 'fidelizacion_';
  private readonly DEFAULT_EXPIRY = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

  constructor(private encryptionService: EncryptionService) {}

  /**
   * Guarda datos encriptados en localStorage
   */
  setItem(key: string, data: any, expiryHours?: number): void {
    try {
      const timestamp = Date.now();
      const expires = expiryHours ? timestamp + (expiryHours * 60 * 60 * 1000) : timestamp + this.DEFAULT_EXPIRY;
      
      const item: SecureStorageItem = {
        data,
        timestamp,
        expires
      };

      const encryptedItem = this.encryptionService.encryptObject(item);
      const storageKey = this.STORAGE_PREFIX + key;
      
      localStorage.setItem(storageKey, encryptedItem);
    } catch (error) {
      console.error('Error saving to secure storage:', error);
      throw new Error('Failed to save data securely');
    }
  }

  /**
   * Recupera y desencripta datos de localStorage
   */
  getItem<T>(key: string): T | null {
    try {
      const storageKey = this.STORAGE_PREFIX + key;
      const encryptedData = localStorage.getItem(storageKey);
      
      if (!encryptedData) {
        return null;
      }

      const item: SecureStorageItem = this.encryptionService.decryptObject<SecureStorageItem>(encryptedData);
      
      // Verificar si el item ha expirado
      if (item.expires && Date.now() > item.expires) {
        this.removeItem(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('Error retrieving from secure storage:', error);
      // Si hay error de desencriptación, eliminar el item corrupto
      this.removeItem(key);
      return null;
    }
  }

  /**
   * Elimina un item del almacenamiento seguro
   */
  removeItem(key: string): void {
    const storageKey = this.STORAGE_PREFIX + key;
    localStorage.removeItem(storageKey);
  }

  /**
   * Limpia todos los items del almacenamiento seguro
   */
  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Verifica si un item existe y no ha expirado
   */
  hasItem(key: string): boolean {
    const item = this.getItem(key);
    return item !== null;
  }

  /**
   * Obtiene información de sesión del usuario
   */
  getUserSession(): any | null {
    return this.getItem('user_session');
  }

  /**
   * Guarda información de sesión del usuario
   */
  setUserSession(userData: any, expiryHours: number = 24): void {
    this.setItem('user_session', userData, expiryHours);
  }

  /**
   * Elimina la sesión del usuario
   */
  clearUserSession(): void {
    this.removeItem('user_session');
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isUserAuthenticated(): boolean {
    return this.hasItem('user_session');
  }

  /**
   * Obtiene el token de autenticación
   */
  getAuthToken(): string | null {
    const session = this.getUserSession();
    return session?.token || null;
  }

  /**
   * Guarda el token de autenticación
   */
  setAuthToken(token: string, expiryHours: number = 24): void {
    const session = this.getUserSession() || {};
    session.token = token;
    this.setUserSession(session, expiryHours);
  }
}
