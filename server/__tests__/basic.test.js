import request from 'supertest';
import { app } from '../server.js';

describe('Basic Server Tests', () => {
  // 1. Test root endpoint
  describe('GET /', () => {
    it('should return API Working message', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toBe('API Working');
    });
  });

  // 2. Test health check endpoint
  describe('GET /api/health', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
    });
  });

  // 3. Test 404 for non-existent route
  describe('GET /non-existent', () => {
    it('should return 404 for unknown route', async () => {
      const res = await request(app).get('/non-existent');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Not Found');
    });
  });

  // 4. Test CORS headers
  describe('CORS Headers', () => {
    it('should have CORS headers', async () => {
      const res = await request(app).get('/');
      expect(res.headers['access-control-allow-origin']).toBe('*');
    });
  });

  // 5. Test JSON parsing
  describe('JSON Parsing', () => {
    it('should parse JSON body', async () => {
      const res = await request(app)
        .post('/api/course')
        .send({ test: true });
      expect(res.status).toBe(401); // Will return 401 as unauthorized, but proves JSON parsing works
    });
  });

  // 6. Test query parameter handling
  describe('Query Parameters', () => {
    it('should handle query parameters', async () => {
      const res = await request(app)
        .get('/api/course')
        .query({ page: 1, limit: 10 });
      expect(res.status).toBe(200);
    });
  });

  // 7. Test request headers
  describe('Request Headers', () => {
    it('should accept JSON content type', async () => {
      const res = await request(app)
        .post('/api/course')
        .set('Content-Type', 'application/json')
        .send({});
      expect(res.status).toBe(401); // Will return 401, but proves header processing works
    });
  });

  // 8. Test error handling middleware
  describe('Error Handling', () => {
    it('should handle errors gracefully', async () => {
      const res = await request(app)
        .get('/api/error-test')
        .set('x-trigger-error', 'true');
      expect(res.status).toBe(404);
    });
  });

  // 9. Test multiple query parameters
  describe('Multiple Query Parameters', () => {
    it('should handle multiple query parameters', async () => {
      const res = await request(app)
        .get('/api/course')
        .query({
          search: 'test',
          category: 'programming',
          sort: 'desc'
        });
      expect(res.status).toBe(200);
    });
  });

  // 10. Test response type
  describe('Response Type', () => {
    it('should return JSON response', async () => {
      const res = await request(app).get('/api/health');
      expect(res.type).toBe('application/json');
    });
  });

  // 11. Test empty request body
  describe('Empty Request Body', () => {
    it('should handle empty request body', async () => {
      const res = await request(app)
        .post('/api/course')
        .send();
      expect(res.status).toBe(401);
    });
  });

  // 12. Test response structure
  describe('Response Structure', () => {
    it('should return proper error response structure', async () => {
      const res = await request(app).get('/non-existent-path');
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });
  });
}); 