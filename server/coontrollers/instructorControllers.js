import {clerkClient} from '@clerk/express'
import Course from '../models/Course.js'
import {v2 as cloudinary} from 'cloudinary'
import { Purchase } from '../models/Purchase.js'

// Updating role to educator
export const updateRoleToInstructor = async (req, res) => {
    try {
        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata:{
                role:'instructor',
            }
        })

        res.json({success:true, message: 'You can start publishing courses now!'})

    } catch (error) {
        res.json({success:false, message:error.message})
    }
}


// Add New Course
export const addNewCourse = async (req, res) =>{
    try {
        const {courseData} = req.body
        const imageFile = req.file
        const instructorId = req.auth.userId

        if(!imageFile){
            return res.json({success:false, message:'Thumbnail not attached'})
        }

        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.instructor = instructorId
        const newCourse = await Course.create(parsedCourseData)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

        res.json({success:true, message:'new course added'})

    } catch (error) {
        console.log("Some error occured")
        res.json({success:false,message:error.message})
    }
}

// Get Instructor Courses
export const getInstructorCourses = async (req, res) =>{
    try {
        const instructor = req.auth.userId;
        const courses = await Course.find({instructor})
        return res.json({success:true, courses})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

// Get instructor dashboard data (Total earnings, Students enrolled, No of Courses)

export const instructorDashboardData = async (req, res)=>{
    try {
        const instructor = req.auth.userId;
        const courses = await Course.find({instructor});
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id)

        // Calculating total earnings
        const purchases = await Purchase.find({
            courseIds: {$in: courseIds},
            status:'completed'
        });

        const totalEarnings = purchases.reduce((sum,purchase)=>sum+purchase.amount,0);

        // Getting unique enrolled studentIds with their course titles
        const enrolledStudentsData = [];
        for(const course of courses){
            const students = await User.find({
                _id: {$in: course.enroledStudents}
            }, 'name imageUrl');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }

        res.json({success:true, dashboardData: {
            totalEarnings, enrolledStudentsData, totalCourses
        }})

    } catch (error) {
        res.json({success:false, message:error.message});
    }
}

// Getting students enrolled data along with the purchases data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const instructor = req.auth.userId;
        const courses = await Course.find({instructor});
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId:{$in: courseIds},
            status:'completed'
        }).populate('userId','name imageUrl').populate('courseId','courseTitle')

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseData:purchase.createdAt
        }));

        res.json({success:true, enrolledStudents})

    } catch (error) {
        res.json({success:false, message:error.message});
    }
}