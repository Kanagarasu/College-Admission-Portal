import React, { useState, useEffect } from 'react'
import { 
  FiUpload, 
  FiCheckCircle, 
  FiXCircle, 
  FiFileText,
  FiDownload,
  FiTrash2,
  FiAlertCircle,
  FiEye
} from 'react-icons/fi'
import Navbar from '../common/Navbar'
import LoadingSpinner from '../common/LoadingSpinner'
import Alert from '../common/Alert'
import axiosInstance from '../../api/axios'
import toast from 'react-hot-toast'

const DocumentUpload = () => {
  const [application, setApplication] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedDocumentType, setSelectedDocumentType] = useState('')

  const documentTypes = [
    { id: 'profile_photo', name: 'Profile Photo', required: true, description: 'Recent passport size photo (JPEG/PNG, Max 2MB)' },
    { id: 'marksheet_10th', name: '10th Marksheet', required: true, description: 'Scanned copy of 10th marksheet (PDF, Max 5MB)' },
    { id: 'marksheet_12th', name: '12th Marksheet', required: true, description: 'Scanned copy of 12th marksheet (PDF, Max 5MB)' },
    { id: 'id_proof', name: 'ID Proof', required: true, description: 'Aadhar Card/Passport/Voter ID (PDF/JPEG, Max 2MB)' },
    { id: 'transfer_certificate', name: 'Transfer Certificate', required: false, description: 'Transfer certificate from previous institution' },
    { id: 'cast_certificate', name: 'Caste Certificate', required: false, description: 'For reserved category applicants' },
    { id: 'other', name: 'Other Documents', required: false, description: 'Any additional supporting documents' }
  ]

  useEffect(() => {
    fetchApplicationAndDocuments()
  }, [])

  const fetchApplicationAndDocuments = async () => {
    try {
      const [applicationResponse, documentsResponse] = await Promise.all([
        axiosInstance.get('/applications/my-application'),
        application ? axiosInstance.get(`/applications/${application._id}/documents`) : Promise.resolve({ data: { documents: [] } })
      ])
      
      if (applicationResponse.data.application) {
        setApplication(applicationResponse.data.application)
        setDocuments(documentsResponse.data.documents || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      // toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, and PDF files are allowed')
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedDocumentType || !application) {
      toast.error('Please select a file and document type')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('documentType', selectedDocumentType)
      formData.append('file', selectedFile)

      const response = await axiosInstance.post(
        `/applications/${application._id}/documents`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      setDocuments([...documents, response.data.document])
      setSelectedFile(null)
      setSelectedDocumentType('')
      
      toast.success('Document uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      // toast.error('Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return

    try {
      await axiosInstance.delete(`/applications/documents/${documentId}`)
      setDocuments(documents.filter(doc => doc._id !== documentId))
      toast.success('Document deleted successfully!')
    } catch (error) {
      console.error('Delete error:', error)
      // toast.error('Failed to delete document')
    }
  }

  const getDocumentStatus = (documentType) => {
    const doc = documents.find(d => d.documentType === documentType)
    if (!doc) return { uploaded: false, verified: false }
    
    return { 
      uploaded: true, 
      verified: doc.isVerified,
      document: doc
    }
  }

  const getUploadedCount = () => {
    return documents.filter(doc => doc.documentType !== 'other').length
  }

  const getRequiredCount = () => {
    return documentTypes.filter(doc => doc.required).length
  }

  const progressPercentage = (getUploadedCount() / getRequiredCount()) * 100

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <LoadingSpinner text="Loading documents..." />
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
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiFileText className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Application Required
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You need to submit an admission application before you can upload documents.
            </p>
            <a
              href="/apply"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200"
            >
              Submit Application First
            </a>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Document Upload
          </h1>
          <p className="text-gray-600">
            Upload all required documents for your admission application
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Document Progress
              </h2>
              <p className="text-gray-600">
                {getUploadedCount()} of {getRequiredCount()} required documents uploaded
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-3xl font-bold text-blue-600">
                {Math.round(progressPercentage)}%
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Completion Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <Alert
            type="info"
            message="All required documents must be uploaded before your application can be reviewed. Ensure documents are clear and valid."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Upload New Document
              </h2>

              <div className="space-y-6">
                {/* Document Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Document Type *
                  </label>
                  <select
                    value={selectedDocumentType}
                    onChange={(e) => setSelectedDocumentType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="">Choose document type</option>
                    {documentTypes.map((type) => {
                      const status = getDocumentStatus(type.id)
                      return (
                        <option 
                          key={type.id} 
                          value={type.id}
                          disabled={status.uploaded}
                        >
                          {type.name} {status.uploaded ? '(Already Uploaded)' : ''}
                        </option>
                      )
                    })}
                  </select>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select File *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition duration-200">
                    <div className="space-y-1 text-center">
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-800 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileSelect}
                            accept=".jpg,.jpeg,.png,.pdf"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        JPEG, PNG, PDF up to 5MB
                      </p>
                    </div>
                  </div>

                  {selectedFile && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FiFileText className="w-5 h-5 text-green-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{selectedFile.name}</p>
                            <p className="text-sm text-gray-600">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiXCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div>
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || !selectedDocumentType || uploading}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiUpload className="mr-2" />
                        Upload Document
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Uploaded Documents */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Uploaded Documents ({documents.length})
              </h2>

              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No documents uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((document) => {
                    const docType = documentTypes.find(t => t.id === document.documentType)
                    return (
                      <div
                        key={document._id}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg mr-4">
                              <FiFileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">
                                {docType?.name || document.documentType}
                              </h3>
                              <div className="flex items-center mt-1">
                                <span className="text-sm text-gray-600">
                                  {document.fileName} • {(document.fileSize / 1024 / 1024).toFixed(2)} MB
                                </span>
                                <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                                  document.isVerified
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {document.isVerified ? 'Verified' : 'Pending Verification'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => window.open(document.fileUrl, '_blank')}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition duration-200"
                              title="View Document"
                            >
                              <FiEye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => window.open(document.fileUrl, '_blank')}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition duration-200"
                              title="Download"
                            >
                              <FiDownload className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(document._id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition duration-200"
                              title="Delete"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        
                        {document.verificationNotes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-start">
                              <FiAlertCircle className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                              <p className="text-sm text-gray-700">{document.verificationNotes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Requirements & Status */}
          <div className="space-y-8">
            {/* Document Requirements */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Document Requirements
              </h2>
              
              <div className="space-y-4">
                {documentTypes.map((type) => {
                  const status = getDocumentStatus(type.id)
                  return (
                    <div
                      key={type.id}
                      className={`p-4 rounded-lg border ${
                        status.uploaded
                          ? status.verified
                            ? 'border-green-200 bg-green-50'
                            : 'border-blue-200 bg-blue-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{type.name}</span>
                        {status.uploaded ? (
                          status.verified ? (
                            <FiCheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-blue-600"></div>
                          )
                        ) : (
                          <FiAlertCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded ${
                          type.required
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {type.required ? 'Required' : 'Optional'}
                        </span>
                        {status.uploaded && (
                          <span className="text-xs text-gray-500">
                            Uploaded: {new Date(status.document.uploadedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Upload Guidelines */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Upload Guidelines
              </h2>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FiCheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-gray-700">Ensure documents are clear and legible</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-gray-700">File size should not exceed 5MB</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-gray-700">Only PDF, JPEG, and PNG formats accepted</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-gray-700">Name files appropriately (e.g., "10th_Marksheet.pdf")</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <span className="text-gray-700">All required documents must be uploaded before review</span>
                </li>
              </ul>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Need Help?</h2>
              <p className="mb-6 text-blue-100">
                Having trouble uploading documents? Contact our support team.
              </p>
              <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition duration-200">
                Contact Document Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentUpload