import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server.js';
import Course from '../models/Course.js';
import { connect, closeDatabase, clearDatabase } from '../test/setup.js';

describe('Course Routes', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('GET /api/course', () => {
    it('should return all courses', async () => {
      await Course.create([
        {
          courseTitle: 'Test Course 1',
          courseDescription: 'Description 1',
          coursePrice: 99.99,
          instructor: new mongoose.Types.ObjectId(),
          courseThumbnail: 'thumbnail1.jpg',
          courseRatings: []
        },
        {
          courseTitle: 'Test Course 2',
          courseDescription: 'Description 2',
          coursePrice: 149.99,
          instructor: new mongoose.Types.ObjectId(),
          courseThumbnail: 'thumbnail2.jpg',
          courseRatings: []
        }
      ]);

      const response = await request(app)
        .get('/api/course')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('courseTitle', 'Test Course 1');
      expect(response.body[1]).toHaveProperty('courseTitle', 'Test Course 2');
    });

    it('should return empty array when no courses exist', async () => {
      const response = await request(app)
        .get('/api/course')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/course/:id', () => {
    it('should return a single course by ID', async () => {
      const course = await Course.create({
        courseTitle: 'Single Test Course',
        courseDescription: 'Single Description',
        coursePrice: 99.99,
        instructor: new mongoose.Types.ObjectId(),
        courseThumbnail: 'thumbnail.jpg',
        courseRatings: []
      });

      const response = await request(app)
        .get(`/api/course/${course._id}`)
        .expect(200);

      expect(response.body).toHaveProperty('courseTitle', 'Single Test Course');
      expect(response.body).toHaveProperty('courseDescription', 'Single Description');
    });

    it('should return 404 for non-existent course', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/course/${nonExistentId}`)
        .expect(404);
    });

    it('should return 400 for invalid course ID format', async () => {
      await request(app)
        .get('/api/course/invalid-id')
        .expect(400);
    });
  });

  describe('POST /api/course', () => {
    it('should create a new course', async () => {
      const newCourse = {
        courseTitle: 'New Course',
        courseDescription: 'New Description',
        coursePrice: 79.99,
        instructor: new mongoose.Types.ObjectId(),
        courseThumbnail: 'new-thumbnail.jpg'
      };

      const response = await request(app)
        .post('/api/course')
        .send(newCourse)
        .expect(201);

      expect(response.body).toHaveProperty('courseTitle', 'New Course');
      expect(response.body).toHaveProperty('_id');
      
      // Verify course was actually saved
      const savedCourse = await Course.findById(response.body._id);
      expect(savedCourse).toBeTruthy();
      expect(savedCourse.courseTitle).toBe('New Course');
    });

    it('should return 400 if required fields are missing', async () => {
      const incompleteCourse = {
        courseTitle: 'Incomplete Course'
      };

      await request(app)
        .post('/api/course')
        .send(incompleteCourse)
        .expect(400);
    });
  });

  describe('PUT /api/course/:id', () => {
    it('should update an existing course', async () => {
      const course = await Course.create({
        courseTitle: 'Original Title',
        courseDescription: 'Original Description',
        coursePrice: 99.99,
        instructor: new mongoose.Types.ObjectId(),
        courseThumbnail: 'thumbnail.jpg'
      });

      const response = await request(app)
        .put(`/api/course/${course._id}`)
        .send({
          courseTitle: 'Updated Title',
          coursePrice: 149.99
        })
        .expect(200);

      expect(response.body).toHaveProperty('courseTitle', 'Updated Title');
      expect(response.body).toHaveProperty('coursePrice', 149.99);
      expect(response.body).toHaveProperty('courseDescription', 'Original Description');
    });
  });

  describe('DELETE /api/course/:id', () => {
    it('should delete an existing course', async () => {
      const course = await Course.create({
        courseTitle: 'Course to Delete',
        courseDescription: 'Will be deleted',
        coursePrice: 99.99,
        instructor: new mongoose.Types.ObjectId(),
        courseThumbnail: 'thumbnail.jpg'
      });

      await request(app)
        .delete(`/api/course/${course._id}`)
        .expect(200);

      // Verify course was actually deleted
      const deletedCourse = await Course.findById(course._id);
      expect(deletedCourse).toBeNull();
    });
  });
}); 