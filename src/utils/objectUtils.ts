// Simple object comparison utility to replace fast-deep-equal
// This handles the specific use cases in our codebase

export const isEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  
  if (a == null || b == null) return a === b;
  
  if (typeof a !== typeof b) return false;
  
  if (typeof a !== 'object') return a === b;
  
  const aArray = Array.isArray(a);
  const bArray = Array.isArray(b);
  
  if (aArray !== bArray) return false;
  
  if (aArray) {
    const aLength = (a as unknown[]).length;
    const bLength = (b as unknown[]).length;
    
    if (aLength !== bLength) return false;
    
    for (let i = 0; i < aLength; i++) {
      if (!isEqual((a as unknown[])[i], (b as unknown[])[i])) return false;
    }
    
    return true;
  }
  
  const aKeys = Object.keys(a as object);
  const bKeys = Object.keys(b as object);
  
  if (aKeys.length !== bKeys.length) return false;
  
  for (const key of aKeys) {
    if (!bKeys.includes(key)) return false;
    if (!isEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) return false;
  }
  
  return true;
};