import { storageManager } from './StorageManager';
import { STORAGE_KEYS } from '@constants/storageKeys';
import type { User } from '@types/index';

/**
 * Dedicated authentication storage module
 */
export class AuthStorage {
  /**
   * Get current user ID
   */
  static getCurrentUserId(): string | null {
    return storageManager['getRaw'](STORAGE_KEYS.CURRENT_USER_ID) || null;
  }

  /**
   * Set current user ID
   */
  static setCurrentUserId(userId: string): void {
    storageManager['setRaw'](STORAGE_KEYS.CURRENT_USER_ID, userId);
  }

  /**
   * Clear current user ID (logout)
   */
  static clearCurrentUserId(): void {
    storageManager['removeRaw'](STORAGE_KEYS.CURRENT_USER_ID);
  }

  /**
   * Get auth session
   */
  static getAuthSession(): any {
    return storageManager['getRaw'](STORAGE_KEYS.AUTH_SESSION);
  }

  /**
   * Set auth session
   */
  static setAuthSession(session: any): void {
    storageManager['setRaw'](STORAGE_KEYS.AUTH_SESSION, session);
  }

  /**
   * Clear auth session
   */
  static clearAuthSession(): void {
    storageManager['removeRaw'](STORAGE_KEYS.AUTH_SESSION);
  }
}
