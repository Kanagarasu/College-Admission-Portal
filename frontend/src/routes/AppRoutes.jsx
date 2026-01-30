
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ProtectedRoute from '../components/common/ProtectedRoute'
import StudentDashboard from '../components/student/StudentDashboard'
import AdmissionForm from '../components/student/AdmissionForm'
import ApplicationStatus from '../components/student/ApplicationStatus'
import Profile from '../components/student/Profile'
import DocumentUpload from '../components/student/DocumentUpload'
import ForgotPassword from '../pages/ForgotPassword'
import Home from '../pages/Home'
import AdminDashboard from '../components/admin/AdminDashboard'
import AdminApplications from '../components/admin/AdminApplications'
import UsersManagement from '../components/admin/UsersManagement'
import ApplicationDetails from '../components/admin/ApplicationDetails'
import NotFound from '../pages/NotFound'


function AppRoutes() {
  const { user, loading } = useAuth()

  console.log(user?.role);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }
  return (
    <div>
      <Routes>
         {/* Public Routes */}
         <Route path="/login" element={
           !user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} />
         } />
         <Route path="/register" element={
           !user ? <Register /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} />
         } />
         <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/" element={<Home />} />
         {/* Protected Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/apply" element={<AdmissionForm />} />
          <Route path="/status" element={<ApplicationStatus />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/documents" element={<DocumentUpload />} />
        </Route>


        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/applications/:id" element={<ApplicationDetails />} />
          <Route path="/admin/users" element={<UsersManagement />} />
        </Route>
        <Route path="*" element={<NotFound />} />

      </Routes>
    </div>
  )
}

export default AppRoutes