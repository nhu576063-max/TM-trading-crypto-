import { storageManager } from './StorageManager';
import { STORAGE_KEYS } from '@constants/storageKeys';
import type { Wallet, WalletAddress, Asset } from '@types/index';
import { generateId } from '@utils/idGenerator';

/**
 * Dedicated wallet management storage module
 */
export class WalletStorage {
  /**
   * Create new wallet
   */
  static createWallet(userId: string, wallet: Omit<Wallet, 'id' | 'createdAt' | 'updatedAt'>): Wallet {
    const newWallet: Wallet = {
      ...wallet,
      id: generateId(),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return storageManager.create(STORAGE_KEYS.WALLETS, newWallet);
  }

  /**
   * Get wallet by ID
   */
  static getWalletById(walletId: string): Wallet | null {
    return storageManager.getById(STORAGE_KEYS.WALLETS, walletId);
  }

  /**
   * Get all wallets for user
   */
  static getUserWallets(userId: string): Wallet[] {
    const wallets = storageManager.getAll<Wallet>(STORAGE_KEYS.WALLETS);
    return wallets.filter(w => w.userId === userId);
  }

  /**
   * Update wallet
   */
  static updateWallet(walletId: string, updates: Partial<Wallet>): Wallet {
    const wallet = this.getWalletById(walletId);
    if (!wallet) {
      throw new Error(`Wallet ${walletId} not found`);
    }

    const updated: Wallet = {
      ...wallet,
      ...updates,
      id: wallet.id,
      userId: wallet.userId,
      createdAt: wallet.createdAt,
      updatedAt: new Date().toISOString(),
    };

    return storageManager.update(STORAGE_KEYS.WALLETS, updated);
  }

  /**
   * Create wallet address
   */
  static createWalletAddress(address: Omit<WalletAddress, 'id' | 'createdAt'>): WalletAddress {
    const newAddress: WalletAddress = {
      ...address,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    return storageManager.create(STORAGE_KEYS.WALLET_ADDRESSES, newAddress);
  }

  /**
   * Get wallet addresses by cryptocurrency
   */
  static getAddressesByCrypto(cryptocurrency: string): WalletAddress[] {
    const addresses = storageManager.getAll<WalletAddress>(STORAGE_KEYS.WALLET_ADDRESSES);
    return addresses.filter(a => a.cryptocurrency === cryptocurrency);
  }

  /**
   * Get wallet addresses by wallet ID
   */
  static getWalletAddresses(walletId: string): WalletAddress[] {
    const addresses = storageManager.getAll<WalletAddress>(STORAGE_KEYS.WALLET_ADDRESSES);
    return addresses.filter(a => a.walletId === walletId);
  }

  /**
   * Check if address already exists
   */
  static addressExists(address: string): boolean {
    const addresses = storageManager.getAll<WalletAddress>(STORAGE_KEYS.WALLET_ADDRESSES);
    return addresses.some(a => a.address === address);
  }
}
