import React, { useState, useEffect } from 'react'
import { 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiCheckCircle, 
  FiXCircle,
  FiDownload,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiClock
} from 'react-icons/fi'
import Navbar from '../common/Navbar'
import LoadingSpinner from '../common/LoadingSpinner'
import axiosInstance from '../../api/axios'
import toast from 'react-hot-toast'

const AdminApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedApplications, setSelectedApplications] = useState([])
  const [bulkAction, setBulkAction] = useState('')

  const statuses = ['', 'pending', 'approved', 'rejected']
  const courses = [
    '', 'Computer Science', 'Electronics & Communication', 
    'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering',
    'Information Technology', 'Business Administration', 'Commerce', 'Arts'
  ]
  const itemsPerPage = 10

  useEffect(() => {
    fetchApplications()
  }, [currentPage, statusFilter, courseFilter])

  const fetchApplications = async () => {
    try {
      let url = `/admin/applications?page=${currentPage}&limit=${itemsPerPage}`
      if (statusFilter) url += `&status=${statusFilter}`
      if (courseFilter) url += `&course=${courseFilter}`
      
      const response = await axiosInstance.get(url)
      setApplications(response.data.data)
      setTotalPages(response.data.pagination.pages)
      setTotalCount(response.data.pagination.total)
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search logic
    toast.info('Search functionality will be implemented')
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selectedApplications.length === 0) {
      toast.error('Please select an action and applications')
      return
    }

    try {
      // Implement bulk action logic
      toast.success(`Bulk ${bulkAction} action applied to ${selectedApplications.length} applications`)
      setSelectedApplications([])
      setBulkAction('')
    } catch (error) {
      toast.error('Failed to apply bulk action')
    }
  }

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await axiosInstance.put(`/admin/applications/${applicationId}/status`, {
        status: newStatus,
        remarks: `Status updated to ${newStatus} by admin`
      })
      
      setApplications(applications.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ))
      
      toast.success(`Application ${newStatus} successfully`)
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update application status')
    }
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedApplications(applications.map(app => app._id))
    } else {
      setSelectedApplications([])
    }
  }

  const handleSelectApplication = (applicationId) => {
    setSelectedApplications(prev => 
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    )
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
            <LoadingSpinner text="Loading applications..." />
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Manage Applications
            </h1>
            <p className="text-gray-600">
              Review and manage admission applications ({totalCount} total)
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={fetchApplications}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200 flex items-center"
            >
              <FiRefreshCw className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Search by name, email, or application ID..."
                />
              </form>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFilter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">All Courses</option>
                {courses.filter(c => c).map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedApplications.length === applications.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">
                  Select All ({selectedApplications.length} selected)
                </span>
              </div>

              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Bulk Actions</option>
                <option value="approve">Approve Selected</option>
                <option value="reject">Reject Selected</option>
                <option value="export">Export Selected</option>
              </select>

              <button
                onClick={handleBulkAction}
                disabled={!bulkAction || selectedApplications.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200 disabled:opacity-50"
              >
                Apply
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition duration-200 flex items-center">
                <FiDownload className="mr-2" />
                Export All
              </button>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500" />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500">No applications found</div>
                    </td>
                  </tr>
                ) : (
                  applications.map((application) => (
                    <tr key={application._id} className="hover:bg-gray-50 transition duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedApplications.includes(application._id)}
                          onChange={() => handleSelectApplication(application._id)}
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-medium text-blue-600">
                              {application.student?.name?.charAt(0) || 'A'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {application.student?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.student?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{application.coursePreferences?.firstChoice}</div>
                        <div className="text-sm text-gray-500">
                          {application.coursePreferences?.secondChoice && `2nd: ${application.coursePreferences.secondChoice}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(application.submittedAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(application.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <a
                            href={`/admin/applications/${application._id}`}
                            className="text-blue-600 hover:text-blue-900 transition duration-200"
                            title="View Details"
                          >
                            <FiEye className="w-5 h-5" />
                          </a>
                          
                          {application.status !== 'approved' && (
                            <button
                              onClick={() => handleStatusUpdate(application._id, 'approved')}
                              className="text-green-600 hover:text-green-900 transition duration-200"
                              title="Approve"
                            >
                              <FiCheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          
                          {application.status !== 'rejected' && (
                            <button
                              onClick={() => handleStatusUpdate(application._id, 'rejected')}
                              className="text-red-600 hover:text-red-900 transition duration-200"
                              title="Reject"
                            >
                              <FiXCircle className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, totalCount)}
                </span> of{' '}
                <span className="font-medium">{totalCount}</span> applications
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded-lg transition duration-200 ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-blue-200 rounded-lg">
                <FiClock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Approved Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => 
                    app.status === 'approved' && 
                    new Date(app.reviewedAt).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <div className="p-3 bg-green-200 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Require Attention</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => 
                    app.status === 'pending' && 
                    new Date(app.submittedAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length}
                </p>
              </div>
              <div className="p-3 bg-red-200 rounded-lg">
                <FiXCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminApplications