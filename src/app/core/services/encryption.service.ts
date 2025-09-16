import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private readonly secretKey = 'fidelizacion-secret-key-2024'; // En producción, usar variable de entorno

  /**
   * Encripta un texto usando AES
   */
  encrypt(text: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(text, this.secretKey).toString();
      return encrypted;
    } catch (error) {
      console.error('Error encrypting data:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Desencripta un texto encriptado
   */
  decrypt(encryptedText: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, this.secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted;
    } catch (error) {
      console.error('Error decrypting data:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Encripta un objeto JSON
   */
  encryptObject(obj: any): string {
    try {
      const jsonString = JSON.stringify(obj);
      return this.encrypt(jsonString);
    } catch (error) {
      console.error('Error encrypting object:', error);
      throw new Error('Failed to encrypt object');
    }
  }

  /**
   * Desencripta y convierte a objeto JSON
   */
  decryptObject<T>(encryptedData: string): T {
    try {
      const decryptedString = this.decrypt(encryptedData);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Error decrypting object:', error);
      throw new Error('Failed to decrypt object');
    }
  }

  /**
   * Genera un hash para datos sensibles
   */
  hash(text: string): string {
    return CryptoJS.SHA256(text).toString();
  }

  /**
   * Verifica si un texto está encriptado correctamente
   */
  isEncrypted(text: string): boolean {
    try {
      this.decrypt(text);
      return true;
    } catch {
      return false;
    }
  }
}
