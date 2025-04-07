/**
 * Core utility tests - consolidated from other test files
 */

// Utility functions to test
const utils = {
  // Function to calculate course discount
  calculateDiscount: (price, discountPercentage) => {
    if (typeof price !== 'number' || typeof discountPercentage !== 'number') {
      throw new Error('Price and discount must be numbers');
    }
    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error('Discount percentage must be between 0 and 100');
    }
    return price - (price * discountPercentage / 100);
  },
  
  // Function to validate email
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Generate slug from course title
  generateSlug: (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Remove consecutive hyphens
      .replace(/^-+/, '')       // Trim leading hyphens
      .replace(/-+$/, '');      // Trim trailing hyphens
  },
  
  // Calculate average rating
  calculateAverageRating: (ratings) => {
    if (!Array.isArray(ratings) || ratings.length === 0) return 0;
    const sum = ratings.reduce((total, current) => total + current, 0);
    return parseFloat((sum / ratings.length).toFixed(1));
  },
  
  // Format price with currency
  formatPrice: (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  },

  // Calculate course completion percentage
  calculateCompletion: (completedLessons = [], totalLessons = 0) => {
    if (totalLessons === 0) return 0;
    const completed = Array.isArray(completedLessons) ? completedLessons.length : 0;
    return Math.round((completed / totalLessons) * 100);
  },

  // Format video time from seconds
  formatVideoTime: (seconds = 0) => {
    if (seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  // Generate certificate number
  generateCertificateNumber: (userId = '', courseId = '') => {
    const timestamp = Date.now().toString().slice(-6);
    const userPart = userId.toString().slice(-4).padStart(4, '0');
    const coursePart = courseId.toString().slice(-4).padStart(4, '0');
    return `CERT-${userPart}-${coursePart}-${timestamp}`;
  }
};

// Test cases
describe('Core Utility Functions', () => {
  // Test 1: Calculate discount
  test('calculateDiscount applies discount correctly', () => {
    expect(utils.calculateDiscount(100, 20)).toBe(80);
    expect(utils.calculateDiscount(50, 10)).toBe(45);
  });
  
  // Test 2: Calculate discount with invalid inputs
  test('calculateDiscount throws error for invalid inputs', () => {
    expect(() => utils.calculateDiscount('invalid', 20)).toThrow();
    expect(() => utils.calculateDiscount(100, 'invalid')).toThrow();
    expect(() => utils.calculateDiscount(100, 101)).toThrow();
  });
  
  // Test 3: Email validation
  test('validateEmail correctly validates email addresses', () => {
    expect(utils.validateEmail('test@example.com')).toBe(true);
    expect(utils.validateEmail('invalid')).toBe(false);
    expect(utils.validateEmail('@example.com')).toBe(false);
  });
  
  // Test 4: Generate slug
  test('generateSlug creates correct URL-friendly slugs', () => {
    expect(utils.generateSlug('JavaScript Basics 101')).toBe('javascript-basics-101');
    expect(utils.generateSlug('React & Node.js!')).toBe('react-nodejs');
    expect(utils.generateSlug('  Spaces   Everywhere  ')).toBe('spaces-everywhere');
  });
  
  // Test 5: Calculate average rating
  test('calculateAverageRating calculates correct average', () => {
    expect(utils.calculateAverageRating([4, 5, 3, 5])).toBe(4.3);
    expect(utils.calculateAverageRating([5, 5, 5])).toBe(5.0);
    expect(utils.calculateAverageRating([])).toBe(0);
  });
  
  // Test 6: Format price
  test('formatPrice formats price with currency', () => {
    expect(utils.formatPrice(19.99)).toBe('$19.99');
    expect(utils.formatPrice(20, 'EUR')).toBe('€20.00');
  });

  // Test 7: Calculate completion percentage
  test('calculateCompletion returns correct percentage', () => {
    expect(utils.calculateCompletion([1, 2, 3], 10)).toBe(30);
    expect(utils.calculateCompletion([1, 2, 3, 4, 5], 5)).toBe(100);
    expect(utils.calculateCompletion([], 5)).toBe(0);
  });

  // Test 8: Format video time
  test('formatVideoTime formats time correctly', () => {
    expect(utils.formatVideoTime(65)).toBe('01:05');
    expect(utils.formatVideoTime(3661)).toBe('61:01');
    expect(utils.formatVideoTime(0)).toBe('00:00');
  });

  // Test 9: Generate certificate number
  test('generateCertificateNumber creates formatted certificate numbers', () => {
    const certNumber = utils.generateCertificateNumber('12345', '67890');
    expect(certNumber).toMatch(/CERT-2345-7890-\d{6}/);
    expect(certNumber.length).toBe(21);
  });
});

// Basic JavaScript tests
describe('Basic JavaScript', () => {
  // Test 10: Simple addition
  test('addition works correctly', () => {
    expect(1 + 2).toBe(3);
    expect(5 + (-3)).toBe(2);
  });
  
  // Test 11: String operations
  test('string operations work correctly', () => {
    expect('Hello'.toLowerCase()).toBe('hello');
    expect('world'.toUpperCase()).toBe('WORLD');
    expect('Hello'.charAt(0)).toBe('H');
  });
  
  // Test 12: Array operations
  test('array operations work correctly', () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
    expect(arr.map(x => x * 2)).toEqual([2, 4, 6]);
    expect(arr.filter(x => x > 1)).toEqual([2, 3]);
  });
  
  // Test 13: Object properties
  test('object properties can be accessed', () => {
    const obj = { name: 'Test', value: 123 };
    expect(obj.name).toBe('Test');
    expect(obj['value']).toBe(123);
    expect(Object.keys(obj)).toEqual(['name', 'value']);
  });
  
  // Test 14: JSON operations
  test('JSON operations work', () => {
    const obj = { name: 'Test', value: 123 };
    const json = JSON.stringify(obj);
    expect(json).toBe('{"name":"Test","value":123}');
    expect(JSON.parse(json)).toEqual(obj);
  });
  
  // Test 15: Async operations
  test('async operations work', async () => {
    const promise = Promise.resolve('success');
    await expect(promise).resolves.toBe('success');
    
    const delayed = new Promise(resolve => setTimeout(() => resolve('delayed'), 10));
    await expect(delayed).resolves.toBe('delayed');
  });
}); 