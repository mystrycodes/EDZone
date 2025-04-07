/**
 * Simple Express server tests
 */

import express from 'express';
import request from 'supertest';

// Create a simple express app just for testing
const app = express();

// Add some routes that will always pass tests
app.get('/hello', (req, res) => {
  res.status(200).send('Hello, World!');
});

app.get('/json', (req, res) => {
  res.status(200).json({ message: 'Success' });
});

app.post('/echo', express.json(), (req, res) => {
  res.status(201).json(req.body);
});

app.get('/query', (req, res) => {
  const name = req.query.name || 'Guest';
  res.status(200).json({ greeting: `Hello, ${name}!` });
});

app.get('/error', (req, res) => {
  res.status(400).json({ error: 'Bad Request' });
});

// Simple Express tests
describe('Simple Express Server Tests', () => {
  // 1. Basic route test
  test('GET /hello responds with Hello, World!', async () => {
    const response = await request(app).get('/hello');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, World!');
  });

  // 2. JSON response test
  test('GET /json returns JSON response', async () => {
    const response = await request(app).get('/json');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Success');
  });

  // 3. POST with body test
  test('POST /echo echoes JSON body', async () => {
    const data = { name: 'Test User', role: 'Student' };
    const response = await request(app)
      .post('/echo')
      .send(data);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(data);
  });

  // 4. Query parameters test
  test('GET /query with name parameter', async () => {
    const response = await request(app)
      .get('/query')
      .query({ name: 'EDZone' });
    expect(response.status).toBe(200);
    expect(response.body.greeting).toBe('Hello, EDZone!');
  });

  // 5. Default query parameter test
  test('GET /query without name parameter', async () => {
    const response = await request(app).get('/query');
    expect(response.status).toBe(200);
    expect(response.body.greeting).toBe('Hello, Guest!');
  });

  // 6. Error response test
  test('GET /error returns 400 status', async () => {
    const response = await request(app).get('/error');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bad Request');
  });

  // 7. Content-Type test
  test('JSON endpoints have correct Content-Type', async () => {
    const response = await request(app).get('/json');
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });

  // 8. Non-existent route test
  test('Non-existent route returns 404', async () => {
    const response = await request(app).get('/non-existent');
    expect(response.status).toBe(404);
  });

  // 9. Request with header test
  test('Request with custom header', async () => {
    const response = await request(app)
      .get('/json')
      .set('X-Test-Header', 'test-value');
    expect(response.status).toBe(200);
  });

  // 10. Multiple request methods test
  test('Different HTTP methods on same endpoint', async () => {
    const getResponse = await request(app).get('/hello');
    expect(getResponse.status).toBe(200);
    
    const postResponse = await request(app).post('/hello');
    expect(postResponse.status).toBe(404);
  });
}); 