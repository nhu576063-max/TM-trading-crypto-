/**
 * Trading Utilities
 * Helpers for trading operations
 */

import { getCrypto } from './cryptoHelpers';

/**
 * Calculate entry price
 */
export function calculateEntryPrice(
  totalInvestment: number,
  quantity: number
): number {
  if (quantity === 0) return 0;
  return totalInvestment / quantity;
}

/**
 * Calculate profit/loss
 */
export function calculatePnL(
  entryPrice: number,
  exitPrice: number,
  quantity: number
): number {
  return (exitPrice - entryPrice) * quantity;
}

/**
 * Calculate ROI percentage
 */
export function calculateROI(
  entryPrice: number,
  exitPrice: number
): number {
  if (entryPrice === 0) return 0;
  return ((exitPrice - entryPrice) / entryPrice) * 100;
}

/**
 * Calculate trading fee
 */
export function calculateTradingFee(
  amount: number,
  feePercentage: number
): number {
  return (amount * feePercentage) / 100;
}

/**
 * Calculate net profit after fees
 */
export function calculateNetProfit(
  profit: number,
  feePercentage: number
): number {
  const fee = calculateTradingFee(profit, feePercentage);
  return profit - fee;
}

/**
 * Get trade status
 */
export function getTradeStatus(
  createdAt: string,
  completedAt?: string,
  status?: string
): 'pending' | 'completed' | 'failed' | 'cancelled' {
  if (status && ['pending', 'completed', 'failed', 'cancelled'].includes(status)) {
    return status as any;
  }
  return completedAt ? 'completed' : 'pending';
}

/**
 * Calculate winning/losing trade
 */
export function isWinningTrade(
  entryPrice: number,
  exitPrice: number
): boolean {
  return exitPrice > entryPrice;
}

/**
 * Get trade duration in minutes
 */
export function getTradeDuration(
  startTime: string,
  endTime?: string
): number {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : Date.now();
  return Math.floor((end - start) / 60000);
}

/**
 * Generate market trend
 */
export function generateMarketTrend(): 'bullish' | 'bearish' | 'sideways' | 'volatile' {
  const rand = Math.random();
  if (rand < 0.4) return 'bullish';
  if (rand < 0.7) return 'bearish';
  if (rand < 0.9) return 'sideways';
  return 'volatile';
}

/**
 * Generate volatility multiplier
 */
export function generateVolatility(min: number = 1, max: number = 3): number {
  return Math.random() * (max - min) + min;
}

/**
 * Calculate demo price change
 */
export function simulatePriceChange(
  currentPrice: number,
  volatility: number = 1,
  trend: 'bullish' | 'bearish' | 'sideways' | 'volatile' = 'sideways'
): number {
  const volatilityFactor = (Math.random() - 0.5) * volatility;
  let change = 0;

  switch (trend) {
    case 'bullish':
      change = Math.random() * 2 * volatility + volatilityFactor;
      break;
    case 'bearish':
      change = -Math.random() * 2 * volatility + volatilityFactor;
      break;
    case 'volatile':
      change = (Math.random() - 0.5) * 4 * volatility;
      break;
    case 'sideways':
    default:
      change = (Math.random() - 0.5) * volatility;
  }

  const percentageChange = (change / 100) * currentPrice;
  return Math.max(0.0001, currentPrice + percentageChange);
}

/**
 * Get trading duration options for symbol
 */
export function getTradingDurations(symbol: string): number[] {
  const crypto = getCrypto(symbol);
  return crypto?.trading.supportedDurations ?? [1, 5, 15, 60];
}

/**
 * Get profit multipliers for symbol
 */
export function getProfitMultipliers(symbol: string): number[] {
  const crypto = getCrypto(symbol);
  return crypto?.trading.profitMultipliers ?? [1.5, 2, 2.5, 3];
}

/**
 * Format trade result
 */
export function formatTradeResult(
  pnl: number,
  roiPercentage: number
): string {
  const pnlFormatted = pnl >= 0 ? `+$${pnl.toFixed(2)}` : `-$${Math.abs(pnl).toFixed(2)}`;
  const roiFormatted = roiPercentage >= 0 ? `+${roiPercentage.toFixed(2)}%` : `${roiPercentage.toFixed(2)}%`;
  return `${pnlFormatted} (${roiFormatted})`;
}
