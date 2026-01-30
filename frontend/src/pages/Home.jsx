import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { FiBookOpen, FiCheckCircle, FiUpload, FiBarChart2, FiShield, FiUsers } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const Home = () => {
  const { isAuthenticated, user } = useAuth()

  console.log(user);
  console.log(isAuthenticated);

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const features = [
    {
      icon: <FiBookOpen className="w-8 h-8" />,
      title: 'Easy Application',
      description: 'Fill your admission form online with a simple step-by-step process.',
      color: 'blue'
    },
    {
      icon: <FiUpload className="w-8 h-8" />,
      title: 'Document Upload',
      description: 'Upload required documents securely from your device.',
      color: 'green'
    },
    {
      icon: <FiCheckCircle className="w-8 h-8" />,
      title: 'Track Status',
      description: 'Real-time tracking of your application status.',
      color: 'purple'
    },
    {
      icon: <FiBarChart2 className="w-8 h-8" />,
      title: 'Admin Dashboard',
      description: 'Comprehensive dashboard for administrators to manage applications.',
      color: 'orange'
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: 'Secure & Private',
      description: 'Your data is protected with industry-standard security measures.',
      color: 'red'
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Role-Based Access',
      description: 'Separate interfaces for students and administrators.',
      color: 'indigo'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              College Admission Portal
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Streamline your college admission process with our secure and efficient platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-blue-600 bg-white rounded-full hover:bg-blue-50 transition duration-200 transform hover:-translate-y-1"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white border-2 border-white rounded-full hover:bg-white hover:text-blue-600 transition duration-200"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <Link
                  to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-blue-600 bg-white rounded-full hover:bg-blue-50 transition duration-200 transform hover:-translate-y-1"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides all the tools necessary for a seamless admission experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-${feature.color}-100 text-${feature.color}-600`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to complete your admission process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-600 text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Register</h3>
              <p className="text-gray-600">Create your student account</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Apply</h3>
              <p className="text-gray-600">Fill the admission form</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 text-purple-600 text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Upload</h3>
              <p className="text-gray-600">Submit required documents</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 text-orange-600 text-2xl font-bold mb-4">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Track</h3>
              <p className="text-gray-600">Monitor application status</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of students who have successfully applied through our portal
          </p>
          {!isAuthenticated ? (
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-blue-600 bg-white rounded-full hover:bg-blue-50 transition duration-200 transform hover:scale-105"
            >
              Create Free Account
            </Link>
          ) : (
            <Link
              to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-blue-600 bg-white rounded-full hover:bg-blue-50 transition duration-200 transform hover:scale-105"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home