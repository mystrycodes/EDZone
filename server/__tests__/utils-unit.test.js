/**
 * Unit tests for server-side utility functions
 */

// Mock utility functions to test
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
  
  // Function to format course duration
  formatDuration: (minutes) => {
    if (typeof minutes !== 'number' || minutes < 0) {
      throw new Error('Duration must be a non-negative number');
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'}`;
    } else if (remainingMinutes === 0) {
      return `${hours} hour${hours === 1 ? '' : 's'}`;
    } else {
      return `${hours} hour${hours === 1 ? '' : 's'} ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'}`;
    }
  },
  
  // Function to validate email
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // Function to sanitize course input
  sanitizeCourseInput: (course) => {
    const sanitized = { ...course };
    if (sanitized.title) sanitized.title = sanitized.title.trim();
    if (sanitized.description) sanitized.description = sanitized.description.trim();
    return sanitized;
  },
  
  // Function to parse query params for course filtering
  parseCourseFilters: (query) => {
    const filters = {};
    if (query.category) filters.category = query.category;
    if (query.minPrice) filters.minPrice = parseFloat(query.minPrice);
    if (query.maxPrice) filters.maxPrice = parseFloat(query.maxPrice);
    if (query.search) filters.search = query.search.trim();
    return filters;
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
  }
};

// Test cases
describe('Server Utility Functions', () => {
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
    expect(() => utils.calculateDiscount(100, -1)).toThrow();
  });
  
  // Test 3: Format duration - minutes only
  test('formatDuration formats minutes correctly', () => {
    expect(utils.formatDuration(30)).toBe('30 minutes');
    expect(utils.formatDuration(1)).toBe('1 minute');
  });
  
  // Test 4: Format duration - hours only
  test('formatDuration formats hours correctly', () => {
    expect(utils.formatDuration(60)).toBe('1 hour');
    expect(utils.formatDuration(120)).toBe('2 hours');
  });
  
  // Test 5: Format duration - hours and minutes
  test('formatDuration formats hours and minutes correctly', () => {
    expect(utils.formatDuration(90)).toBe('1 hour 30 minutes');
    expect(utils.formatDuration(61)).toBe('1 hour 1 minute');
  });
  
  // Test 6: Email validation
  test('validateEmail correctly validates email addresses', () => {
    expect(utils.validateEmail('test@example.com')).toBe(true);
    expect(utils.validateEmail('test.user@example.co.uk')).toBe(true);
    expect(utils.validateEmail('invalid')).toBe(false);
    expect(utils.validateEmail('invalid@')).toBe(false);
    expect(utils.validateEmail('@example.com')).toBe(false);
  });
  
  // Test 7: Sanitize course input
  test('sanitizeCourseInput removes whitespace from inputs', () => {
    const input = {
      title: ' JavaScript Course ',
      description: ' Learn JavaScript programming  '
    };
    const expected = {
      title: 'JavaScript Course',
      description: 'Learn JavaScript programming'
    };
    expect(utils.sanitizeCourseInput(input)).toEqual(expected);
  });
  
  // Test 8: Parse course filters
  test('parseCourseFilters correctly extracts filters from query', () => {
    const query = {
      category: 'programming',
      minPrice: '10.99',
      maxPrice: '49.99',
      search: ' javascript ',
      irrelevant: 'ignore'
    };
    const expected = {
      category: 'programming',
      minPrice: 10.99,
      maxPrice: 49.99,
      search: 'javascript'
    };
    expect(utils.parseCourseFilters(query)).toEqual(expected);
  });
  
  // Test 9: Generate slug
  test('generateSlug creates correct URL-friendly slugs', () => {
    expect(utils.generateSlug('JavaScript Basics 101')).toBe('javascript-basics-101');
    expect(utils.generateSlug('React & Node.js!')).toBe('react-nodejs');
    expect(utils.generateSlug('  Spaces   Everywhere  ')).toBe('spaces-everywhere');
  });
  
  // Test 10: Calculate average rating
  test('calculateAverageRating calculates correct average', () => {
    expect(utils.calculateAverageRating([4, 5, 3, 5])).toBe(4.3);
    expect(utils.calculateAverageRating([5, 5, 5])).toBe(5.0);
    expect(utils.calculateAverageRating([])).toBe(0);
  });
  
  // Test 11: Format price
  test('formatPrice formats price with currency', () => {
    expect(utils.formatPrice(19.99)).toBe('$19.99');
    expect(utils.formatPrice(20, 'EUR')).toBe('€20.00');
  });
}); 