import Course from "../models/Course.js";

// Get All Courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({isPublished:true}).select(
            ['-courseContent', '-enroledStudents']).populate({path:'instructor'})
        res.json({success:true, courses})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

// Get course by Id
export const getCourseId = async (req, res) => {
    const {id} = req.params

    try {
        const courseData = await Course.findById(id).populate({path:'instructor'})
        // Removing lecture url if isPreview is false
        courseData.courseContent.forEach(chapter=>{
            chapter.chapterContent.forEach(lecture => {
                if(!lecture.isPreviewFree){
                    lecture.lectureUrl='';
                }
            })
        })
        res.json({success:true,courseData})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}


