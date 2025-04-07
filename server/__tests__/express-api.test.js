/**
 * Simple Express API tests
 */
import request from 'supertest';
import express from 'express';

// Create a simple Express app for testing
const app = express();

// Add middleware
app.use(express.json());

// Setup basic routes for testing
app.get('/', (req, res) => res.send('Server is running'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.get('/api/users', (req, res) => {
  res.status(200).json([
    { id: 1, name: 'Alice', role: 'student' },
    { id: 2, name: 'Bob', role: 'instructor' }
  ]);
});

app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  if (userId === 1) {
    return res.status(200).json({ id: 1, name: 'Alice', role: 'student' });
  }
  if (userId === 2) {
    return res.status(200).json({ id: 2, name: 'Bob', role: 'instructor' });
  }
  res.status(404).json({ message: 'User not found' });
});

app.post('/api/users', (req, res) => {
  const { name, role } = req.body;
  
  if (!name || !role) {
    return res.status(400).json({ message: 'Name and role are required' });
  }
  
  res.status(201).json({ id: 3, name, role });
});

app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  if (userId < 1) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  res.status(200).json({ message: 'User deleted' });
});

app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, role } = req.body;
  
  if (!name || !role) {
    return res.status(400).json({ message: 'Name and role are required' });
  }
  
  if (userId < 1) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  
  res.status(200).json({ id: userId, name, role });
});

app.get('/api/courses', (req, res) => {
  const { sort, category } = req.query;
  res.status(200).json({
    courses: [
      { id: 1, title: 'JavaScript Basics', category: 'programming' },
      { id: 2, title: 'React Fundamentals', category: 'programming' }
    ],
    filters: { sort, category }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Tests
describe('Express API Tests', () => {
  // Test 1: Root endpoint
  test('GET / returns success message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Server is running');
  });
  
  // Test 2: Health check
  test('GET /api/health returns healthy status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'healthy' });
  });
  
  // Test 3: Get all users
  test('GET /api/users returns user list', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toBe('Alice');
  });
  
  // Test 4: Get single user
  test('GET /api/users/:id returns a single user', async () => {
    const response = await request(app).get('/api/users/1');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.name).toBe('Alice');
  });
  
  // Test 5: 404 for non-existent user
  test('GET /api/users/:id returns 404 for non-existent user', async () => {
    const response = await request(app).get('/api/users/999');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });
  
  // Test 6: Create user
  test('POST /api/users creates a new user', async () => {
    const newUser = { name: 'Charlie', role: 'student' };
    const response = await request(app)
      .post('/api/users')
      .send(newUser);
    
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Charlie');
    expect(response.body.role).toBe('student');
  });
  
  // Test 7: Validation for creating user
  test('POST /api/users validates required fields', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'Charlie' });
    
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('required');
  });
  
  // Test 8: Delete user
  test('DELETE /api/users/:id deletes a user', async () => {
    const response = await request(app).delete('/api/users/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User deleted');
  });
  
  // Test 9: Update user
  test('PUT /api/users/:id updates a user', async () => {
    const updatedUser = { name: 'Alice Updated', role: 'instructor' };
    const response = await request(app)
      .put('/api/users/1')
      .send(updatedUser);
    
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.name).toBe('Alice Updated');
    expect(response.body.role).toBe('instructor');
  });
  
  // Test 10: Course filtering
  test('GET /api/courses handles query parameters', async () => {
    const response = await request(app)
      .get('/api/courses')
      .query({ sort: 'title', category: 'programming' });
    
    expect(response.status).toBe(200);
    expect(response.body.filters.sort).toBe('title');
    expect(response.body.filters.category).toBe('programming');
    expect(Array.isArray(response.body.courses)).toBe(true);
  });
}); 