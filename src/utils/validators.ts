/**
 * Validation Utilities
 * Reusable validators for all entities
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  return { isValid: true };
}

/**
 * Validate password
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }
  return { isValid: true };
}

/**
 * Validate username
 */
export function validateUsername(username: string): ValidationResult {
  if (!username) {
    return { isValid: false, error: 'Username is required' };
  }
  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters' };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
  }
  return { isValid: true };
}

/**
 * Validate wallet address
 */
export function validateWalletAddress(address: string): ValidationResult {
  if (!address) {
    return { isValid: false, error: 'Wallet address is required' };
  }
  if (address.length < 26) {
    return { isValid: false, error: 'Invalid wallet address' };
  }
  return { isValid: true };
}

/**
 * Validate ID format
 */
export function validateId(id: string): ValidationResult {
  if (!id) {
    return { isValid: false, error: 'ID is required' };
  }
  if (id.length < 5) {
    return { isValid: false, error: 'Invalid ID format' };
  }
  return { isValid: true };
}

/**
 * Validate positive number
 */
export function validatePositiveNumber(value: number): ValidationResult {
  if (value === undefined || value === null) {
    return { isValid: false, error: 'Value is required' };
  }
  if (value <= 0) {
    return { isValid: false, error: 'Value must be greater than 0' };
  }
  return { isValid: true };
}

/**
 * Validate amount range
 */
export function validateAmountRange(
  amount: number,
  min: number,
  max: number
): ValidationResult {
  const positive = validatePositiveNumber(amount);
  if (!positive.isValid) return positive;

  if (amount < min) {
    return { isValid: false, error: `Minimum amount is ${min}` };
  }
  if (amount > max) {
    return { isValid: false, error: `Maximum amount is ${max}` };
  }
  return { isValid: true };
}

/**
 * Validate decimal precision
 */
export function validateDecimalPrecision(
  value: number,
  maxDecimals: number
): ValidationResult {
  const decimalPart = value.toString().split('.')[1];
  const decimals = decimalPart ? decimalPart.length : 0;
  if (decimals > maxDecimals) {
    return { isValid: false, error: `Maximum ${maxDecimals} decimal places allowed` };
  }
  return { isValid: true };
}

/**
 * Validate required field
 */
export function validateRequired(value: any): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: 'This field is required' };
  }
  return { isValid: true };
}

/**
 * Validate string length
 */
export function validateStringLength(
  value: string,
  min: number,
  max: number
): ValidationResult {
  if (!value) {
    return { isValid: false, error: 'This field is required' };
  }
  if (value.length < min) {
    return { isValid: false, error: `Minimum ${min} characters required` };
  }
  if (value.length > max) {
    return { isValid: false, error: `Maximum ${max} characters allowed` };
  }
  return { isValid: true };
}

/**
 * Validate array not empty
 */
export function validateArrayNotEmpty<T>(array: T[]): ValidationResult {
  if (!Array.isArray(array) || array.length === 0) {
    return { isValid: false, error: 'At least one item is required' };
  }
  return { isValid: true };
}
