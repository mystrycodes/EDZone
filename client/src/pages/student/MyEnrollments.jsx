import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { Line } from 'rc-progress'
import Footer from '../../components/student/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyEnrollments = () => {

  const { coursesEnrolled, calculateCourseDuration, navigate, userData, fetchUserEnrolledCourses, backendUrl, getToken, calculateNoOfLectures } = useContext(AppContext)

  const [progress, setProgress] = useState([])

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const temporaryProgressArray = await Promise.all(
        coursesEnrolled.map(async (course) => {
          const { data } = await axios.post(`${backendUrl}/api/user/get-course-progress`, { courseId: course._id }, { headers: { Authorization: `Bearer ${token}` } })
          let totalLectures = calculateNoOfLectures(course);
          const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0;
          // console.log(lectureCompleted);
          // console.log(data);
          return { totalLectures, lectureCompleted }
        })
      )
        setProgress(temporaryProgressArray);
    } catch (error) {
        toast.error(error.nessage);
    }
  }

  useEffect(()=>{
    if(userData){
      fetchUserEnrolledCourses();
    }
  },[userData])

  useEffect(()=>{
    if(coursesEnrolled.length >0){
      getCourseProgress()
    }
  },[coursesEnrolled])

  return (
    <>
      <div className='md:px-36 px-8 pt-10'>
        <h1 className='text-2xl font-semibold'>My Learning</h1>
        <table className='md:table-auto table-fixed w-full overflow-hidden border mt-10'>
          <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden'>
            <tr>
              <th className='px-4 py-3 font-semibold truncate'>Course</th>
              <th className='px-4 py-3 font-semibold truncate'>Duration</th>
              <th className='px-4 py-3 font-semibold truncate'>Completed</th>
              <th className='px-4 py-3 font-semibold truncate'>Status</th>
            </tr>
          </thead>
          <tbody className='text-gray-700'>
            {
              coursesEnrolled.map((course, index) => (
                <tr key={index} className='border-b border-gray-500/20'>
                  <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'>
                    <img src={course.courseThumbnail} alt="course thumbnail" className='w-14 sm:w-24 md:w-28' />
                    <div className='flex-1'>
                      <p className='mb-1 max-sm:text-sm'>{course.courseTitle}</p>
                      <Line strokeWidth={2} percent={progress[index] ? (progress[index].lectureCompleted / progress[index].totalLectures * 100) : 0} className='bg-gray-300 rounded-full' />
                    </div>
                  </td>
                  <td className='px-4 py-3 max:sm:hidden'>
                    {calculateCourseDuration(course)}
                  </td>
                  <td className='px-4 py-3 max:sm:hidden'>
                    {
                      progress[index] && `${progress[index].lectureCompleted} / ${progress[index].totalLectures}`
                    } <span>Lectures</span>
                  </td>
                  <td className='px-4 py-3 max-sm:text-right'>
                    <button className='px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 max-sm:text-xs text-white rounded' onClick={() => navigate('/player/' + course._id)}>
                      {progress[index] && progress[index].lectureCompleted / progress[index].totalLectures === 1 ? 'Completed' : 'In Progress'}
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>

      </div>
      <Footer />
    </>
  )
}

export default MyEnrollments
