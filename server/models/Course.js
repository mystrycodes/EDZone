import mongoose from "mongoose";
import User from "./User.js";

const lectureSchema = new mongoose.Schema({
    lectureId: {type:String, required: true},
    lectureTitle: {type:String, required: true},
    lectureDuration: {type:Number, required: true},
    lectureUrl: {type:String, required: true},
    isPreviewFree: {type:Boolean, required: true},
    lectureOrder: {type:Number, required: true},
},{_id:false});



const chapterSchema = new mongoose.Schema({
    chapterId: {type:String, required:true},
    chapterOrder:{type:Number, required:true},
    chapterTitle:{type:String, required:true},
    chapterContent: [lectureSchema]
},{_id:false});


const courseSchema = new mongoose.Schema({
    courseTitle:{type:String, required:true},
    courseDescription: {type:String, required:true},
    courseThumbnail: {type:String},
    coursePrice: {type:Number, required:true},
    isPublished: {type:Boolean, default:true},
    discount:{type:Number,default:true, min:0, max:100},
    courseContent:[chapterSchema],
    courseRatings:[
        {userId:{type:String}, rating:{type:Number, min:1, max:5}}
    ],
    instructor: {type:String, ref:"User",required:true },
    enroledStudents:[
        {type:String, ref:'User'}
    ],
},{timestamps:true, minimize:false});


const Course = mongoose.model('Course', courseSchema)
export default Course;

// Dummy data
// {
//     "courseTitle":"Test Course Title",
//     "courseDescription":"Test Course Description",
//     "coursePrice":50,
//     "discount":10,
//     "courseContent":[
//         {
//             "chapterId":"Ch01",
//             "chapterOrder":1,
//             "chapterTitle":"Test Chapter Title",
//             "chapterContent":[
//                 {
//                     "lectureId":"lec01",
//                     "lectureTitle":"Test Lecture Title",
//                     "lectureDuration":20,
//                     "lectureUrl":"https://example.com/lectures/lec01.mp4",
//                     "isPreviewFree":true,
//                     "lectureOrder":1
//                 }
//             ]
//         }
//     ]
// }