import { isEqual } from './isEqual';

describe('isEqual', () => {
  describe('primitive values', () => {
    it('should return true for identical primitives', () => {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual('test', 'test')).toBe(true);
      expect(isEqual(true, true)).toBe(true);
      expect(isEqual(false, false)).toBe(true);
    });

    it('should return false for different primitives', () => {
      expect(isEqual(1, 2)).toBe(false);
      expect(isEqual('test', 'other')).toBe(false);
      expect(isEqual(true, false)).toBe(false);
      expect(isEqual(1, '1')).toBe(false);
    });
  });

  describe('null and undefined', () => {
    it('should handle null values correctly', () => {
      expect(isEqual(null, null)).toBe(true);
      expect(isEqual(null, undefined)).toBe(false);
      expect(isEqual(null, 0)).toBe(false);
      expect(isEqual(null, '')).toBe(false);
    });

    it('should handle undefined values correctly', () => {
      expect(isEqual(undefined, undefined)).toBe(true);
      expect(isEqual(undefined, null)).toBe(false);
      expect(isEqual(undefined, 0)).toBe(false);
    });
  });

  describe('arrays', () => {
    it('should return true for identical arrays', () => {
      expect(isEqual([], [])).toBe(true);
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isEqual(['a', 'b'], ['a', 'b'])).toBe(true);
    });

    it('should return false for different arrays', () => {
      expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
      expect(isEqual(['a'], ['b'])).toBe(false);
    });

    it('should handle nested arrays', () => {
      expect(isEqual([[1, 2], [3, 4]], [[1, 2], [3, 4]])).toBe(true);
      expect(isEqual([[1, 2], [3, 4]], [[1, 2], [3, 5]])).toBe(false);
    });

    it('should not confuse arrays with objects', () => {
      expect(isEqual([1, 2], { 0: 1, 1: 2 })).toBe(false);
    });
  });

  describe('objects', () => {
    it('should return true for identical objects', () => {
      expect(isEqual({}, {})).toBe(true);
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(isEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true); // Order doesn't matter
    });

    it('should return false for different objects', () => {
      expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
      expect(isEqual({ a: 1 }, { b: 1 })).toBe(false);
      expect(isEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    });

    it('should handle nested objects', () => {
      const obj1 = { a: { b: { c: 1 } }, d: 2 };
      const obj2 = { a: { b: { c: 1 } }, d: 2 };
      const obj3 = { a: { b: { c: 2 } }, d: 2 };
      
      expect(isEqual(obj1, obj2)).toBe(true);
      expect(isEqual(obj1, obj3)).toBe(false);
    });
  });

  describe('mixed types', () => {
    it('should handle objects with arrays', () => {
      const obj1 = { tags: ['recipe', 'food'], title: 'Test' };
      const obj2 = { tags: ['recipe', 'food'], title: 'Test' };
      const obj3 = { tags: ['recipe'], title: 'Test' };
      
      expect(isEqual(obj1, obj2)).toBe(true);
      expect(isEqual(obj1, obj3)).toBe(false);
    });

    it('should handle arrays with objects', () => {
      const arr1 = [{ id: 1, name: 'test' }, { id: 2, name: 'other' }];
      const arr2 = [{ id: 1, name: 'test' }, { id: 2, name: 'other' }];
      const arr3 = [{ id: 1, name: 'test' }, { id: 2, name: 'different' }];
      
      expect(isEqual(arr1, arr2)).toBe(true);
      expect(isEqual(arr1, arr3)).toBe(false);
    });
  });

  describe('recipe data use cases', () => {
    it('should work with recipe-like objects', () => {
      const recipe1 = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Chocolate Cake',
        tags: ['dessert', 'chocolate'],
        emoji: '🎂',
        isPublic: false,
        content: '<p>Mix ingredients...</p>'
      };

      const recipe2 = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Chocolate Cake',
        tags: ['dessert', 'chocolate'],
        emoji: '🎂',
        isPublic: false,
        content: '<p>Mix ingredients...</p>'
      };

      const recipe3 = {
        ...recipe1,
        title: 'Vanilla Cake'
      };

      expect(isEqual(recipe1, recipe2)).toBe(true);
      expect(isEqual(recipe1, recipe3)).toBe(false);
    });

    it('should detect changes in editable data', () => {
      const initialData = {
        title: 'Recipe Title',
        content: 'Recipe content',
        tags: ['tag1', 'tag2'],
        imageURL: '',
        emoji: '🍰',
        isPublic: false
      };

      const unchangedData = { ...initialData };
      const changedData = { ...initialData, title: 'New Title' };

      expect(isEqual(initialData, unchangedData)).toBe(true);
      expect(isEqual(initialData, changedData)).toBe(false);
    });
  });
});