import React from 'react'
import { 
  FiCheckCircle, 
  FiAlertCircle, 
  FiInfo, 
  FiXCircle,
  FiX
} from 'react-icons/fi'

const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose, 
  className = '' 
}) => {
  const alertConfig = {
    success: {
      icon: <FiCheckCircle className="w-5 h-5" />,
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      title: 'text-green-900',
      iconColor: 'text-green-400'
    },
    error: {
      icon: <FiXCircle className="w-5 h-5" />,
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      title: 'text-red-900',
      iconColor: 'text-red-400'
    },
    warning: {
      icon: <FiAlertCircle className="w-5 h-5" />,
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      title: 'text-yellow-900',
      iconColor: 'text-yellow-400'
    },
    info: {
      icon: <FiInfo className="w-5 h-5" />,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      title: 'text-blue-900',
      iconColor: 'text-blue-400'
    }
  }

  const config = alertConfig[type]

  return (
    <div className={`rounded-lg border ${config.border} ${config.bg} p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <div className={`${config.iconColor}`}>
            {config.icon}
          </div>
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.title}`}>
              {title}
            </h3>
          )}
          {message && (
            <div className={`mt-2 text-sm ${config.text}`}>
              <p>{message}</p>
            </div>
          )}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md ${config.bg} p-1.5 ${config.text} hover:${config.bg.replace('50', '100')} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:${config.border.replace('200', '400')}`}
              >
                <span className="sr-only">Dismiss</span>
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Alert