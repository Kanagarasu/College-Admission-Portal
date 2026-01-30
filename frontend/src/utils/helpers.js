export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getInitials = (name) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/
  return re.test(phone)
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' }
    case 'rejected':
      return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
    case 'pending':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' }
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' }
  }
}

export const getRoleColor = (role) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' }
    case 'student':
      return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' }
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' }
  }
}