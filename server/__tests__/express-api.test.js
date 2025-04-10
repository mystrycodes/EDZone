
import request from 'supertest';
import express from 'express';


const app = express();


app.use(express.json());


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


app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Tests
describe('Express API Tests', () => {
 
  test('GET / returns success message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Server is running');
  });
  
  test('GET /api/health returns healthy status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'healthy' });
  });
  
  // Users
  test('GET /api/users returns user list', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toBe('Alice');
  });
  
  // Single User
  test('GET /api/users/:id returns a single user', async () => {
    const response = await request(app).get('/api/users/1');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.name).toBe('Alice');
  });
  
  test('GET /api/users/:id returns 404 for non-existent user', async () => {
    const response = await request(app).get('/api/users/999');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });
  
  // Create User
  test('POST /api/users creates a new user', async () => {
    const newUser = { name: 'Charlie', role: 'student' };
    const response = await request(app)
      .post('/api/users')
      .send(newUser);
    
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Charlie');
    expect(response.body.role).toBe('student');
  });
  
  // Validate user login
  test('POST /api/users validates required fields', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'Charlie' });
    
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('required');
  });
  
  // Deleter User
  test('DELETE /api/users/:id deletes a user', async () => {
    const response = await request(app).delete('/api/users/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User deleted');
  });
  
  // Update User
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
  
  // Course filtering
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