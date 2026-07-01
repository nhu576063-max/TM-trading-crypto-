/**
 * Error Handling Utilities
 * Centralized error management
 */

export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

/**
 * Format error for logging
 */
export function formatError(error: any): AppError {
  const now = new Date().toISOString();

  if (error instanceof Error) {
    return {
      code: 'ERROR',
      message: error.message,
      details: { stack: error.stack },
      timestamp: now,
    };
  }

  if (typeof error === 'string') {
    return {
      code: 'ERROR',
      message: error,
      timestamp: now,
    };
  }

  return {
    code: error.code || 'UNKNOWN_ERROR',
    message: error.message || 'An unknown error occurred',
    details: error.details,
    timestamp: now,
  };
}

/**
 * Log error
 */
export function logError(error: any, context?: string): void {
  const appError = formatError(error);
  console.error(
    `[${appError.code}] ${context ? `(${context}) ` : ''}${appError.message}`,
    appError.details
  );
}

/**
 * Safe execution wrapper
 */
export async function safeExecute<T>(
  fn: () => Promise<T>,
  fallback: T,
  context?: string
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logError(error, context);
    return fallback;
  }
}

/**
 * Safe sync execution
 */
export function safeExecuteSync<T>(
  fn: () => T,
  fallback: T,
  context?: string
): T {
  try {
    return fn();
  } catch (error) {
    logError(error, context);
    return fallback;
  }
}

/**
 * Create custom error
 */
export function createError(
  code: string,
  message: string,
  details?: Record<string, any>
): AppError {
  return {
    code,
    message,
    details,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Map validation errors
 */
export function mapValidationErrors(
  errors: Record<string, string>
): Record<string, string> {
  const mapped: Record<string, string> = {};
  for (const [field, message] of Object.entries(errors)) {
    mapped[field] = message;
  }
  return mapped;
}
