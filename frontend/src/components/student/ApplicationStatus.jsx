import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiFileText,
  FiDownload,
  FiRefreshCw,
  FiMessageSquare,
  FiUser,
  FiBook,
  FiMail,
  FiPhone
} from 'react-icons/fi'
import { FaGraduationCap } from 'react-icons/fa'
import Navbar from '../common/Navbar'
import LoadingSpinner from '../common/LoadingSpinner'
import Alert from '../common/Alert'
import axiosInstance from '../../api/axios'
import toast from 'react-hot-toast'

const ApplicationStatus = () => {
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchApplicationStatus()
  }, [])

  const fetchApplicationStatus = async () => {
    try {
      const response = await axiosInstance.get('/applications/my-application')
      setApplication(response.data.application)
    } catch (error) {
      console.error('Error fetching application status:', error)
      // toast.error('Failed to load application status')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchApplicationStatus()
  }

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return {
          icon: <FiCheckCircle className="w-8 h-8" />,
          color: 'green',
          title: 'Congratulations!',
          message: 'Your application has been approved.',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        }
      case 'rejected':
        return {
          icon: <FiXCircle className="w-8 h-8" />,
          color: 'red',
          title: 'Application Rejected',
          message: 'Your application has been rejected.',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200'
        }
      case 'pending':
        return {
          icon: <FiClock className="w-8 h-8" />,
          color: 'yellow',
          title: 'Under Review',
          message: 'Your application is being reviewed.',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200'
        }
      default:
        return {
          icon: <FiFileText className="w-8 h-8" />,
          color: 'gray',
          title: 'Not Submitted',
          message: 'You have not submitted an application yet.',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200'
        }
    }
  }

  const getTimelineItems = () => {
    if (!application) return []

    const items = [
      {
        id: 1,
        title: 'Application Submitted',
        date: new Date(application.submittedAt).toLocaleDateString(),
        completed: true,
        current: false
      }
    ]

    if (application.reviewedAt) {
      items.push({
        id: 2,
        title: 'Application Reviewed',
        date: new Date(application.reviewedAt).toLocaleDateString(),
        completed: true,
        current: false
      })
    }

    items.push({
      id: 3,
      title: application.status === 'pending' ? 'Final Decision Pending' : 'Final Decision Made',
      date: application.status !== 'pending' ? new Date(application.reviewedAt).toLocaleDateString() : 'In progress',
      completed: application.status !== 'pending',
      current: application.status === 'pending'
    })

    return items
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <LoadingSpinner text="Loading application status..." />
          </div>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(application?.status)
  const timelineItems = getTimelineItems()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Application Status
            </h1>
            <p className="text-gray-600">
              Track the status of your admission application
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200 flex items-center disabled:opacity-50"
            >
              <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Status'}
            </button>
          </div>
        </div>

        {!application ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiFileText className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Application Found
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't submitted an admission application yet. Start your application process to track your status here.
            </p>
            <Link
              to="/apply"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200"
            >
              <FaGraduationCap className="mr-2" />
              Start Application
            </Link>
          </div>
        ) : (
          <>
            {/* Status Banner */}
            <div className={`rounded-xl shadow-lg p-6 mb-8 border ${statusInfo.borderColor} ${statusInfo.bgColor}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className={`p-4 rounded-lg ${statusInfo.bgColor.replace('100', '200')} mr-4`}>
                    <div className={statusInfo.textColor}>
                      {statusInfo.icon}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{statusInfo.title}</h2>
                    <p className={statusInfo.textColor}>{statusInfo.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Application ID</div>
                  <div className="font-mono font-bold text-gray-900">
                    #{application._id.slice(-8).toUpperCase()}
                  </div>
                </div>
              </div>

              {application.remarks && (
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-start">
                    <FiMessageSquare className="w-5 h-5 text-gray-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Admin Remarks</h4>
                      <p className="text-gray-700">{application.remarks}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Timeline */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Application Timeline
                  </h2>
                  
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    {timelineItems.map((item, index) => (
                      <div key={item.id} className="relative flex items-start mb-8 last:mb-0">
                        <div className={`z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          item.completed ? 'bg-green-100' : item.current ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          {item.completed ? (
                            <FiCheckCircle className="w-6 h-6 text-green-600" />
                          ) : item.current ? (
                            <div className="w-6 h-6 rounded-full border-2 border-blue-600"></div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                          )}
                        </div>
                        <div className="ml-6">
                          <h3 className={`font-bold text-lg ${
                            item.current ? 'text-blue-600' : 'text-gray-900'
                          }`}>
                            {item.title}
                          </h3>
                          <p className="text-gray-600 mt-1">{item.date}</p>
                          {item.id === 3 && application.status === 'pending' && (
                            <p className="text-sm text-gray-500 mt-2">
                              Expected decision within 7-10 working days
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Application Details */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Application Details
                  </h2>
                  
                  <div className="space-y-8">
                    {/* Personal Details */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <FiUser className="mr-3" />
                        Personal Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Full Name</p>
                          <p className="font-medium">{application.personalDetails?.fullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Father's Name</p>
                          <p className="font-medium">{application.personalDetails?.fatherName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Category</p>
                          <p className="font-medium">{application.personalDetails?.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Guardian Phone</p>
                          <p className="font-medium">{application.personalDetails?.guardianPhone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Academic Details */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <FiBook className="mr-3" />
                        Academic Details
                      </h3>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">10th Standard</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Board</p>
                              <p className="font-medium">{application.academicDetails?.tenth?.board}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Percentage</p>
                              <p className="font-medium">{application.academicDetails?.tenth?.percentage}%</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">12th Standard</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Board</p>
                              <p className="font-medium">{application.academicDetails?.twelfth?.board}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Percentage</p>
                              <p className="font-medium">{application.academicDetails?.twelfth?.percentage}%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Course Preferences */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <FaGraduationCap className="mr-3" />
                        Course Preferences
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">First Choice</p>
                          <p className="font-medium text-lg">{application.coursePreferences?.firstChoice}</p>
                        </div>
                        {application.coursePreferences?.secondChoice && (
                          <div>
                            <p className="text-sm text-gray-600">Second Choice</p>
                            <p className="font-medium">{application.coursePreferences.secondChoice}</p>
                          </div>
                        )}
                        {application.coursePreferences?.thirdChoice && (
                          <div>
                            <p className="text-sm text-gray-600">Third Choice</p>
                            <p className="font-medium">{application.coursePreferences.thirdChoice}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Actions & Info */}
              <div className="space-y-8">
                {/* Status Actions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Next Steps
                  </h2>
                  
                  <div className="space-y-4">
                    {application.status === 'approved' && (
                      <>
                        <Alert
                          type="success"
                          title="Admission Approved"
                          message="Congratulations! Please complete the enrollment process."
                        />
                        <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition duration-200">
                          Proceed to Enrollment
                        </button>
                        <button className="w-full px-4 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 font-medium transition duration-200">
                          Download Admission Letter
                        </button>
                      </>
                    )}

                    {application.status === 'rejected' && (
                      <>
                        <Alert
                          type="error"
                          title="Application Rejected"
                          message="Your application did not meet the requirements."
                        />
                        <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200">
                          View Alternative Programs
                        </button>
                        <button className="w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition duration-200">
                          Contact Admission Office
                        </button>
                      </>
                    )}

                    {application.status === 'pending' && (
                      <>
                        <Alert
                          type="info"
                          title="Under Review"
                          message="Your application is being reviewed by the admission committee."
                        />
                        <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200">
                          Check Document Status
                        </button>
                        <Link
                          to="/documents"
                          className="block w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition duration-200 text-center"
                        >
                          Upload Additional Documents
                        </Link>
                      </>
                    )}

                    {!application.status && (
                      <Link
                        to="/apply"
                        className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200 text-center"
                      >
                        Start Application
                      </Link>
                    )}
                  </div>
                </div>

                {/* Important Dates */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Important Dates
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-700">Application Submitted</span>
                      <span className="font-medium">
                        {new Date(application.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {application.reviewedAt && (
                      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-700">Last Reviewed</span>
                        <span className="font-medium">
                          {new Date(application.reviewedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Expected Decision</span>
                      <span className="font-medium text-blue-600">
                        {application.status === 'pending' 
                          ? 'Within 10 days' 
                          : 'Decided'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Support */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
                  <h2 className="text-xl font-bold mb-4">Need Help?</h2>
                  <p className="mb-6 text-blue-100">
                    Our admission team is here to assist you.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FiMail className="mr-3" />
                      <span>admissions@college.edu</span>
                    </div>
                    <div className="flex items-center">
                      <FiPhone className="mr-3" />
                      <span>+91 98765 43210</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-6 bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition duration-200">
                    Contact Support
                  </button>
                </div>

                {/* Download Application */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Download Application
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Download a PDF copy of your application for your records.
                  </p>
                  <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition duration-200 flex items-center justify-center">
                    <FiDownload className="mr-2" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ApplicationStatus