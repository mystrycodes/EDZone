import express from 'express'
import { addNewCourse, getEnrolledStudentsData, getInstructorCourses, instructorDashboardData, updateRoleToInstructor } from '../coontrollers/instructorControllers.js'
import upload from '../configs/multer.js'
import { protectInstructor } from '../middlewares/authMiddleware.js'

const instructorRouter = express.Router()

// Add Instructor Role
instructorRouter.get('/update-role',updateRoleToInstructor)
instructorRouter.post('/add-course', upload.single('image'), protectInstructor, addNewCourse)
instructorRouter.get('/courses', protectInstructor, getInstructorCourses)
instructorRouter.get('/dashboard', protectInstructor, instructorDashboardData)
instructorRouter.get('/enrolled-students',protectInstructor,getEnrolledStudentsData)

export default instructorRouter;