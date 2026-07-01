export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  password: string; // Demo only - hashed in production
  profilePicture?: string; // base64 encoded
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isSuspended: boolean;
  totalBalanceUSD: number;
  verificationLevel: 'basic' | 'intermediate' | 'advanced';
}

export interface Wallet {
  id: string;
  userId: string;
  name: string;
  description?: string;
  totalUSD: number;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
}

export interface WalletAddress {
  id: string;
  walletId: string;
  cryptocurrency: Cryptocurrency;
  address: string;
  publicKey: string;
  qrCode?: string;
  label?: string;
  createdAt: string;
}

export type Cryptocurrency = 'BTC' | 'ETH' | 'USDT' | 'BNB' | 'SOL' | 'XRP' | 'ADA' | 'DOGE';

export interface Asset {
  id: string;
  userId: string;
  cryptocurrency: Cryptocurrency;
  amount: number;
  valueUSD: number;
  percentageChange24h: number;
  currentPrice: number;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'trade' | 'internal_transfer';
  cryptocurrency: Cryptocurrency;
  amount: number;
  valueUSD: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  fromAddress?: string;
  toAddress?: string;
  transactionHash?: string;
  fee: number;
  createdAt: string;
  completedAt?: string;
}

export interface Trade {
  id: string;
  userId: string;
  tradeType: 'buy' | 'sell' | 'swap';
  fromCryptocurrency: Cryptocurrency;
  toCryptocurrency: Cryptocurrency;
  fromAmount: number;
  toAmount: number;
  pricePerUnit: number;
  totalValueUSD: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  profit?: number;
  profitPercentage?: number;
  fee: number;
  createdAt: string;
  completedAt?: string;
}

export interface Deposit {
  id: string;
  userId: string;
  cryptocurrency: Cryptocurrency;
  amount: number;
  valueUSD: number;
  walletAddress: string;
  status: 'pending' | 'confirmed' | 'failed' | 'rejected';
  transactionHash?: string;
  confirmations: number;
  requiredConfirmations: number;
  createdAt: string;
  confirmedAt?: string;
  approvedBy?: string; // Admin user ID
  rejectionReason?: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  cryptocurrency: Cryptocurrency;
  amount: number;
  valueUSD: number;
  destinationAddress: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'rejected';
  transactionHash?: string;
  fee: number;
  createdAt: string;
  processedAt?: string;
  approvedBy?: string; // Admin user ID
  rejectionReason?: string;
}

export interface InternalTransfer {
  id: string;
  fromUserId: string;
  toUserId: string;
  cryptocurrency: Cryptocurrency;
  amount: number;
  valueUSD: number;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'deposit_approved' | 'deposit_rejected' | 'withdrawal_approved' | 'withdrawal_rejected' | 'transfer_received' | 'transfer_sent' | 'trade_completed' | 'trade_failed' | 'balance_updated' | 'system_announcement';
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  isPinned: boolean;
  createdAt: string;
  readAt?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actionId: string;
  userId: string;
  username: string;
  actionType: 'suspend_account' | 'reactivate_account' | 'reset_balance' | 'credit_balance' | 'deduct_balance' | 'approve_deposit' | 'reject_deposit' | 'approve_withdrawal' | 'reject_withdrawal';
  cryptocurrency?: Cryptocurrency;
  amount?: number;
  description: string;
  timestamp: string;
  details: Record<string, any>;
}

export interface Settings {
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  twoFactorEnabled: boolean;
  updatedAt: string;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  bio?: string;
  profilePicture?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
  };
  updatedAt: string;
}

export interface AppState {
  user: User | null;
  wallets: Wallet[];
  walletAddresses: WalletAddress[];
  assets: Asset[];
  transactions: Transaction[];
  trades: Trade[];
  deposits: Deposit[];
  withdrawals: Withdrawal[];
  internalTransfers: InternalTransfer[];
  notifications: Notification[];
  activityLogs: ActivityLog[];
  auditLogs: AuditLog[];
  settings: Settings | null;
  isLoading: boolean;
  error: string | null;
}
