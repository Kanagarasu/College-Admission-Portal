import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'https://college-admission-portal-dbie.onrender.com/api'

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error
    
    if (response) {
      const { status, data } = response
      
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          if (window.location.pathname !== '/login') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            toast.error('Session expired. Please login again.')
            window.location.href = '/login'
          }
          break
          
        case 403:
          // Forbidden - insufficient permissions
          toast.error('You do not have permission to access this resource.')
          break
          
        case 404:
          // Not found
          // toast.error('Resource not found.')
          break
          
        case 500:
          // Server error
          toast.error('Server error. Please try again later.')
          break
          
        default:
          if (data && data.message) {
            toast.error(data.message)
          } else {
            toast.error('An error occurred. Please try again.')
          }
      }
    } else {
      toast.error('Network error. Please check your connection.')
    }
    
    return Promise.reject(error)
  }
)

export default axiosInstance