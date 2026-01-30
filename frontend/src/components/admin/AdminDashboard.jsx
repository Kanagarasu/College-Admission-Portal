import React, { useState, useEffect } from 'react'
import { 
  FiUsers, 
  FiFileText, 
  FiCheckCircle, 
  FiClock,
  FiXCircle,
  FiBarChart2,
  FiTrendingUp,
  FiDownload,
  FiRefreshCw
} from 'react-icons/fi'
import { FaGraduationCap } from 'react-icons/fa'
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import Navbar from '../common/Navbar'
import LoadingSpinner from '../common/LoadingSpinner'
import StatsCard from './StatusCard'
import axiosInstance from '../../api/axios'
import toast from 'react-hot-toast'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentApplications, setRecentApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get('/admin/dashboard')
      setStats(response.data.stats)
      setRecentApplications(response.data.stats.recentApplications || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchDashboardData()
  }

  // Chart data for applications by status
  const statusChartData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        data: [
          stats?.applications.pending || 0,
          stats?.applications.approved || 0,
          stats?.applications.rejected || 0
        ],
        backgroundColor: [
          'rgba(255, 193, 7, 0.8)',
          'rgba(40, 167, 69, 0.8)',
          'rgba(220, 53, 69, 0.8)'
        ],
        borderColor: [
          'rgb(255, 193, 7)',
          'rgb(40, 167, 69)',
          'rgb(220, 53, 69)'
        ],
        borderWidth: 1
      }
    ]
  }

  // Chart data for course distribution
  const courseChartData = {
    labels: stats?.distribution.courses.map(course => course._id) || [],
    datasets: [
      {
        label: 'Applications',
        data: stats?.distribution.courses.map(course => course.count) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  }

  // Chart data for monthly trends
  const monthlyTrendsData = {
    labels: stats?.distribution.monthlyTrends.map(trend => `${trend._id.month}/${trend._id.year}`) || [],
    datasets: [
      {
        label: 'Applications',
        data: stats?.distribution.monthlyTrends.map(trend => trend.count) || [],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <LoadingSpinner text="Loading admin dashboard..." />
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
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Overview of admission applications and system statistics
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200 flex items-center disabled:opacity-50"
            >
              <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition duration-200 flex items-center">
              <FiDownload className="mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Applications"
            value={stats?.applications.total || 0}
            icon={<FiFileText className="w-6 h-6" />}
            color="blue"
            trend="+12% from last month"
          />
          <StatsCard
            title="Pending Review"
            value={stats?.applications.pending || 0}
            icon={<FiClock className="w-6 h-6" />}
            color="yellow"
            trend={`${Math.round((stats?.applications.pending / stats?.applications.total) * 100) || 0}% of total`}
          />
          <StatsCard
            title="Approved"
            value={stats?.applications.approved || 0}
            icon={<FiCheckCircle className="w-6 h-6" />}
            color="green"
            trend={`${Math.round((stats?.applications.approved / stats?.applications.total) * 100) || 0}% acceptance rate`}
          />
          <StatsCard
            title="Rejected"
            value={stats?.applications.rejected || 0}
            icon={<FiXCircle className="w-6 h-6" />}
            color="red"
            trend={`${Math.round((stats?.applications.rejected / stats?.applications.total) * 100) || 0}% rejection rate`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Charts Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Application Trends
                </h2>
                <div className="flex items-center space-x-2">
                  <FiTrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Last 6 months</span>
                </div>
              </div>
              <div className="h-80">
                <Line 
                  data={monthlyTrendsData} 
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        display: true,
                        text: 'Monthly Application Trends'
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Applications by Status
                </h3>
                <div className="h-64">
                  <Pie 
                    data={statusChartData} 
                    options={chartOptions}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Top Courses
                </h3>
                <div className="h-64">
                  <Bar 
                    data={courseChartData} 
                    options={{
                      ...chartOptions,
                      indexAxis: 'y',
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          display: false
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Applications & Quick Stats */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Quick Statistics
              </h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Total Students</span>
                    <span className="font-bold text-gray-900">{stats?.users.totalStudents || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Documents Uploaded</span>
                    <span className="font-bold text-gray-900">{stats?.users.totalDocuments || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Avg. Processing Time</span>
                    <span className="font-bold text-gray-900">3.2 days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: '65%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Applications
                </h2>
                <a 
                  href="/admin/applications" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </a>
              </div>
              
              <div className="space-y-4">
                {recentApplications.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent applications</p>
                ) : (
                  recentApplications.map((application) => (
                    <div
                      key={application._id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-900">
                          {application.student?.name}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          application.status === 'approved' ? 'bg-green-100 text-green-800' :
                          application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {application.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {application.coursePreferences?.firstChoice}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Applied: {new Date(application.submittedAt).toLocaleDateString()}</span>
                        <a 
                          href={`/admin/applications/${application._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <a
                  href="/admin/applications"
                  className="block w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition duration-200 text-center"
                >
                  Review Applications
                </a>
                <a
                  href="/admin/users"
                  className="block w-full border-2 border-white text-white py-2 rounded-lg font-medium hover:bg-white/10 transition duration-200 text-center"
                >
                  Manage Users
                </a>
                <button className="w-full border-2 border-white text-white py-2 rounded-lg font-medium hover:bg-white/10 transition duration-200">
                  Generate Reports
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            System Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <FiUsers className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Students</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.users.totalStudents || 0}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Currently enrolled students</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <FiBarChart2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Score</p>
                  <p className="text-2xl font-bold text-gray-900">82.5%</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Average academic score</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <FaGraduationCap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Top Course</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.distribution.courses[0]?._id || 'N/A'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Most applied course</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-orange-100 rounded-lg mr-3">
                  <FiTrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Growth</p>
                  <p className="text-2xl font-bold text-gray-900">+24%</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Monthly application growth</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard