/**
 * Tests for e-learning platform utility functions
 */

// Utility functions for e-learning platform
const elearningUtils = {
  // Calculate course completion percentage
  calculateCompletion: (completedLessons, totalLessons) => {
    if (totalLessons === 0) return 0;
    return Math.round((completedLessons / totalLessons) * 100);
  },

  // Format time from seconds to readable format (HH:MM:SS)
  formatVideoTime: (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    const parts = [];
    if (hrs > 0) {
      parts.push(hrs.toString().padStart(2, '0'));
    }
    
    parts.push(mins.toString().padStart(2, '0'));
    parts.push(secs.toString().padStart(2, '0'));
    
    return parts.join(':');
  },

  // Calculate total course duration
  calculateTotalDuration: (lessons) => {
    return lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
  },

  // Generate certificate number
  generateCertificateNumber: (userId, courseId, timestamp = Date.now()) => {
    const prefix = 'CERT';
    const userPart = userId.toString().slice(-4).padStart(4, '0');
    const coursePart = courseId.toString().slice(-4).padStart(4, '0');
    const timePart = timestamp.toString().slice(-6);
    return `${prefix}-${userPart}-${coursePart}-${timePart}`;
  },

  // Check if user has required prerequisites for a course
  hasPrerequisites: (userCompletedCourses, requiredCourseIds) => {
    if (!requiredCourseIds || requiredCourseIds.length === 0) return true;
    return requiredCourseIds.every(id => userCompletedCourses.includes(id));
  },

  // Filter courses by difficulty level
  filterByDifficulty: (courses, level) => {
    if (!level) return courses;
    return courses.filter(course => course.difficulty === level);
  },

  // Calculate course rating average with precision
  calculateRatingAverage: (ratings, precision = 1) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((total, rating) => total + rating, 0);
    const average = sum / ratings.length;
    return parseFloat(average.toFixed(precision));
  },

  // Check if course is on sale
  isCourseOnSale: (course) => {
    if (!course.saleEndDate) return false;
    const now = new Date();
    const endDate = new Date(course.saleEndDate);
    return endDate > now;
  },

  // Format course price with discount
  formatPriceWithDiscount: (price, discountPercentage) => {
    if (!discountPercentage) return { original: price, discounted: price };
    const discounted = price - (price * (discountPercentage / 100));
    return {
      original: price,
      discounted: parseFloat(discounted.toFixed(2))
    };
  },

  // Get recommended courses based on completed courses and interests
  getRecommendedCourses: (allCourses, completedCourseIds, interests) => {
    // Filter out completed courses
    const availableCourses = allCourses.filter(course => 
      !completedCourseIds.includes(course.id)
    );
    
    // Score courses based on interests
    return availableCourses
      .map(course => {
        let score = 0;
        // Match interests with course tags/categories
        if (course.tags) {
          const matchingTags = course.tags.filter(tag => 
            interests.includes(tag)
          );
          score += matchingTags.length * 2;
        }
        if (course.category && interests.includes(course.category)) {
          score += 3;
        }
        return { ...course, score };
      })
      .sort((a, b) => b.score - a.score)
      .map(({ score, ...course }) => course); // Remove score before returning
  }
};

