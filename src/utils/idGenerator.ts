/**
 * ID Generation Utilities
 * Generates unique IDs for all entities in the application
 */

import { v4 as uuidv4 } from 'crypto';

/**
 * Generate unique ID using timestamp and random string
 */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Generate UUID v4
 */
export function generateUUID(): string {
  return uuidv4();
}

/**
 * Generate user ID
 */
export function generateUserId(): string {
  return `user_${generateId()}`;
}

/**
 * Generate transaction ID
 */
export function generateTransactionId(): string {
  return `txn_${generateId()}`;
}

/**
 * Generate trade ID
 */
export function generateTradeId(): string {
  return `trade_${generateId()}`;
}

/**
 * Generate deposit ID
 */
export function generateDepositId(): string {
  return `dep_${generateId()}`;
}

/**
 * Generate withdrawal ID
 */
export function generateWithdrawalId(): string {
  return `wth_${generateId()}`;
}

/**
 * Generate transfer ID
 */
export function generateTransferId(): string {
  return `trans_${generateId()}`;
}

/**
 * Generate notification ID
 */
export function generateNotificationId(): string {
  return `notif_${generateId()}`;
}

/**
 * Generate activity log ID
 */
export function generateActivityLogId(): string {
  return `act_${generateId()}`;
}

/**
 * Generate audit log ID
 */
export function generateAuditLogId(): string {
  return `audit_${generateId()}`;
}

/**
 * Generate wallet ID
 */
export function generateWalletId(): string {
  return `wallet_${generateId()}`;
}

/**
 * Generate wallet address
 */
export function generateWalletAddress(prefix: string = '0x'): string {
  const chars = '0123456789abcdef';
  let address = prefix;
  for (let i = 0; i < 40; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return address;
}

/**
 * Generate QR reference ID
 */
export function generateQRReferenceId(): string {
  return `qr_${generateId()}`;
}

/**
 * Check if ID already exists in array
 */
export function idExists(id: string, items: Array<{ id: string }>): boolean {
  return items.some(item => item.id === id);
}

/**
 * Generate unique ID avoiding collisions with existing IDs
 */
export function generateUniqueId(existingIds: string[]): string {
  let id = generateId();
  while (existingIds.includes(id)) {
    id = generateId();
  }
  return id;
}
