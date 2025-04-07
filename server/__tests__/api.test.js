import request from 'supertest';
import { app } from './test-server.js';
import { connect, closeDatabase, clearDatabase } from './setup.js';

describe('API Endpoints Tests', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  // Test the health check endpoint
  describe('GET /api/health', () => {
    it('should return 200 and healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
    });
  });

  // Test 404 for non-existent routes
  describe('Non-existent routes', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/nonexistent');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Not Found');
    });
  });

  // 2. Test user registration validation
  describe('POST /api/auth/register', () => {
    it('should validate required fields for registration', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({});
      expect(res.status).toBe(400);
    });
  });

  // 3. Test course creation validation
  describe('POST /api/courses', () => {
    it('should require authentication for course creation', async () => {
      const res = await request(app)
        .post('/api/courses')
        .send({
          title: 'Test Course',
          description: 'Test Description'
        });
      expect(res.status).toBe(401);
    });
  });

  // 4. Test course listing
  describe('GET /api/courses', () => {
    it('should return an array of courses', async () => {
      const res = await request(app).get('/api/courses');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // 6. Test search functionality
  describe('GET /api/courses/search', () => {
    it('should handle empty search query', async () => {
      const res = await request(app)
        .get('/api/courses/search')
        .query({ q: '' });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // 7. Test course filtering
  describe('GET /api/courses/filter', () => {
    it('should filter courses by category', async () => {
      const res = await request(app)
        .get('/api/courses/filter')
        .query({ category: 'programming' });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // 8. Test course rating
  describe('POST /api/courses/:id/rate', () => {
    it('should require authentication for rating', async () => {
      const res = await request(app)
        .post('/api/courses/123/rate')
        .send({ rating: 5 });
      expect(res.status).toBe(401);
    });
  });

  // 9. Test user profile
  describe('GET /api/users/profile', () => {
    it('should require authentication for profile access', async () => {
      const res = await request(app).get('/api/users/profile');
      expect(res.status).toBe(401);
    });
  });

  // 10. Test course enrollment
  describe('POST /api/courses/:id/enroll', () => {
    it('should require authentication for enrollment', async () => {
      const res = await request(app)
        .post('/api/courses/123/enroll');
      expect(res.status).toBe(401);
    });
  });

  // 11. Test course content access
  describe('GET /api/courses/:id/content', () => {
    it('should require authentication for content access', async () => {
      const res = await request(app)
        .get('/api/courses/123/content');
      expect(res.status).toBe(401);
    });
  });

  // 12. Test input sanitization
  describe('Input Sanitization', () => {
    it('should handle special characters in search query', async () => {
      const res = await request(app)
        .get('/api/courses/search')
        .query({ q: '<script>alert("xss")</script>' });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
}); 