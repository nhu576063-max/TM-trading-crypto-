/**
 * Wallet Utilities
 * Helpers for wallet operations
 */

import { Cryptocurrency } from '@constants/cryptocurrencies';
import { getCrypto, formatCryptoAmount, formatUSD } from './cryptoHelpers';

/**
 * Validate wallet address format
 */
export function isValidWalletAddress(address: string, expectedPrefix?: string): boolean {
  if (!address || address.length === 0) return false;
  if (expectedPrefix && !address.startsWith(expectedPrefix)) return false;
  return true;
}

/**
 * Mask wallet address for display
 */
export function maskWalletAddress(address: string, visibleChars: number = 6): string {
  if (address.length <= visibleChars * 2) return address;
  const start = address.substring(0, visibleChars);
  const end = address.substring(address.length - visibleChars);
  return `${start}...${end}`;
}

/**
 * Format wallet address for display
 */
export function formatWalletAddress(address: string, masked: boolean = false): string {
  if (masked) return maskWalletAddress(address);
  return address;
}

/**
 * Validate transaction amount
 */
export function isValidTransactionAmount(
  amount: number,
  min: number,
  max: number
): boolean {
  return amount >= min && amount <= max && amount > 0;
}

/**
 * Calculate available balance after fees
 */
export function calculateAvailableBalance(
  balance: number,
  fee: number
): number {
  return Math.max(0, balance - fee);
}

/**
 * Calculate total cost including fees
 */
export function calculateTotalWithFee(
  amount: number,
  fee: number
): number {
  return amount + fee;
}

/**
 * Format balance for display
 */
export function formatBalance(
  balance: number,
  symbol: string,
  usdPrice?: number
): string {
  const cryptoAmount = formatCryptoAmount(balance, symbol);
  if (usdPrice) {
    const usdValue = balance * usdPrice;
    return `${cryptoAmount} ${symbol} (${formatUSD(usdValue)})`;
  }
  return `${cryptoAmount} ${symbol}`;
}

/**
 * Calculate portfolio value
 */
export function calculatePortfolioValue(
  assets: Array<{ amount: number; symbol: string; priceUSD: number }>
): number {
  return assets.reduce((total, asset) => {
    return total + asset.amount * asset.priceUSD;
  }, 0);
}

/**
 * Calculate asset allocation percentage
 */
export function calculateAllocation(
  assetValue: number,
  portfolioTotal: number
): number {
  if (portfolioTotal === 0) return 0;
  return (assetValue / portfolioTotal) * 100;
}

/**
 * Generate QR code payload
 */
export function generateQRPayload(
  address: string,
  amount?: number,
  symbol?: string
): string {
  if (amount && symbol) {
    return `${symbol}:${address}?amount=${amount}`;
  }
  return address;
}

/**
 * Get wallet network requirements
 */
export function getNetworkRequirements(symbol: string) {
  const crypto = getCrypto(symbol);
  if (!crypto) return null;
  return {
    minTransfer: crypto.wallet.minTransfer,
    maxTransfer: crypto.wallet.maxTransfer,
    fee: crypto.wallet.networkFee,
    confirmationTime: crypto.wallet.estimatedConfirmationTime,
  };
}

/**
 * Check if wallet can send
 */
export function canSendAmount(
  balance: number,
  sendAmount: number,
  symbol: string
): boolean {
  const crypto = getCrypto(symbol);
  if (!crypto) return false;
  const totalNeeded = sendAmount + crypto.wallet.networkFee;
  return balance >= totalNeeded && sendAmount >= crypto.wallet.minTransfer;
}

/**
 * Check if wallet can receive
 */
export function canReceiveAmount(
  amount: number,
  symbol: string
): boolean {
  const crypto = getCrypto(symbol);
  if (!crypto) return false;
  return amount >= crypto.wallet.minDeposit;
}