// Test cases
describe('E-Learning Platform Utilities', () => {
  // Test 1: Course completion percentage
  test('calculateCompletion returns correct percentage', () => {
    expect(elearningUtils.calculateCompletion(5, 10)).toBe(50);
    expect(elearningUtils.calculateCompletion(10, 10)).toBe(100);
    expect(elearningUtils.calculateCompletion(0, 10)).toBe(0);
    expect(elearningUtils.calculateCompletion(0, 0)).toBe(0);
  });
  
  // Test 2: Video time formatting
  test('formatVideoTime formats time correctly', () => {
    expect(elearningUtils.formatVideoTime(30)).toBe('00:30');
    expect(elearningUtils.formatVideoTime(70)).toBe('01:10');
    expect(elearningUtils.formatVideoTime(3661)).toBe('01:01:01');
  });
  
  // Test 3: Total course duration calculation
  test('calculateTotalDuration sums lesson durations', () => {
    const lessons = [
      { title: 'Intro', duration: 300 },
      { title: 'Chapter 1', duration: 900 },
      { title: 'Chapter 2', duration: 1200 }
    ];
    expect(elearningUtils.calculateTotalDuration(lessons)).toBe(2400);
    expect(elearningUtils.calculateTotalDuration([])).toBe(0);
  });
  
  // Test 4: Certificate number generation
  test('generateCertificateNumber creates formatted certificate numbers', () => {
    const result = elearningUtils.generateCertificateNumber('12345', '67890', 1617283945000);
    expect(result).toMatch(/CERT-\d{4}-\d{4}-\d{6}/);
    expect(result).toBe('CERT-2345-7890-945000');
  });
  
  // Test 5: Prerequisites check
  test('hasPrerequisites checks course prerequisites', () => {
    expect(elearningUtils.hasPrerequisites(['101', '102', '103'], ['101', '102'])).toBe(true);
    expect(elearningUtils.hasPrerequisites(['101', '103'], ['101', '102'])).toBe(false);
    expect(elearningUtils.hasPrerequisites(['101', '102'], [])).toBe(true);
    expect(elearningUtils.hasPrerequisites([], ['101'])).toBe(false);
  });
  
  // Test 6: Course difficulty filtering
  test('filterByDifficulty filters courses by level', () => {
    const courses = [
      { id: '1', title: 'Intro to JS', difficulty: 'beginner' },
      { id: '2', title: 'Advanced JS', difficulty: 'advanced' },
      { id: '3', title: 'Intermediate JS', difficulty: 'intermediate' },
      { id: '4', title: 'React Basics', difficulty: 'beginner' }
    ];
    
    expect(elearningUtils.filterByDifficulty(courses, 'beginner')).toHaveLength(2);
    expect(elearningUtils.filterByDifficulty(courses, 'advanced')).toHaveLength(1);
    expect(elearningUtils.filterByDifficulty(courses, null)).toEqual(courses);
  });
  
  // Test 7: Rating average calculation
  test('calculateRatingAverage calculates correct average with precision', () => {
    expect(elearningUtils.calculateRatingAverage([4, 5, 3, 5])).toBe(4.3);
    expect(elearningUtils.calculateRatingAverage([4, 5, 3, 5], 2)).toBe(4.25);
    expect(elearningUtils.calculateRatingAverage([])).toBe(0);
  });
  
  // Test 8: Course sale status
  test('isCourseOnSale determines if course is on sale', () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    expect(elearningUtils.isCourseOnSale({ saleEndDate: nextWeek })).toBe(true);
    expect(elearningUtils.isCourseOnSale({ saleEndDate: lastWeek })).toBe(false);
    expect(elearningUtils.isCourseOnSale({})).toBe(false);
  });
  
  // Test 9: Price with discount calculation
  test('formatPriceWithDiscount calculates discounted price', () => {
    expect(elearningUtils.formatPriceWithDiscount(100, 20)).toEqual({
      original: 100,
      discounted: 80
    });
    expect(elearningUtils.formatPriceWithDiscount(49.99, 10)).toEqual({
      original: 49.99,
      discounted: 44.99
    });
    expect(elearningUtils.formatPriceWithDiscount(100, 0)).toEqual({
      original: 100,
      discounted: 100
    });
  });
  
  // Test 10: Course recommendations
  test('getRecommendedCourses returns personalized recommendations', () => {
    const courses = [
      { id: '1', title: 'JavaScript', category: 'programming', tags: ['web', 'javascript'] },
      { id: '2', title: 'React', category: 'programming', tags: ['web', 'javascript', 'react'] },
      { id: '3', title: 'Node.js', category: 'programming', tags: ['javascript', 'backend'] },
      { id: '4', title: 'UX Design', category: 'design', tags: ['web', 'design'] }
    ];
    
    const completedCourseIds = ['1'];
    const interests = ['javascript', 'backend'];
    
    const recommendations = elearningUtils.getRecommendedCourses(
      courses, 
      completedCourseIds, 
      interests
    );
    
    // Node.js should be first (matches both interests)
    expect(recommendations[0].id).toBe('3');
    expect(recommendations).toHaveLength(3);
    expect(recommendations.find(c => c.id === '1')).toBeUndefined();
  });
}); 