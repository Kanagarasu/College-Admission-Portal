import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  FiArrowLeft, 
  FiCheckCircle, 
  FiXCircle, 
  FiFileText,
  FiDownload,
  FiMail,
  FiPhone,
  FiCalendar,
  FiUser,
  FiBook,
  FiMessageSquare,
  FiSave
} from 'react-icons/fi'
import { FaGraduationCap, FaMars, FaVenus, FaTransgender } from 'react-icons/fa'
import Navbar from '../common/Navbar'
import LoadingSpinner from '../common/LoadingSpinner'
import Alert from '../common/Alert'
import axiosInstance from '../../api/axios'
import toast from 'react-hot-toast'

const ApplicationDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [remarks, setRemarks] = useState('')
  const [showRemarksForm, setShowRemarksForm] = useState(false)

  useEffect(() => {
    fetchApplicationDetails()
  }, [id])

  const fetchApplicationDetails = async () => {
    try {
      const response = await axiosInstance.get(`/admin/applications/${id}`)
      setApplication(response.data.application)
      setRemarks(response.data.application.remarks || '')
    } catch (error) {
      console.error('Error fetching application details:', error)
      toast.error('Failed to load application details')
      navigate('/admin/applications')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    if (!remarks.trim() && newStatus !== 'pending') {
      setShowRemarksForm(true)
      toast.error('Please add remarks before updating status')
      return
    }

    setUpdating(true)

    try {
      await axiosInstance.put(`/admin/applications/${id}/status`, {
        status: newStatus,
        remarks: remarks || `Status updated to ${newStatus}`
      })

      setApplication({
        ...application,
        status: newStatus,
        remarks: remarks,
        reviewedAt: new Date().toISOString()
      })
      
      setShowRemarksForm(false)
      toast.success(`Application ${newStatus} successfully`)
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update application status')
    } finally {
      setUpdating(false)
    }
  }

  const handleSaveRemarks = async () => {
    try {
      await axiosInstance.put(`/admin/applications/${id}/status`, {
        status: application.status,
        remarks: remarks
      })
      
      setApplication({ ...application, remarks })
      setShowRemarksForm(false)
      toast.success('Remarks updated successfully')
    } catch (error) {
      toast.error('Failed to update remarks')
    }
  }

  const getGenderIcon = (gender) => {
    switch (gender) {
      case 'male': return <FaMars className="w-5 h-5 text-blue-600" />
      case 'female': return <FaVenus className="w-5 h-5 text-pink-600" />
      default: return <FaTransgender className="w-5 h-5 text-purple-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <LoadingSpinner text="Loading application details..." />
          </div>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert
            type="error"
            title="Application Not Found"
            message="The requested application could not be found."
          />
          <button
            onClick={() => navigate('/admin/applications')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200 flex items-center"
          >
            <FiArrowLeft className="mr-2" />
            Back to Applications
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/admin/applications')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <FiArrowLeft className="mr-2" />
              Back to Applications
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Application Details
            </h1>
            <p className="text-gray-600">
              Review application #{application._id.slice(-8).toUpperCase()}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <span className={`px-4 py-2 rounded-full font-medium ${getStatusColor(application.status)}`}>
              {application.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Application Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Applicant Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Applicant Information
                </h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition duration-200">
                    <FiMail className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition duration-200">
                    <FiPhone className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FiUser className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium text-gray-900">{application.student.name}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FiMail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{application.student.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FiPhone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{application.student.phone}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FiCalendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium text-gray-900">
                      {new Date(application.student.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    {getGenderIcon(application.student.gender)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-medium text-gray-900 capitalize">{application.student.gender}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FiFileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium text-gray-900">{application.personalDetails.category}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Address</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900">{application.student.address.street}</p>
                  <p className="text-gray-600">
                    {application.student.address.city}, {application.student.address.state} - {application.student.address.pincode}
                  </p>
                  <p className="text-gray-600">{application.student.address.country}</p>
                </div>
              </div>
            </div>

            {/* Academic Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Academic Details
              </h2>

              <div className="space-y-8">
                {/* 10th Details */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FiBook className="mr-3" />
                    10th Standard
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Board</p>
                      <p className="font-medium">{application.academicDetails.tenth.board}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">School</p>
                      <p className="font-medium">{application.academicDetails.tenth.school}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Passing Year</p>
                      <p className="font-medium">{application.academicDetails.tenth.passingYear}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Percentage</p>
                      <p className="font-medium text-2xl text-blue-600">
                        {application.academicDetails.tenth.percentage}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* 12th Details */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FiBook className="mr-3" />
                    12th Standard
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Board</p>
                      <p className="font-medium">{application.academicDetails.twelfth.board}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">School/College</p>
                      <p className="font-medium">{application.academicDetails.twelfth.school}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Passing Year</p>
                      <p className="font-medium">{application.academicDetails.twelfth.passingYear}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Percentage</p>
                      <p className="font-medium text-2xl text-blue-600">
                        {application.academicDetails.twelfth.percentage}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Entrance Exam Details */}
                {application.academicDetails.entranceExam.name && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Entrance Exam Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Exam Name</p>
                        <p className="font-medium">{application.academicDetails.entranceExam.name}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Roll Number</p>
                        <p className="font-medium">{application.academicDetails.entranceExam.rollNumber}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Score</p>
                        <p className="font-medium">{application.academicDetails.entranceExam.score}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Rank</p>
                        <p className="font-medium">{application.academicDetails.entranceExam.rank}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Course Preferences */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaGraduationCap className="mr-3" />
                Course Preferences
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                      1
                    </div>
                    <p className="text-sm text-gray-600">First Choice</p>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{application.coursePreferences.firstChoice}</p>
                </div>

                <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                      2
                    </div>
                    <p className="text-sm text-gray-600">Second Choice</p>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{application.coursePreferences.secondChoice || 'Not specified'}</p>
                </div>

                <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                      3
                    </div>
                    <p className="text-sm text-gray-600">Third Choice</p>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{application.coursePreferences.thirdChoice || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Info */}
          <div className="space-y-8">
            {/* Application Status Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Update Status
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleStatusUpdate('approved')}
                  disabled={updating || application.status === 'approved'}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                  <FiCheckCircle className="mr-2" />
                  Approve Application
                </button>

                <button
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={updating || application.status === 'rejected'}
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                  <FiXCircle className="mr-2" />
                  Reject Application
                </button>

                {application.status !== 'pending' && (
                  <button
                    onClick={() => handleStatusUpdate('pending')}
                    disabled={updating}
                    className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium transition duration-200 disabled:opacity-50"
                  >
                    Mark as Pending
                  </button>
                )}
              </div>
            </div>

            {/* Remarks */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Remarks & Notes
                </h2>
                {!showRemarksForm && (
                  <button
                    onClick={() => setShowRemarksForm(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                )}
              </div>

              {showRemarksForm ? (
                <div className="space-y-4">
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    rows="4"
                    placeholder="Add remarks or notes about this application..."
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowRemarksForm(false)
                        setRemarks(application.remarks || '')
                      }}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveRemarks}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200 flex items-center justify-center"
                    >
                      <FiSave className="mr-2" />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {application.remarks ? (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start">
                        <FiMessageSquare className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                        <p className="text-gray-700">{application.remarks}</p>
                      </div>
                      {application.reviewedAt && (
                        <p className="text-sm text-gray-500 mt-3">
                          Updated: {new Date(application.reviewedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No remarks added yet</p>
                  )}
                </>
              )}
            </div>

            {/* Application Timeline */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Timeline
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <FiCheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Application Submitted</p>
                      <p className="text-sm text-gray-600">
                        {new Date(application.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {application.reviewedAt && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <FiFileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Application Reviewed</p>
                        <p className="text-sm text-gray-600">
                          {new Date(application.reviewedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      application.status === 'pending' ? 'bg-yellow-100' : 
                      application.status === 'approved' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {application.status === 'pending' ? (
                        <div className="w-4 h-4 rounded-full border-2 border-yellow-600"></div>
                      ) : application.status === 'approved' ? (
                        <FiCheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <FiXCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {application.status === 'pending' ? 'Decision Pending' : 'Decision Made'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {application.status === 'pending' ? 'Awaiting review' : application.status.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200 flex items-center justify-center">
                  <FiMail className="mr-2" />
                  Send Email to Applicant
                </button>
                <button className="w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition duration-200 flex items-center justify-center">
                  <FiDownload className="mr-2" />
                  Download Application PDF
                </button>
                <button className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition duration-200">
                  View Uploaded Documents
                </button>
              </div>
            </div>

            {/* Application Metadata */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Application Info
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Application ID</span>
                  <span className="font-medium">{application._id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Submitted On</span>
                  <span className="font-medium">
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">
                    {new Date(application.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                {application.reviewedBy && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reviewed By</span>
                    <span className="font-medium">{application.reviewedBy.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationDetails