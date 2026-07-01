/**
 * Data Utilities
 * Helpers for data manipulation
 */

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) {
    const arr: any[] = [];
    for (let i = 0; i < obj.length; i++) {
      arr[i] = deepClone(obj[i]);
    }
    return arr as any;
  }
  if (obj instanceof Object) {
    const clonedObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone((obj as any)[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const result = deepClone(target);

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
        result[key] = deepMerge(
          targetValue || {},
          sourceValue as any
        );
      } else {
        result[key] = sourceValue as any;
      }
    }
  }

  return result;
}

/**
 * Get unique values from array
 */
export function getUniqueValues<T>(
  arr: T[],
  key?: keyof T
): T[] {
  if (key) {
    const seen = new Set();
    return arr.filter(item => {
      const value = (item as any)[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }
  return Array.from(new Set(arr));
}

/**
 * Sort array
 */
export function sortArray<T>(
  arr: T[],
  compareFn: (a: T, b: T) => number
): T[] {
  return [...arr].sort(compareFn);
}

/**
 * Sort array by property
 */
export function sortByProperty<T extends Record<string, any>>(
  arr: T[],
  property: keyof T,
  ascending: boolean = true
): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return ascending ? comparison : -comparison;
  });
}

/**
 * Filter array
 */
export function filterArray<T>(
  arr: T[],
  predicate: (item: T) => boolean
): T[] {
  return arr.filter(predicate);
}

/**
 * Group array by property
 */
export function groupByProperty<T extends Record<string, any>>(
  arr: T[],
  property: keyof T
): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const key = String(item[property]);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Paginate array
 */
export function paginate<T>(
  arr: T[],
  page: number,
  pageSize: number
): { items: T[]; total: number; totalPages: number } {
  const total = arr.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    items: arr.slice(start, end),
    total,
    totalPages,
  };
}

/**
 * Safe JSON parse
 */
export function safeJsonParse<T = any>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('JSON parse error:', error);
    return fallback;
  }
}

/**
 * Safe JSON stringify
 */
export function safeJsonStringify(obj: any, fallback: string = '{}'): string {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.error('JSON stringify error:', error);
    return fallback;
  }
}
