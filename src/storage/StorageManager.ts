import { STORAGE_KEYS, STORAGE_VERSION } from '@constants/storageKeys';
import type {
  User,
  Wallet,
  WalletAddress,
  Asset,
  Transaction,
  Trade,
  Deposit,
  Withdrawal,
  InternalTransfer,
  Notification,
  ActivityLog,
  AuditLog,
  Settings,
  UserProfile,
} from '@types/index';

interface StorageBackup {
  timestamp: string;
  version: string;
  data: Record<string, any>;
}

/**
 * Enterprise-level centralized storage manager
 * Single source of truth for all localStorage operations
 */
export class StorageManager {
  private static instance: StorageManager;
  private backups: Map<string, StorageBackup> = new Map();
  private initialized: boolean = false;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  /**
   * Initialize storage on application startup
   */
  initialize(): void {
    if (this.initialized) return;

    try {
      const version = this.getVersion();
      if (!version) {
        this.initializeDemoData();
        this.setVersion(STORAGE_VERSION);
      }
      this.validateStorage();
      this.initialized = true;
    } catch (error) {
      console.error('Storage initialization failed:', error);
      this.repairCorruptedData();
    }
  }

  /**
   * Initialize demo data on first launch
   */
  private initializeDemoData(): void {
    // Initialize users storage
    if (!this.exists(STORAGE_KEYS.USERS)) {
      this.setRaw(STORAGE_KEYS.USERS, []);
    }

    // Initialize wallets storage
    if (!this.exists(STORAGE_KEYS.WALLETS)) {
      this.setRaw(STORAGE_KEYS.WALLETS, []);
    }

    // Initialize wallet addresses storage
    if (!this.exists(STORAGE_KEYS.WALLET_ADDRESSES)) {
      this.setRaw(STORAGE_KEYS.WALLET_ADDRESSES, []);
    }

    // Initialize assets storage
    if (!this.exists(STORAGE_KEYS.ASSETS)) {
      this.setRaw(STORAGE_KEYS.ASSETS, []);
    }

    // Initialize transactions storage
    if (!this.exists(STORAGE_KEYS.TRANSACTIONS)) {
      this.setRaw(STORAGE_KEYS.TRANSACTIONS, []);
    }

    // Initialize trades storage
    if (!this.exists(STORAGE_KEYS.TRADES)) {
      this.setRaw(STORAGE_KEYS.TRADES, []);
    }

    // Initialize deposits storage
    if (!this.exists(STORAGE_KEYS.DEPOSITS)) {
      this.setRaw(STORAGE_KEYS.DEPOSITS, []);
    }

    // Initialize withdrawals storage
    if (!this.exists(STORAGE_KEYS.WITHDRAWALS)) {
      this.setRaw(STORAGE_KEYS.WITHDRAWALS, []);
    }

    // Initialize internal transfers storage
    if (!this.exists(STORAGE_KEYS.INTERNAL_TRANSFERS)) {
      this.setRaw(STORAGE_KEYS.INTERNAL_TRANSFERS, []);
    }

    // Initialize notifications storage
    if (!this.exists(STORAGE_KEYS.NOTIFICATIONS)) {
      this.setRaw(STORAGE_KEYS.NOTIFICATIONS, []);
    }

    // Initialize activity logs storage
    if (!this.exists(STORAGE_KEYS.ACTIVITY_LOGS)) {
      this.setRaw(STORAGE_KEYS.ACTIVITY_LOGS, []);
    }

    // Initialize audit logs storage
    if (!this.exists(STORAGE_KEYS.AUDIT_LOGS)) {
      this.setRaw(STORAGE_KEYS.AUDIT_LOGS, []);
    }

    // Initialize settings storage
    if (!this.exists(STORAGE_KEYS.SETTINGS)) {
      this.setRaw(STORAGE_KEYS.SETTINGS, {});
    }

    // Initialize user profiles storage
    if (!this.exists(STORAGE_KEYS.USER_PROFILES)) {
      this.setRaw(STORAGE_KEYS.USER_PROFILES, []);
    }

    // Initialize market data storage
    if (!this.exists(STORAGE_KEYS.MARKET_DATA)) {
      this.setRaw(STORAGE_KEYS.MARKET_DATA, {});
    }

    // Initialize QR codes storage
    if (!this.exists(STORAGE_KEYS.QR_CODES)) {
      this.setRaw(STORAGE_KEYS.QR_CODES, {});
    }
  }

