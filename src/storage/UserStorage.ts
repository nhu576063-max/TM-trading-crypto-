import { storageManager } from './StorageManager';
import { STORAGE_KEYS } from '@constants/storageKeys';
import type { User, UserProfile } from '@types/index';
import { generateId } from '@utils/idGenerator';

/**
 * Dedicated user management storage module
 */
export class UserStorage {
  /**
   * Create new user
   */
  static createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const newUser: User = {
      ...user,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return storageManager.create(STORAGE_KEYS.USERS, newUser);
  }

  /**
   * Get user by ID
   */
  static getUserById(userId: string): User | null {
    return storageManager.getById(STORAGE_KEYS.USERS, userId);
  }

  /**
   * Get user by username
   */
  static getUserByUsername(username: string): User | null {
    const users = storageManager.getAll<User>(STORAGE_KEYS.USERS);
    return users.find(u => u.username === username) || null;
  }

  /**
   * Get user by email
   */
  static getUserByEmail(email: string): User | null {
    const users = storageManager.getAll<User>(STORAGE_KEYS.USERS);
    return users.find(u => u.email === email) || null;
  }

  /**
   * Get all users
   */
  static getAllUsers(): User[] {
    return storageManager.getAll(STORAGE_KEYS.USERS);
  }

  /**
   * Update user
   */
  static updateUser(userId: string, updates: Partial<User>): User {
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    const updated: User = {
      ...user,
      ...updates,
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: new Date().toISOString(),
    };

    return storageManager.update(STORAGE_KEYS.USERS, updated);
  }

  /**
   * Delete user
   */
  static deleteUser(userId: string): void {
    storageManager.remove(STORAGE_KEYS.USERS, userId);
  }

  /**
   * Get active users count
   */
  static getActiveUsersCount(): number {
    const users = this.getAllUsers();
    return users.filter(u => u.isActive && !u.isSuspended).length;
  }

  /**
   * Get suspended users
   */
  static getSuspendedUsers(): User[] {
    const users = this.getAllUsers();
    return users.filter(u => u.isSuspended);
  }

  /**
   * Suspend user
   */
  static suspendUser(userId: string): User {
    return this.updateUser(userId, { isSuspended: true, isActive: false });
  }

  /**
   * Reactivate user
   */
  static reactivateUser(userId: string): User {
    return this.updateUser(userId, { isSuspended: false, isActive: true });
  }

  /**
   * Get or create user profile
   */
  static getOrCreateProfile(userId: string): UserProfile {
    const profiles = storageManager.getAll<UserProfile>(STORAGE_KEYS.USER_PROFILES);
    let profile = profiles.find(p => p.userId === userId);

    if (!profile) {
      profile = {
        userId,
        displayName: '',
        updatedAt: new Date().toISOString(),
      };
      storageManager.create(STORAGE_KEYS.USER_PROFILES, profile as any);
    }

    return profile;
  }

  /**
   * Update user profile
   */
  static updateProfile(userId: string, updates: Partial<UserProfile>): UserProfile {
    const profiles = storageManager.getAll<UserProfile>(STORAGE_KEYS.USER_PROFILES);
    const index = profiles.findIndex(p => p.userId === userId);

    if (index === -1) {
      const newProfile: UserProfile = {
        userId,
        displayName: '',
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      storageManager.create(STORAGE_KEYS.USER_PROFILES, newProfile as any);
      return newProfile;
    }

    profiles[index] = {
      ...profiles[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    storageManager['setRaw'](STORAGE_KEYS.USER_PROFILES, profiles);
    return profiles[index];
  }
}
