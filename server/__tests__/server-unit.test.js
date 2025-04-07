/**
 * Server-side unit tests for EDZone
 */

// Import required testing utilities
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';

// Create mock app for testing
const app = express();

// Mock authentication middleware
const mockAuthMiddleware = (req, res, next) => {
  if (req.headers.authorization === 'Bearer valid-token') {
    req.auth = { userId: 'test-user-id' };
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Mock course utility function
const findCourseById = (id) => {
  const courses = {
    '1': { id: '1', title: 'JavaScript Basics', price: 29.99, authorId: 'test-user-id' },
    '2': { id: '2', title: 'React Fundamentals', price: 49.99, authorId: 'other-user-id' }
  };
  return courses[id];
};

// Mock user utility
const getUserById = (id) => {
  const users = {
    'test-user-id': { id: 'test-user-id', name: 'Test User', email: 'test@example.com', role: 'instructor' },
    'student-id': { id: 'student-id', name: 'Student', email: 'student@example.com', role: 'student' }
  };
  return users[id];
};

// Mock validator function
const validateCourse = (course) => {
  const errors = [];
  if (!course.title) errors.push('Title is required');
  if (!course.price) errors.push('Price is required');
  if (course.price && course.price < 0) errors.push('Price cannot be negative');
  return errors;
};

// Set up test routes
app.use(express.json());
app.use('/api/courses/:id', mockAuthMiddleware);

app.get('/api/courses/:id', (req, res) => {
  const course = findCourseById(req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json(course);
});

app.post('/api/courses', mockAuthMiddleware, (req, res) => {
  const errors = validateCourse(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  res.status(201).json({ ...req.body, id: '3', authorId: req.auth.userId });
});

app.get('/api/users/:id', mockAuthMiddleware, (req, res) => {
  const user = getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  // Remove sensitive data
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Unit test cases
describe('Server-side Unit Tests', () => {
  // Test 1: Authentication middleware
  test('Authentication middleware rejects invalid token', async () => {
    const response = await request(app)
      .get('/api/courses/1')
      .set('Authorization', 'Bearer invalid-token');
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  // Test 2: Authentication middleware accepts valid token
  test('Authentication middleware accepts valid token', async () => {
    const response = await request(app)
      .get('/api/courses/1')
      .set('Authorization', 'Bearer valid-token');
    
    expect(response.status).toBe(200);
  });

  // Test 3: Course retrieval by ID
  test('GET /api/courses/:id returns correct course', async () => {
    const response = await request(app)
      .get('/api/courses/1')
      .set('Authorization', 'Bearer valid-token');
    
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('JavaScript Basics');
    expect(response.body.price).toBe(29.99);
  });

  // Test 4: Course not found
  test('GET /api/courses/:id returns 404 for non-existent course', async () => {
    const response = await request(app)
      .get('/api/courses/999')
      .set('Authorization', 'Bearer valid-token');
    
    expect(response.status).toBe(404);
  });

  // Test 5: Course validation - missing title
  test('POST /api/courses validates required fields', async () => {
    const response = await request(app)
      .post('/api/courses')
      .set('Authorization', 'Bearer valid-token')
      .send({ price: 19.99 });
    
    expect(response.status).toBe(400);
    expect(response.body.errors).toContain('Title is required');
  });

  // Test 6: Course validation - negative price
  test('POST /api/courses validates price is not negative', async () => {
    const response = await request(app)
      .post('/api/courses')
      .set('Authorization', 'Bearer valid-token')
      .send({ title: 'Test Course', price: -10 });
    
    expect(response.status).toBe(400);
    expect(response.body.errors).toContain('Price cannot be negative');
  });

  // Test 7: Course creation success
  test('POST /api/courses creates a new course', async () => {
    const response = await request(app)
      .post('/api/courses')
      .set('Authorization', 'Bearer valid-token')
      .send({ title: 'New Course', price: 19.99 });
    
    expect(response.status).toBe(201);
    expect(response.body.title).toBe('New Course');
    expect(response.body.authorId).toBe('test-user-id');
  });

  // Test 8: User retrieval by ID
  test('GET /api/users/:id returns user without password', async () => {
    const response = await request(app)
      .get('/api/users/test-user-id')
      .set('Authorization', 'Bearer valid-token');
    
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Test User');
    expect(response.body.password).toBeUndefined();
  });

  // Test 9: User not found
  test('GET /api/users/:id returns 404 for non-existent user', async () => {
    const response = await request(app)
      .get('/api/users/nonexistent')
      .set('Authorization', 'Bearer valid-token');
    
    expect(response.status).toBe(404);
  });

  // Test 10: Course finder utility function
  test('findCourseById returns correct course object', () => {
    const course = findCourseById('2');
    expect(course).toBeDefined();
    expect(course.title).toBe('React Fundamentals');
    expect(course.price).toBe(49.99);
  });
}); 