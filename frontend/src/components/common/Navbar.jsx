import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FiHome, 
  FiUser, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiBell,
  FiSettings,
  FiHelpCircle
} from 'react-icons/fi'
import { FaGraduationCap } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

import toast from 'react-hot-toast'

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, isStudent } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const studentMenu = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
    { name: 'Apply Now', path: '/apply', icon: <FaGraduationCap /> },
    { name: 'Application Status', path: '/status', icon: <FiBell /> },
    { name: 'Documents', path: '/documents', icon: <FiUser /> },
    { name: 'Profile', path: '/profile', icon: <FiSettings /> },
  ]

  const adminMenu = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome /> },
    { name: 'Applications', path: '/admin/applications', icon: <FaGraduationCap /> },
    { name: 'Users', path: '/admin/users', icon: <FiUser /> },
  ]

  const currentMenu = isAdmin() ? adminMenu : (isStudent() ? studentMenu : [])

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FaGraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                College<span className="text-blue-600">Admit</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated() ? (
              <>
                {/* Navigation Links */}
                <div className="flex items-center space-x-4">
                  {currentMenu.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}
                </div>

                {/* User Profile & Notifications */}
                <div className="flex items-center space-x-4">
                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50 transition duration-200 relative"
                    >
                      <FiBell className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        3
                      </span>
                    </button>
                    
                    {/* Notifications Dropdown */}
                    {showNotifications && (
                      <>
                        <div 
                          className="fixed inset-0 z-40"
                          onClick={() => setShowNotifications(false)}
                        ></div>
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                          <div className="p-4 border-b border-gray-200">
                            <h3 className="font-bold text-gray-900">Notifications</h3>
                          </div>
                          <div className="max-h-96 overflow-y-auto">
                            {[
                              { id: 1, title: 'Application Submitted', message: 'Your application has been submitted successfully', time: '2 min ago', read: false },
                              { id: 2, title: 'Document Uploaded', message: 'Marksheet uploaded successfully', time: '1 hour ago', read: true },
                              { id: 3, title: 'Status Update', message: 'Your application is under review', time: '2 days ago', read: true },
                            ].map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                  </div>
                                  <span className="text-xs text-gray-500">{notification.time}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="p-4 border-t border-gray-200">
                            <button className="w-full text-center text-blue-600 hover:text-blue-800 font-medium">
                              View All Notifications
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* User Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center space-x-3 focus:outline-none">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left hidden lg:block">
                        <p className="font-medium text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <p className="font-medium text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to={isAdmin() ? '/admin/dashboard' : '/dashboard'}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition duration-200"
                        >
                          <FiHome className="w-5 h-5" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition duration-200"
                        >
                          <FiUser className="w-5 h-5" />
                          <span>Profile Settings</span>
                        </Link>
                        <Link
                          to="/help"
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition duration-200"
                        >
                          <FiHelpCircle className="w-5 h-5" />
                          <span>Help & Support</span>
                        </Link>
                      </div>
                      <div className="border-t border-gray-200 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition duration-200"
                        >
                          <FiLogOut className="w-5 h-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-6 py-2 text-gray-700 hover:text-blue-600 font-medium transition duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {isAuthenticated() ? (
              <>
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
                    </div>
                  </div>
                </div>
                
                {currentMenu.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                <div className="border-t border-gray-200 pt-2">
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
                  >
                    <FiLogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar