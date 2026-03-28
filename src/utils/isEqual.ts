/**
 * Deep equality comparison utility function
 * Replaces fast-deep-equal dependency with a lightweight implementation
 * 
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns true if values are deeply equal, false otherwise
 */
export const isEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) {
    return true;
  }
  
  if (a == null || b == null) {
    return a === b;
  }
  
  if (typeof a !== typeof b) {
    return false;
  }
  
  if (typeof a !== 'object') {
    return a === b;
  }
  
  const aArray = Array.isArray(a);
  const bArray = Array.isArray(b);
  
  if (aArray !== bArray) {
    return false;
  }
  
  if (aArray) {
    const aLength = (a as unknown[]).length;
    const bLength = (b as unknown[]).length;
    
    if (aLength !== bLength) {
      return false;
    }
    
    for (let i = 0; i < aLength; i++) {
      if (!isEqual((a as unknown[])[i], (b as unknown[])[i])) {
        return false;
      }
    }
    
    return true;
  }
  
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  
  for (const key of aKeys) {
    if (!bKeys.includes(key)) {
      return false;
    }
    if (!isEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
      return false;
    }
  }
  
  return true;
};