  /**
   * Get raw value from localStorage
   */
  private getRaw(key: string): any {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Failed to retrieve raw data from ${key}:`, error);
      return null;
    }
  }

  /**
   * Set raw value in localStorage
   */
  private setRaw(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to store raw data in ${key}:`, error);
      throw new Error(`Storage write error: ${key}`);
    }
  }

  /**
   * Remove raw value from localStorage
   */
  private removeRaw(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove data from ${key}:`, error);
    }
  }

  /**
   * Check if key exists in localStorage
   */
  exists(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Get single item by ID from a collection
   */
  getById<T extends { id: string }>(key: string, id: string): T | null {
    try {
      const items = this.getRaw(key) as T[];
      if (!Array.isArray(items)) return null;
      return items.find(item => item.id === id) || null;
    } catch (error) {
      console.error(`Failed to get item by ID from ${key}:`, error);
      return null;
    }
  }

  /**
   * Get all items from a collection
   */
  getAll<T>(key: string): T[] {
    try {
      const items = this.getRaw(key);
      return Array.isArray(items) ? items : [];
    } catch (error) {
      console.error(`Failed to get all items from ${key}:`, error);
      return [];
    }
  }

  /**
   * Create new item in a collection
   */
  create<T extends { id: string }>(key: string, item: T): T {
    try {
      // Prevent duplicates
      if (this.getById<T>(key, item.id)) {
        throw new Error(`Item with id ${item.id} already exists`);
      }

      const items = this.getAll<T>(key);
      items.push(item);
      this.setRaw(key, items);
      return item;
    } catch (error) {
      console.error(`Failed to create item in ${key}:`, error);
      throw error;
    }
  }

  /**
   * Update existing item in a collection
   */
  update<T extends { id: string }>(key: string, item: T): T {
    try {
      const items = this.getAll<T>(key);
      const index = items.findIndex(i => i.id === item.id);

      if (index === -1) {
        throw new Error(`Item with id ${item.id} not found`);
      }

      items[index] = item;
      this.setRaw(key, items);
      return item;
    } catch (error) {
      console.error(`Failed to update item in ${key}:`, error);
      throw error;
    }
  }

  /**
   * Remove item from collection
   */
  remove<T extends { id: string }>(key: string, id: string): void {
    try {
      const items = this.getAll<T>(key);
      const filtered = items.filter(item => item.id !== id);
      this.setRaw(key, filtered);
    } catch (error) {
      console.error(`Failed to remove item from ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear all items from a collection
   */
  clear(key: string): void {
    try {
      this.setRaw(key, []);
    } catch (error) {
      console.error(`Failed to clear ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get current storage version
   */
  private getVersion(): string | null {
    return this.getRaw(STORAGE_KEYS.STORAGE_VERSION);
  }

  /**
   * Set storage version
   */
  private setVersion(version: string): void {
    this.setRaw(STORAGE_KEYS.STORAGE_VERSION, version);
  }

  /**
   * Validate storage integrity
   */
  validateStorage(): boolean {
    try {
      const requiredKeys = [
        STORAGE_KEYS.USERS,
        STORAGE_KEYS.WALLETS,
        STORAGE_KEYS.ASSETS,
        STORAGE_KEYS.TRANSACTIONS,
        STORAGE_KEYS.TRADES,
        STORAGE_KEYS.NOTIFICATIONS,
      ];

      for (const key of requiredKeys) {
        if (!this.exists(key)) {
          console.warn(`Missing required storage key: ${key}`);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Storage validation failed:', error);
      return false;
    }
  }

  /**
   * Repair corrupted data
   */
  repairCorruptedData(): void {
    try {
      console.warn('Attempting to repair corrupted storage data...');

      // Reinitialize demo data
      this.initializeDemoData();

      // Validate each collection
      const collections = [
        STORAGE_KEYS.USERS,
        STORAGE_KEYS.WALLETS,
        STORAGE_KEYS.ASSETS,
        STORAGE_KEYS.TRANSACTIONS,
        STORAGE_KEYS.TRADES,
        STORAGE_KEYS.DEPOSITS,
        STORAGE_KEYS.WITHDRAWALS,
        STORAGE_KEYS.NOTIFICATIONS,
        STORAGE_KEYS.ACTIVITY_LOGS,
        STORAGE_KEYS.AUDIT_LOGS,
      ];

      for (const key of collections) {
        try {
          const data = this.getRaw(key);
          if (data && !Array.isArray(data)) {
            this.setRaw(key, []);
          }
        } catch (error) {
          console.error(`Failed to repair ${key}:`, error);
          this.setRaw(key, []);
        }
      }

      console.info('Storage repair completed');
    } catch (error) {
      console.error('Storage repair failed:', error);
    }
  }

  /**
   * Create storage backup
   */
  backupStorage(): string {
    try {
      const backup: StorageBackup = {
        timestamp: new Date().toISOString(),
        version: STORAGE_VERSION,
        data: {},
      };

      const keys = [
        STORAGE_KEYS.USERS,
        STORAGE_KEYS.WALLETS,
        STORAGE_KEYS.ASSETS,
        STORAGE_KEYS.TRANSACTIONS,
        STORAGE_KEYS.TRADES,
        STORAGE_KEYS.DEPOSITS,
        STORAGE_KEYS.WITHDRAWALS,
        STORAGE_KEYS.NOTIFICATIONS,
        STORAGE_KEYS.ACTIVITY_LOGS,
        STORAGE_KEYS.AUDIT_LOGS,
        STORAGE_KEYS.SETTINGS,
      ];

      for (const key of keys) {
        backup.data[key] = this.getRaw(key);
      }

      const backupId = `backup_${Date.now()}`;
      this.backups.set(backupId, backup);
      return backupId;
    } catch (error) {
      console.error('Backup creation failed:', error);
      throw error;
    }
  }

  /**
   * Restore storage from backup
   */
  restoreBackup(backupId: string): void {
    try {
      const backup = this.backups.get(backupId);
      if (!backup) {
        throw new Error(`Backup ${backupId} not found`);
      }

      for (const [key, data] of Object.entries(backup.data)) {
        this.setRaw(key, data);
      }

      console.info(`Storage restored from backup ${backupId}`);
    } catch (error) {
      console.error('Backup restoration failed:', error);
      throw error;
    }
  }

  /**
   * Export storage data
   */
  exportData(): string {
    try {
      const exportData: Record<string, any> = {};

      const keys = [
        STORAGE_KEYS.USERS,
        STORAGE_KEYS.WALLETS,
        STORAGE_KEYS.ASSETS,
        STORAGE_KEYS.TRANSACTIONS,
        STORAGE_KEYS.TRADES,
        STORAGE_KEYS.DEPOSITS,
        STORAGE_KEYS.WITHDRAWALS,
        STORAGE_KEYS.NOTIFICATIONS,
        STORAGE_KEYS.ACTIVITY_LOGS,
        STORAGE_KEYS.AUDIT_LOGS,
        STORAGE_KEYS.SETTINGS,
      ];

      for (const key of keys) {
        exportData[key] = this.getRaw(key);
      }

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Data export failed:', error);
      throw error;
    }
  }

  /**
   * Import storage data
   */
  importData(jsonData: string): void {
    try {
      const importData = JSON.parse(jsonData);

      for (const [key, data] of Object.entries(importData)) {
        if (Object.values(STORAGE_KEYS).includes(key as any)) {
          this.setRaw(key, data);
        }
      }

      console.info('Data import completed');
    } catch (error) {
      console.error('Data import failed:', error);
      throw error;
    }
  }

  /**
   * Reset all demo data
   */
  resetDemoData(): void {
    try {
      const keys = [
        STORAGE_KEYS.USERS,
        STORAGE_KEYS.WALLETS,
        STORAGE_KEYS.WALLET_ADDRESSES,
        STORAGE_KEYS.ASSETS,
        STORAGE_KEYS.TRANSACTIONS,
        STORAGE_KEYS.TRADES,
        STORAGE_KEYS.DEPOSITS,
        STORAGE_KEYS.WITHDRAWALS,
        STORAGE_KEYS.INTERNAL_TRANSFERS,
        STORAGE_KEYS.NOTIFICATIONS,
        STORAGE_KEYS.ACTIVITY_LOGS,
        STORAGE_KEYS.AUDIT_LOGS,
      ];

      for (const key of keys) {
        this.clear(key);
      }

      this.initializeDemoData();
      console.info('Demo data reset completed');
    } catch (error) {
      console.error('Demo data reset failed:', error);
      throw error;
    }
  }

  /**
   * Get last sync timestamp
   */
  getLastSync(): Date | null {
    const timestamp = this.getRaw(STORAGE_KEYS.LAST_SYNC);
    return timestamp ? new Date(timestamp) : null;
  }

  /**
   * Update last sync timestamp
   */
  updateLastSync(): void {
    this.setRaw(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  }
}

// Export singleton instance
export const storageManager = StorageManager.getInstance();
