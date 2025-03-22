import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration';

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

    const [allCourses, setAllCourses] = useState([])
    const [isInstructor, setIsInstructor] = useState(true)
    const [coursesEnrolled, setCoursesEnrolled] = useState([])

    // Fetch All Courses
    const fetchAllCourses = async ()=>{
        setAllCourses(dummyCourses)
    }
    
    // Function to calculate Average Course Rating 
    const calculateAverageRating = (course)=>{
        if(course.courseRatings.length===0){
            return 0;
        }
        let totalRating = 0
        course.courseRatings.forEach(rating=>{
            totalRating += rating.rating
        })
        return totalRating / course.courseRatings.length
    }

    // Function to calculate Lecture Duration
    const calculateChapterTime = (chapter)=>{
        let time = 0;
        chapter.chapterContent.map((lecture)=>time+=lecture.lectureDuration)
        return humanizeDuration(time*60*1000, {units:["h","m"]})
    }

    // Function for calculating Course Duration
    const calculateCourseDuration = (course)=>{
        let time = 0;
        course.courseContent.map((chapter)=> chapter.chapterContent.map(
            (lecture)=> time+=lecture.lectureDuration
        ))
        return humanizeDuration(time*60*1000, {units:["h","m"]})
    }

    // Function to clculate total number of lectures in the course
    const calculateNoOfLectures = (course)=>{
        let totalLectures = 0;
        course.courseContent.forEach(chapter=>{
            if(Array.isArray(chapter.chapterContent)){
                totalLectures+=chapter.chapterContent.length;
            }
        });
        return totalLectures;
        
    }

    // Function to fetch courses that user is already enrolled in
    const fetchUserEnrolledCourses = async ()=>{
        setCoursesEnrolled(dummyCourses)
    }

    useEffect(()=>{
        fetchAllCourses(dummyCourses)
        fetchUserEnrolledCourses()
    },[])

    const value = {
        currency, allCourses, navigate, calculateAverageRating, isInstructor, setIsInstructor, calculateCourseDuration, calculateChapterTime, calculateNoOfLectures, coursesEnrolled, fetchUserEnrolledCourses
    }
    
    return (
        <AppContext.Provider value = {value}>
            {props.children}
        </AppContext.Provider>
    )
}