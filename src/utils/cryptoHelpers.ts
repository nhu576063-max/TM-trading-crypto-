/**
 * Cryptocurrency Utilities
 * Helpers for working with cryptocurrencies and pricing
 */

import { CRYPTOCURRENCIES, Cryptocurrency } from '@constants/cryptocurrencies';

/**
 * Get cryptocurrency by symbol
 */
export function getCrypto(symbol: string): Cryptocurrency | undefined {
  return CRYPTOCURRENCIES[symbol];
}

/**
 * Format price with proper decimals
 */
export function formatPrice(price: number, decimals: number = 2): string {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format cryptocurrency amount
 */
export function formatCryptoAmount(amount: number, symbol: string, decimals?: number): string {
  const crypto = getCrypto(symbol);
  const precision = decimals ?? crypto?.wallet.displayPrecision ?? 2;
  return formatPrice(amount, precision);
}

/**
 * Convert cryptocurrency to USD
 */
export function toUSD(amount: number, symbol: string): number {
  const crypto = getCrypto(symbol);
  if (!crypto) return 0;
  return amount * crypto.marketData.currentPrice;
}

/**
 * Convert USD to cryptocurrency
 */
export function fromUSD(usdAmount: number, symbol: string): number {
  const crypto = getCrypto(symbol);
  if (!crypto) return 0;
  return usdAmount / crypto.marketData.currentPrice;
}

/**
 * Format USD amount
 */
export function formatUSD(amount: number): string {
  return `$${formatPrice(amount, 2)}`;
}

/**
 * Calculate percentage change
 */
export function calculatePercentage(original: number, current: number): number {
  if (original === 0) return 0;
  return ((current - original) / original) * 100;
}

/**
 * Format percentage
 */
export function formatPercentage(percentage: number, decimals: number = 2): string {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(decimals)}%`;
}

/**
 * Calculate profit
 */
export function calculateProfit(entryPrice: number, exitPrice: number, quantity: number): number {
  return (exitPrice - entryPrice) * quantity;
}

/**
 * Calculate profit percentage
 */
export function calculateProfitPercentage(entryPrice: number, exitPrice: number): number {
  return calculatePercentage(entryPrice, exitPrice);
}

/**
 * Get price change color (green for positive, red for negative)
 */
export function getPriceChangeColor(change: number): 'green' | 'red' | 'gray' {
  if (change > 0) return 'green';
  if (change < 0) return 'red';
  return 'gray';
}

/**
 * Sort cryptocurrencies by market cap
 */
export function sortByMarketCap(): Cryptocurrency[] {
  return Object.values(CRYPTOCURRENCIES).sort(
    (a, b) => b.marketData.marketCap - a.marketData.marketCap
  );
}

/**
 * Sort cryptocurrencies by price
 */
export function sortByPrice(): Cryptocurrency[] {
  return Object.values(CRYPTOCURRENCIES).sort(
    (a, b) => b.marketData.currentPrice - a.marketData.currentPrice
  );
}

/**
 * Get top gainers (highest 24h change)
 */
export function getTopGainers(limit: number = 10): Cryptocurrency[] {
  return Object.values(CRYPTOCURRENCIES)
    .sort((a, b) => b.marketData.change24h - a.marketData.change24h)
    .slice(0, limit);
}

/**
 * Get top losers (lowest 24h change)
 */
export function getTopLosers(limit: number = 10): Cryptocurrency[] {
  return Object.values(CRYPTOCURRENCIES)
    .sort((a, b) => a.marketData.change24h - b.marketData.change24h)
    .slice(0, limit);
}

/**
 * Filter cryptocurrencies by category
 */
export function filterByCategory(category: string): Cryptocurrency[] {
  return Object.values(CRYPTOCURRENCIES).filter(c => c.category === category);
}

/**
 * Get stablecoins
 */
export function getStablecoins(): Cryptocurrency[] {
  return filterByCategory('stablecoin');
}

/**
 * Get memecoins
 */
export function getMemecoins(): Cryptocurrency[] {
  return filterByCategory('memecoin');
}

/**
 * Check if cryptocurrency is tradeable
 */
export function isTradeable(symbol: string): boolean {
  const crypto = getCrypto(symbol);
  return crypto?.trading.tradingEnabled ?? false;
}

/**
 * Get trading limits for cryptocurrency
 */
export function getTradingLimits(symbol: string) {
  const crypto = getCrypto(symbol);
  if (!crypto) return null;
  return {
    minTrade: crypto.trading.minTrade,
    maxTrade: crypto.trading.maxTrade,
    profitMultipliers: crypto.trading.profitMultipliers,
  };
}
