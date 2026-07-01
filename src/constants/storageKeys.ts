export const STORAGE_KEYS = {
  // User & Auth
  USERS: 'tm_users',
  CURRENT_USER_ID: 'tm_current_user_id',
  AUTH_SESSION: 'tm_auth_session',
  USER_PROFILES: 'tm_user_profiles',

  // Wallets & Addresses
  WALLETS: 'tm_wallets',
  WALLET_ADDRESSES: 'tm_wallet_addresses',
  QR_CODES: 'tm_qr_codes',

  // Assets & Portfolio
  ASSETS: 'tm_assets',
  PORTFOLIO: 'tm_portfolio',

  // Transactions
  TRANSACTIONS: 'tm_transactions',
  TRADES: 'tm_trades',
  DEPOSITS: 'tm_deposits',
  WITHDRAWALS: 'tm_withdrawals',
  INTERNAL_TRANSFERS: 'tm_internal_transfers',

  // Notifications & Logs
  NOTIFICATIONS: 'tm_notifications',
  ACTIVITY_LOGS: 'tm_activity_logs',
  AUDIT_LOGS: 'tm_audit_logs',

  // Settings
  SETTINGS: 'tm_settings',
  THEME_SETTINGS: 'tm_theme_settings',
  USER_PREFERENCES: 'tm_user_preferences',

  // Market Data
  MARKET_DATA: 'tm_market_data',
  PRICE_HISTORY: 'tm_price_history',

  // System
  STORAGE_VERSION: 'tm_storage_version',
  LAST_SYNC: 'tm_last_sync',
  APP_STATE: 'tm_app_state',
};

export const STORAGE_VERSION = '1.0.0';

export const DEFAULT_STORAGE_STRUCTURE = {
  users: [],
  currentUserId: null,
  authSession: null,
  userProfiles: [],
  wallets: [],
  walletAddresses: [],
  qrCodes: {},
  assets: [],
  portfolio: {},
  transactions: [],
  trades: [],
  deposits: [],
  withdrawals: [],
  internalTransfers: [],
  notifications: [],
  activityLogs: [],
  auditLogs: [],
  settings: {},
  themeSettings: {},
  userPreferences: {},
  marketData: {},
  priceHistory: {},
  lastSync: null,
  storageVersion: STORAGE_VERSION,
};
