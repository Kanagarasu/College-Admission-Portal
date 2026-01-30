// import React, { createContext, useState, useContext, useEffect } from 'react'
// import axiosInstance from '../api/axios'
// import toast from 'react-hot-toast'

// const AuthContext = createContext({})

// export const useAuth = () => useContext(AuthContext)

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [token, setToken] = useState(localStorage.getItem('token'))

//   useEffect(() => {
//     const initializeAuth = async () => {
//       const storedToken = localStorage.getItem('token')
//       const storedUser = localStorage.getItem('user')
      
//       if (storedToken && storedUser) {
//         setToken(storedToken)
//         setUser(JSON.parse(storedUser))
//       }
//       setLoading(false)
//     }
    
//     initializeAuth()
//   }, [])

//   const login = async (email, password) => {
//     try {
//       const response = await axiosInstance.post('/auth/login', {
//         email,
//         password
//       })
      
//       const { token, user } = response.data
      
//       // Store token and user in localStorage
//       localStorage.setItem('token', token)
//       localStorage.setItem('user', JSON.stringify(user))
      
//       // Update state
//       setToken(token)
//       setUser(user)
      
//       toast.success('Login successful!')
//       return { success: true, user }
//     } catch (error) {
//       console.error('Login error:', error)
//       throw error
//     }
//   }

//   const register = async (userData) => {
//     try {
//       const response = await axiosInstance.post('/auth/register', userData)
      
//       const { token, user } = response.data
      
//       // Store token and user in localStorage
//       localStorage.setItem('token', token)
//       localStorage.setItem('user', JSON.stringify(user))
      
//       // Update state
//       setToken(token)
//       setUser(user)
      
//       toast.success('Registration successful!')
//       return { success: true, user }
//     } catch (error) {
//       console.error('Registration error:', error)
//       throw error
//     }
//   }

//   const logout = () => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('user')
//     setToken(null)
//     setUser(null)
//     toast.success('Logged out successfully!')
//     window.location.href = '/login'
//   }

//   const updateProfile = async (profileData) => {
//     try {
//       const response = await axiosInstance.put('/users/profile', profileData)
//       const updatedUser = { ...user, ...response.data.user }
      
//       localStorage.setItem('user', JSON.stringify(updatedUser))
//       setUser(updatedUser)
      
//       toast.success('Profile updated successfully!')
//       return updatedUser
//     } catch (error) {
//       console.error('Update profile error:', error)
//       throw error
//     }
//   }

//   const changePassword = async (currentPassword, newPassword) => {
//     try {
//       await axiosInstance.put('/users/change-password', {
//         currentPassword,
//         newPassword
//       })
      
//       toast.success('Password changed successfully!')
//       return true
//     } catch (error) {
//       console.error('Change password error:', error)
//       throw error
//     }
//   }

//   const isAuthenticated = () => {
//     return !!token && !!user
//   }

//   const isAdmin = () => {
//     return user?.role === 'admin'
//   }

//   const isStudent = () => {
//     return user?.role === 'student'
//   }

//   const value = {
//     user,
//     token,
//     loading,
//     login,
//     register,
//     logout,
//     updateProfile,
//     changePassword,
//     isAuthenticated,
//     isAdmin,
//     isStudent
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }



import React, { createContext, useState, useContext, useEffect } from 'react'
import axiosInstance from '../api/axios'
import toast from 'react-hot-toast'

export const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Load user from localStorage on refresh
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // LOGIN
  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      })

      const { token, user } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      setToken(token)
      setUser(user)

      toast.success('Login successful!')
      return user
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // REGISTER
  const register = async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData)

      const { token, user } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      setToken(token)
      setUser(user)

      toast.success('Registration successful!')
      return user
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  // LOGOUT
  const logout = () => {
    localStorage.clear()
    setUser(null)
    setToken(null)
    toast.success('Logged out successfully!')
    window.location.href = '/login'
  }

  // UPDATE PROFILE
  const updateProfile = async (profileData) => {
    try {
      const response = await axiosInstance.put('/users/profile', profileData)
      const updatedUser = { ...user, ...response.data.user }

      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)

      toast.success('Profile updated successfully!')
      return updatedUser
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  // CHANGE PASSWORD
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await axiosInstance.put('/users/change-password', {
        currentPassword,
        newPassword
      })

      toast.success('Password changed successfully!')
      return true
    } catch (error) {
      console.error('Change password error:', error)
      throw error
    }
  }

  // HELPERS
  const isAuthenticated = () => !!token && !!user
  const isAdmin = () => user?.role === 'admin'
  const isStudent = () => user?.role === 'student'

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        isAuthenticated,
        isAdmin,
        isStudent
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
