import React from 'react'

const StatsCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      border: 'border-green-200'
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      border: 'border-red-200'
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      border: 'border-yellow-200'
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      border: 'border-purple-200'
    }
  }

  const classes = colorClasses[color] || colorClasses.blue

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border ${classes.border}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${classes.bg}`}>
          <div className={classes.text}>
            {icon}
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>
      </div>
      {trend && (
        <div className="text-sm text-gray-500">
          {trend}
        </div>
      )}
    </div>
  )
}

export default StatsCard