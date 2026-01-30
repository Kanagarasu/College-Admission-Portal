import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FiFileText, 
  FiCheckCircle, 
  FiClock, 
  FiUpload, 
  FiUser,
  FiArrowRight,
  FiAlertCircle
} from 'react-icons/fi'
import { FaGraduationCap } from 'react-icons/fa'
import Navbar from '../common/Navbar'
import LoadingSpinner from '../common/LoadingSpinner'
import Alert from '../common/Alert'
import axiosInstance from '../../api/axios'
import toast from 'react-hot-toast'

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    applicationStatus: 'Not Submitted',
    documentsUploaded: 0,
    totalDocuments: 4,
    applicationSubmitted: false
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [dashboardResponse, applicationResponse] = await Promise.all([
        axiosInstance.get('/users/dashboard'),
        axiosInstance.get('/applications/my-application')
      ])

      const dashboard = dashboardResponse.data.data
      const application = applicationResponse.data.application
      
      setDashboardData(dashboard)
      
      if (application) {
        setStats({
          applicationStatus: application.status,
          documentsUploaded: application.documents?.length || 0,
          totalDocuments: 4,
          applicationSubmitted: true
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <FiCheckCircle className="w-5 h-5 text-green-600" />
      case 'rejected':
        return <FiAlertCircle className="w-5 h-5 text-red-600" />
      case 'pending':
        return <FiClock className="w-5 h-5 text-yellow-600" />
      default:
        return <FiFileText className="w-5 h-5 text-gray-600" />
    }
  }

  const progressPercentage = (stats.documentsUploaded / stats.totalDocuments) * 100

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <LoadingSpinner text="Loading your dashboard..." />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {dashboardData?.user?.name || 'Student'}! 👋
          </h1>
          <p className="text-gray-600">
            Here's your admission application progress and important updates.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Application Status Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaGraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(stats.applicationStatus)}`}>
                {stats.applicationStatus}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Application Status
            </h3>
            <p className="text-gray-600 mb-4">
              {stats.applicationSubmitted 
                ? 'Your application is being reviewed'
                : 'Start your admission application'
              }
            </p>
            <Link
              to={stats.applicationSubmitted ? '/status' : '/apply'}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              {stats.applicationSubmitted ? 'View Details' : 'Apply Now'}
              <FiArrowRight className="ml-2" />
            </Link>
          </div>

          {/* Documents Uploaded Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiUpload className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stats.documentsUploaded}/{stats.totalDocuments}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Documents Uploaded
            </h3>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Profile Completion Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiUser className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                100%
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Profile Complete
            </h3>
            <p className="text-gray-600 mb-4">
              Your profile information is complete and up to date.
            </p>
            <Link
              to="/profile"
              className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
            >
              Edit Profile
              <FiArrowRight className="ml-2" />
            </Link>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FiFileText className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                0
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Pending Tasks
            </h3>
            <p className="text-gray-600 mb-4">
              You're all caught up! No pending tasks.
            </p>
            <button className="text-gray-400 font-medium cursor-default">
              Up to date
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Application Progress */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Application Progress
                </h2>
                {!stats.applicationSubmitted && (
                  <Link
                    to="/apply"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200"
                  >
                    Start Application
                  </Link>
                )}
              </div>

              {/* Progress Steps */}
              <div className="space-y-6">
                {/* Step 1 - Registration */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FiCheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-900">Account Registration</h3>
                    <p className="text-gray-600">Completed on {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Step 2 - Application Form */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full ${stats.applicationSubmitted ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center`}>
                      {stats.applicationSubmitted ? (
                        <FiCheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-900">Admission Application</h3>
                    <p className="text-gray-600">
                      {stats.applicationSubmitted 
                        ? 'Submitted on ' + new Date().toLocaleDateString()
                        : 'Fill out the admission form'
                      }
                    </p>
                  </div>
                </div>

                {/* Step 3 - Document Upload */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full ${stats.documentsUploaded === stats.totalDocuments ? 'bg-green-100' : 'bg-yellow-100'} flex items-center justify-center`}>
                      {stats.documentsUploaded === stats.totalDocuments ? (
                        <FiCheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <FiClock className="w-6 h-6 text-yellow-600" />
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-900">Document Upload</h3>
                    <p className="text-gray-600">
                      {stats.documentsUploaded === stats.totalDocuments 
                        ? 'All documents uploaded'
                        : `${stats.documentsUploaded} of ${stats.totalDocuments} documents uploaded`
                      }
                    </p>
                  </div>
                </div>

                {/* Step 4 - Review & Approval */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {getStatusIcon(stats.applicationStatus)}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-900">Review & Approval</h3>
                    <p className="text-gray-600">
                      {stats.applicationSubmitted
                        ? `Status: ${stats.applicationStatus}`
                        : 'Awaiting application submission'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/apply"
                  className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                    stats.applicationSubmitted
                      ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  disabled={stats.applicationSubmitted}
                >
                  {stats.applicationSubmitted ? 'Application Submitted' : 'Fill Application Form'}
                </Link>
                <Link
                  to="/documents"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition duration-200"
                >
                  Upload Documents
                </Link>
                <Link
                  to="/status"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition duration-200"
                >
                  View Application Status
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                      <FiCheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Account Created</h4>
                      <p className="text-sm text-gray-600">Your account was successfully created</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Just now</span>
                </div>
                {stats.applicationSubmitted && (
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg mr-4">
                        <FiFileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Application Submitted</h4>
                        <p className="text-sm text-gray-600">Your admission application was submitted</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Info & Notifications */}
          <div className="space-y-8">
            {/* Application Status Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Application Details
              </h2>
              {dashboardData?.application ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Application ID</p>
                    <p className="font-medium text-gray-900">
                      #{dashboardData.application._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(dashboardData.application.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Course Preference</p>
                    <p className="font-medium text-gray-900">
                      {dashboardData.application.coursePreferences?.firstChoice || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Status</p>
                    <div className="flex items-center mt-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(dashboardData.application.status)}`}>
                        {dashboardData.application.status}
                      </span>
                      {dashboardData.application.status === 'pending' && (
                        <FiClock className="ml-2 text-yellow-600" />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No application submitted yet</p>
                  <Link
                    to="/apply"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200 inline-block"
                  >
                    Start Application
                  </Link>
                </div>
              )}
            </div>

            {/* Important Updates */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Important Updates
              </h2>
              <div className="space-y-4">
                <Alert
                  type="info"
                  title="Application Deadline"
                  message="Last date for admission applications: Dec 31, 2024"
                />
                <Alert
                  type="warning"
                  title="Document Verification"
                  message="Ensure all uploaded documents are clear and valid"
                />
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Need Help?</h2>
              <p className="mb-6">
                Our admission team is here to assist you with any questions.
              </p>
              <div className="space-y-3">
                <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition duration-200">
                  Contact Support
                </button>
                <button className="w-full border-2 border-white text-white py-2 rounded-lg font-medium hover:bg-white/10 transition duration-200">
                  View FAQ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard