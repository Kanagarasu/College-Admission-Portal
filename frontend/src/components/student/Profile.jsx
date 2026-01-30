import React, { useState, useEffect } from 'react'
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiCalendar,
  FiMapPin,
  FiLock,
  FiSave,
  FiEdit2,
  FiCheckCircle
} from 'react-icons/fi'
import { FaMars, FaVenus, FaTransgender } from 'react-icons/fa'
import Navbar from '../common/Navbar'
import LoadingSpinner from '../common/LoadingSpinner'
import Alert from '../common/Alert'
import axiosInstance from '../../api/axios'
import toast from 'react-hot-toast'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [changePassword, setChangePassword] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    }
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/users/profile')
      const userData = response.data.user
      setProfile(userData)
      setFormData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
        gender: userData.gender || 'male',
        address: userData.address || {
          street: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India'
        }
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      await axiosInstance.put('/users/profile', formData)
      setProfile({ ...profile, ...formData })
      setEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    setSaving(true)

    try {
      await axiosInstance.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setChangePassword(false)
      toast.success('Password changed successfully!')
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const getGenderIcon = () => {
    switch (formData.gender) {
      case 'male':
        return <FaMars className="w-5 h-5 text-blue-600" />
      case 'female':
        return <FaVenus className="w-5 h-5 text-pink-600" />
      default:
        return <FaTransgender className="w-5 h-5 text-purple-600" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <LoadingSpinner text="Loading profile..." />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your personal information and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Personal Information
                </h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200 flex items-center"
                  >
                    <FiEdit2 className="mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={formData.email}
                          className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          disabled
                          readOnly
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiPhone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          required
                          pattern="[0-9]{10}"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiCalendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender *
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, gender: 'male' })}
                          className={`py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-200 ${
                            formData.gender === 'male'
                              ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <FaMars />
                          <span>Male</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, gender: 'female' })}
                          className={`py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-200 ${
                            formData.gender === 'female'
                              ? 'bg-pink-100 text-pink-700 border-2 border-pink-500'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <FaVenus />
                          <span>Female</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, gender: 'other' })}
                          className={`py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-200 ${
                            formData.gender === 'other'
                              ? 'bg-purple-100 text-purple-700 border-2 border-purple-500'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <FaTransgender />
                          <span>Other</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Address Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleChange}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          name="address.pincode"
                          value={formData.address.pincode}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save/Cancel Buttons */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false)
                        setFormData({
                          name: profile.name,
                          email: profile.email,
                          phone: profile.phone,
                          dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
                          gender: profile.gender || 'male',
                          address: profile.address || {
                            street: '',
                            city: '',
                            state: '',
                            pincode: '',
                            country: 'India'
                          }
                        })
                      }}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center text-gray-600 mb-1">
                        <FiUser className="mr-2" />
                        <span className="text-sm">Full Name</span>
                      </div>
                      <p className="font-medium text-gray-900">{profile.name}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center text-gray-600 mb-1">
                        <FiMail className="mr-2" />
                        <span className="text-sm">Email Address</span>
                      </div>
                      <p className="font-medium text-gray-900">{profile.email}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center text-gray-600 mb-1">
                        <FiPhone className="mr-2" />
                        <span className="text-sm">Phone Number</span>
                      </div>
                      <p className="font-medium text-gray-900">{profile.phone}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center text-gray-600 mb-1">
                        <FiCalendar className="mr-2" />
                        <span className="text-sm">Date of Birth</span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not set'}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center text-gray-600 mb-1">
                        {getGenderIcon()}
                        <span className="text-sm ml-2">Gender</span>
                      </div>
                      <p className="font-medium text-gray-900 capitalize">{profile.gender}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center text-gray-600 mb-1">
                        <FiMapPin className="mr-2" />
                        <span className="text-sm">Country</span>
                      </div>
                      <p className="font-medium text-gray-900">{profile.address?.country || 'India'}</p>
                    </div>
                  </div>

                  {/* Address Details */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Address</h3>
                    <div className="p-6 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Street Address</p>
                          <p className="font-medium">{profile.address?.street || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">City</p>
                          <p className="font-medium">{profile.address?.city || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">State</p>
                          <p className="font-medium">{profile.address?.state || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Pincode</p>
                          <p className="font-medium">{profile.address?.pincode || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Account Information
              </h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Account Status</p>
                      <p className="text-sm text-gray-600">Your account is active and in good standing</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Member Since</p>
                      <p className="text-sm text-gray-600">
                        {new Date(profile.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Last Login</p>
                      <p className="text-sm text-gray-600">
                        {profile.lastLogin 
                          ? new Date(profile.lastLogin).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Never'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Security & Actions */}
          <div className="space-y-8">
            {/* Change Password */}
            {/* <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Change Password
              </h2>
              
              {changePassword ? (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        required
                        minLength="6"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setChangePassword(false)
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        })
                      }}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200 disabled:opacity-50"
                    >
                      {saving ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="text-gray-600 mb-6">
                    For security reasons, update your password regularly.
                  </p>
                  <button
                    onClick={() => setChangePassword(true)}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200 flex items-center justify-center"
                  >
                    <FiLock className="mr-2" />
                    Change Password
                  </button>
                </>
              )}
            </div> */}

            {/* Security Tips */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Security Tips
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <FiCheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-gray-700">Use a strong, unique password</span>
                </div>
                <div className="flex items-start">
                  <FiCheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-gray-700">Never share your login credentials</span>
                </div>
                <div className="flex items-start">
                  <FiCheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-gray-700">Log out after each session</span>
                </div>
                <div className="flex items-start">
                  <FiCheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-gray-700">Keep your contact information updated</span>
                </div>
              </div>
            </div>

            

            {/* Support Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Need Help?</h2>
              <p className="mb-6 text-blue-100">
                Contact support for any account-related issues.
              </p>
              <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition duration-200">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile