import { storageManager } from './StorageManager';
import { STORAGE_KEYS } from '@constants/storageKeys';
import type { Transaction, Trade, Deposit, Withdrawal, InternalTransfer } from '@types/index';
import { generateId } from '@utils/idGenerator';

/**
 * Dedicated transaction management storage module
 */
export class TransactionStorage {
  /**
   * Create transaction
   */
  static createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    return storageManager.create(STORAGE_KEYS.TRANSACTIONS, newTransaction);
  }

  /**
   * Get transaction by ID
   */
  static getTransactionById(transactionId: string): Transaction | null {
    return storageManager.getById(STORAGE_KEYS.TRANSACTIONS, transactionId);
  }

  /**
   * Get user transactions
   */
  static getUserTransactions(userId: string): Transaction[] {
    const transactions = storageManager.getAll<Transaction>(STORAGE_KEYS.TRANSACTIONS);
    return transactions.filter(t => t.userId === userId);
  }

  /**
   * Get transactions by type
   */
  static getTransactionsByType(userId: string, type: Transaction['type']): Transaction[] {
    return this.getUserTransactions(userId).filter(t => t.type === type);
  }

  /**
   * Update transaction
   */
  static updateTransaction(transactionId: string, updates: Partial<Transaction>): Transaction {
    const transaction = this.getTransactionById(transactionId);
    if (!transaction) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    const updated: Transaction = {
      ...transaction,
      ...updates,
      id: transaction.id,
      userId: transaction.userId,
      createdAt: transaction.createdAt,
    };

    return storageManager.update(STORAGE_KEYS.TRANSACTIONS, updated);
  }

  /**
   * Create trade
   */
  static createTrade(trade: Omit<Trade, 'id' | 'createdAt'>): Trade {
    const newTrade: Trade = {
      ...trade,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    return storageManager.create(STORAGE_KEYS.TRADES, newTrade);
  }

  /**
   * Get trade by ID
   */
  static getTradeById(tradeId: string): Trade | null {
    return storageManager.getById(STORAGE_KEYS.TRADES, tradeId);
  }

  /**
   * Get user trades
   */
  static getUserTrades(userId: string): Trade[] {
    const trades = storageManager.getAll<Trade>(STORAGE_KEYS.TRADES);
    return trades.filter(t => t.userId === userId);
  }

  /**
   * Update trade
   */
  static updateTrade(tradeId: string, updates: Partial<Trade>): Trade {
    const trade = this.getTradeById(tradeId);
    if (!trade) {
      throw new Error(`Trade ${tradeId} not found`);
    }

    const updated: Trade = {
      ...trade,
      ...updates,
      id: trade.id,
      userId: trade.userId,
      createdAt: trade.createdAt,
    };

    return storageManager.update(STORAGE_KEYS.TRADES, updated);
  }

  /**
   * Create deposit
   */
  static createDeposit(deposit: Omit<Deposit, 'id' | 'createdAt'>): Deposit {
    const newDeposit: Deposit = {
      ...deposit,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    return storageManager.create(STORAGE_KEYS.DEPOSITS, newDeposit);
  }

  /**
   * Get deposits for user
   */
  static getUserDeposits(userId: string): Deposit[] {
    const deposits = storageManager.getAll<Deposit>(STORAGE_KEYS.DEPOSITS);
    return deposits.filter(d => d.userId === userId);
  }

  /**
   * Update deposit
   */
  static updateDeposit(depositId: string, updates: Partial<Deposit>): Deposit {
    const deposit = storageManager.getById<Deposit>(STORAGE_KEYS.DEPOSITS, depositId);
    if (!deposit) {
      throw new Error(`Deposit ${depositId} not found`);
    }

    const updated: Deposit = { ...deposit, ...updates };
    return storageManager.update(STORAGE_KEYS.DEPOSITS, updated);
  }

  /**
   * Create withdrawal
   */
  static createWithdrawal(withdrawal: Omit<Withdrawal, 'id' | 'createdAt'>): Withdrawal {
    const newWithdrawal: Withdrawal = {
      ...withdrawal,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    return storageManager.create(STORAGE_KEYS.WITHDRAWALS, newWithdrawal);
  }

  /**
   * Get withdrawals for user
   */
  static getUserWithdrawals(userId: string): Withdrawal[] {
    const withdrawals = storageManager.getAll<Withdrawal>(STORAGE_KEYS.WITHDRAWALS);
    return withdrawals.filter(w => w.userId === userId);
  }

  /**
   * Update withdrawal
   */
  static updateWithdrawal(withdrawalId: string, updates: Partial<Withdrawal>): Withdrawal {
    const withdrawal = storageManager.getById<Withdrawal>(STORAGE_KEYS.WITHDRAWALS, withdrawalId);
    if (!withdrawal) {
      throw new Error(`Withdrawal ${withdrawalId} not found`);
    }

    const updated: Withdrawal = { ...withdrawal, ...updates };
    return storageManager.update(STORAGE_KEYS.WITHDRAWALS, updated);
  }
}
