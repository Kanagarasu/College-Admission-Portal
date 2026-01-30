import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FiUser, 
  FiBook, 
  FiFileText, 
  FiCheckCircle,
  FiArrowLeft,
  FiUpload,
  FiSave,
  FiSend
} from 'react-icons/fi'
import { FaGraduationCap } from 'react-icons/fa'
import Navbar from '../common/Navbar'
import LoadingSpinner from '../common/LoadingSpinner'
import Alert from '../common/Alert'
import axiosInstance from '../../api/axios'
import toast from 'react-hot-toast'

const AdmissionForm = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [hasExistingApplication, setHasExistingApplication] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Details
    personalDetails: {
      fullName: '',
      fatherName: '',
      motherName: '',
      guardianPhone: '',
      nationality: 'Indian',
      category: 'General'
    },
    // Academic Details
    academicDetails: {
      tenth: {
        board: '',
        school: '',
        passingYear: new Date().getFullYear() - 4,
        percentage: ''
      },
      twelfth: {
        board: '',
        school: '',
        passingYear: new Date().getFullYear() - 2,
        percentage: ''
      },
      entranceExam: {
        name: '',
        rollNumber: '',
        score: '',
        rank: ''
      }
    },
    // Course Preferences
    coursePreferences: {
      firstChoice: '',
      secondChoice: '',
      thirdChoice: ''
    }
  })

  const categories = ['General', 'OBC', 'SC', 'ST', 'Other']
  const courses = [
    'Computer Science',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Information Technology',
    'Business Administration',
    'Commerce',
    'Arts'
  ]
  const boards = ['CBSE', 'ICSE', 'State Board', 'IGCSE', 'Other']
  const entranceExams = ['JEE Main', 'JEE Advanced', 'NEET', 'State CET', 'Other']

  useEffect(() => {
    checkExistingApplication()
  }, [])

  // const checkExistingApplication = async () => {
  //   try {
  //     const response = await axiosInstance.get('/applications/my-application')
  //     if (response.data.application) {
  //       setHasExistingApplication(true)
  //       setFormData(response.data.application)
  //       toast.info('You have an existing application. You can edit it here.')
  //     }
  //   } catch (error) {
  //     // No existing application is fine
  //   }
  // }
  const checkExistingApplication = async () => {
  try {
    const response = await axiosInstance.get('/applications/my-application')
    if (response.data.application) {
      // If already submitted, go to status page
      navigate('/status')
    }
  } catch (error) {
    // No existing application → stay on form
  }
}


  const handleChange = (e) => {
    const { name, value } = e.target
    const keys = name.split('.')
    
    setFormData(prev => {
      const newData = { ...prev }
      let current = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
    window.scrollTo(0, 0)
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        const personal = formData.personalDetails
        if (!personal.fullName || !personal.fatherName || !personal.guardianPhone) {
          toast.error('Please fill all required personal details')
          return false
        }
        if (!/^[0-9]{10}$/.test(personal.guardianPhone)) {
          toast.error('Please enter a valid 10-digit phone number')
          return false
        }
        return true
        
      case 2:
        const academic = formData.academicDetails
        if (!academic.tenth.board || !academic.tenth.percentage) {
          toast.error('Please fill 10th board and percentage')
          return false
        }
        if (!academic.twelfth.board || !academic.twelfth.percentage) {
          toast.error('Please fill 12th board and percentage')
          return false
        }
        return true
        
      case 3:
        if (!formData.coursePreferences.firstChoice) {
          toast.error('Please select at least your first course choice')
          return false
        }
        return true
        
      default:
        return true
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (hasExistingApplication) {
        // Update existing application
        await axiosInstance.put('/applications/my-application', formData)
        toast.success('Application updated successfully!')
      } else {
        // Submit new application
        await axiosInstance.post('/applications', formData)
        toast.success('Application submitted successfully!')
      }
      
      setTimeout(() => {
        navigate('/status')
      }, 1500)
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error('Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Personal Details', icon: <FiUser /> },
    { number: 2, title: 'Academic Details', icon: <FiBook /> },
    { number: 3, title: 'Course Selection', icon: <FaGraduationCap /> },
    { number: 4, title: 'Review & Submit', icon: <FiCheckCircle /> }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {hasExistingApplication ? 'Edit Admission Application' : 'Admission Application Form'}
          </h1>
          <p className="text-gray-600">
            Complete all sections carefully. Fields marked with * are required.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className={`flex items-center ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.number 
                      ? 'bg-blue-100 border-2 border-blue-600' 
                      : 'bg-gray-100 border-2 border-gray-300'
                  }`}>
                    {currentStep > step.number ? <FiCheckCircle /> : step.icon}
                  </div>
                  <span className="ml-3 font-medium hidden sm:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FiUser className="mr-3" />
                Personal Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="personalDetails.fullName"
                    value={formData.personalDetails.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Father's Name *
                  </label>
                  <input
                    type="text"
                    name="personalDetails.fatherName"
                    value={formData.personalDetails.fatherName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter father's name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mother's Name
                  </label>
                  <input
                    type="text"
                    name="personalDetails.motherName"
                    value={formData.personalDetails.motherName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter mother's name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guardian Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="personalDetails.guardianPhone"
                    value={formData.personalDetails.guardianPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter 10-digit phone number"
                    required
                    pattern="[0-9]{10}"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality
                  </label>
                  <input
                    type="text"
                    name="personalDetails.nationality"
                    value={formData.personalDetails.nationality}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter nationality"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="personalDetails.category"
                    value={formData.personalDetails.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Academic Details */}
          {currentStep === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FiBook className="mr-3" />
                Academic Details
              </h2>

              {/* 10th Details */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">10th Standard Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Board *
                    </label>
                    <select
                      name="academicDetails.tenth.board"
                      value={formData.academicDetails.tenth.board}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      required
                    >
                      <option value="">Select Board</option>
                      {boards.map(board => (
                        <option key={board} value={board}>{board}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School Name
                    </label>
                    <input
                      type="text"
                      name="academicDetails.tenth.school"
                      value={formData.academicDetails.tenth.school}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Enter school name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Passing Year
                    </label>
                    <input
                      type="number"
                      name="academicDetails.tenth.passingYear"
                      value={formData.academicDetails.tenth.passingYear}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      min="2000"
                      max={new Date().getFullYear()}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Percentage *
                    </label>
                    <input
                      type="number"
                      name="academicDetails.tenth.percentage"
                      value={formData.academicDetails.tenth.percentage}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Enter percentage"
                      min="0"
                      max="100"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 12th Details */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">12th Standard Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Board *
                    </label>
                    <select
                      name="academicDetails.twelfth.board"
                      value={formData.academicDetails.twelfth.board}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      required
                    >
                      <option value="">Select Board</option>
                      {boards.map(board => (
                        <option key={board} value={board}>{board}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School/College Name
                    </label>
                    <input
                      type="text"
                      name="academicDetails.twelfth.school"
                      value={formData.academicDetails.twelfth.school}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Enter school/college name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Passing Year
                    </label>
                    <input
                      type="number"
                      name="academicDetails.twelfth.passingYear"
                      value={formData.academicDetails.twelfth.passingYear}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      min="2000"
                      max={new Date().getFullYear()}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Percentage *
                    </label>
                    <input
                      type="number"
                      name="academicDetails.twelfth.percentage"
                      value={formData.academicDetails.twelfth.percentage}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Enter percentage"
                      min="0"
                      max="100"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Entrance Exam Details */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Entrance Exam Details (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exam Name
                    </label>
                    <select
                      name="academicDetails.entranceExam.name"
                      value={formData.academicDetails.entranceExam.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    >
                      <option value="">Select Exam</option>
                      {entranceExams.map(exam => (
                        <option key={exam} value={exam}>{exam}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      name="academicDetails.entranceExam.rollNumber"
                      value={formData.academicDetails.entranceExam.rollNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Enter roll number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Score
                    </label>
                    <input
                      type="number"
                      name="academicDetails.entranceExam.score"
                      value={formData.academicDetails.entranceExam.score}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Enter score"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rank
                    </label>
                    <input
                      type="number"
                      name="academicDetails.entranceExam.rank"
                      value={formData.academicDetails.entranceExam.rank}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Enter rank"
                      min="1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Course Selection */}
          {currentStep === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaGraduationCap className="mr-3" />
                Course Preferences
              </h2>

              <Alert
                type="info"
                message="Select your preferred courses in order of priority. Your first choice will be given highest priority."
                className="mb-6"
              />

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Choice *
                  </label>
                  <select
                    name="coursePreferences.firstChoice"
                    value={formData.coursePreferences.firstChoice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                  >
                    <option value="">Select First Choice</option>
                    {courses.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Second Choice
                  </label>
                  <select
                    name="coursePreferences.secondChoice"
                    value={formData.coursePreferences.secondChoice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="">Select Second Choice</option>
                    {courses.filter(c => c !== formData.coursePreferences.firstChoice).map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Third Choice
                  </label>
                  <select
                    name="coursePreferences.thirdChoice"
                    value={formData.coursePreferences.thirdChoice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="">Select Third Choice</option>
                    {courses
                      .filter(c => c !== formData.coursePreferences.firstChoice && c !== formData.coursePreferences.secondChoice)
                      .map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FiCheckCircle className="mr-3" />
                Review & Submit
              </h2>

              <Alert
                type="warning"
                title="Final Review"
                message="Please review all details carefully before submitting. You cannot edit after submission."
                className="mb-6"
              />

              <div className="space-y-8">
                {/* Personal Details Review */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-medium">{formData.personalDetails.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Father's Name</p>
                      <p className="font-medium">{formData.personalDetails.fatherName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Mother's Name</p>
                      <p className="font-medium">{formData.personalDetails.motherName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Guardian Phone</p>
                      <p className="font-medium">{formData.personalDetails.guardianPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nationality</p>
                      <p className="font-medium">{formData.personalDetails.nationality}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-medium">{formData.personalDetails.category}</p>
                    </div>
                  </div>
                </div>

                {/* Academic Details Review */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                    Academic Details
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">10th Standard</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Board</p>
                          <p className="font-medium">{formData.academicDetails.tenth.board}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">School</p>
                          <p className="font-medium">{formData.academicDetails.tenth.school}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Passing Year</p>
                          <p className="font-medium">{formData.academicDetails.tenth.passingYear}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Percentage</p>
                          <p className="font-medium">{formData.academicDetails.tenth.percentage}%</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">12th Standard</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Board</p>
                          <p className="font-medium">{formData.academicDetails.twelfth.board}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">School/College</p>
                          <p className="font-medium">{formData.academicDetails.twelfth.school}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Passing Year</p>
                          <p className="font-medium">{formData.academicDetails.twelfth.passingYear}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Percentage</p>
                          <p className="font-medium">{formData.academicDetails.twelfth.percentage}%</p>
                        </div>
                      </div>
                    </div>

                    {formData.academicDetails.entranceExam.name && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Entrance Exam</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Exam Name</p>
                            <p className="font-medium">{formData.academicDetails.entranceExam.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Roll Number</p>
                            <p className="font-medium">{formData.academicDetails.entranceExam.rollNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Score</p>
                            <p className="font-medium">{formData.academicDetails.entranceExam.score}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Rank</p>
                            <p className="font-medium">{formData.academicDetails.entranceExam.rank}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Course Preferences Review */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                    Course Preferences
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">First Choice</p>
                      <p className="font-medium text-lg">{formData.coursePreferences.firstChoice}</p>
                    </div>
                    {formData.coursePreferences.secondChoice && (
                      <div>
                        <p className="text-sm text-gray-600">Second Choice</p>
                        <p className="font-medium">{formData.coursePreferences.secondChoice}</p>
                      </div>
                    )}
                    {formData.coursePreferences.thirdChoice && (
                      <div>
                        <p className="text-sm text-gray-600">Third Choice</p>
                        <p className="font-medium">{formData.coursePreferences.thirdChoice}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 mr-3"
                    required
                  />
                  <label htmlFor="terms" className="text-gray-700">
                    I hereby declare that all the information provided above is true and correct to the best of my knowledge. I understand that any false information may lead to cancellation of admission.
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition duration-200 flex items-center ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FiArrowLeft className="mr-2" />
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200 flex items-center"
              >
                Next
                <FiArrowLeft className="ml-2 transform rotate-180" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {hasExistingApplication ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    {hasExistingApplication ? (
                      <>
                        <FiSave className="mr-2" />
                        Update Application
                      </>
                    ) : (
                      <>
                        <FiSend className="mr-2" />
                        Submit Application
                      </>
                    )}
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Step Indicator */}
        <div className="mt-6 text-center text-gray-600">
          Step {currentStep} of {steps.length}
        </div>
      </div>
    </div>
  )
}

export default AdmissionForm