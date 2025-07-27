import { useState } from 'react'
import { ChevronDown, ChevronUp, BarChart3, Calendar, Hash } from 'lucide-react'
import { clsx } from 'clsx'

const DataCard = ({ columnName, data }) => {
  const [expanded, setExpanded] = useState(false)

  const getTypeIcon = (type) => {
    switch (type) {
      case 'numeric':
        return <Hash className="h-4 w-4 text-blue-600" />
      case 'datetime':
        return <Calendar className="h-4 w-4 text-green-600" />
      default:
        return <BarChart3 className="h-4 w-4 text-purple-600" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'numeric':
        return 'bg-blue-100 text-blue-800'
      case 'datetime':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-purple-100 text-purple-800'
    }
  }

  const renderNumericStats = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Count</p>
          <p className="font-semibold">{data.count.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-600">Mean</p>
          <p className="font-semibold">{data.mean}</p>
        </div>
        <div>
          <p className="text-gray-600">Median</p>
          <p className="font-semibold">{data.median}</p>
        </div>
        <div>
          <p className="text-gray-600">Std Dev</p>
          <p className="font-semibold">{data.stdDev}</p>
        </div>
        <div>
          <p className="text-gray-600">Min</p>
          <p className="font-semibold">{data.min}</p>
        </div>
        <div>
          <p className="text-gray-600">Max</p>
          <p className="font-semibold">{data.max}</p>
        </div>
      </div>
      
      {expanded && (
        <div className="space-y-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Q25</p>
              <p className="font-semibold">{data.q25}</p>
            </div>
            <div>
              <p className="text-gray-600">Q75</p>
              <p className="font-semibold">{data.q75}</p>
            </div>
            <div>
              <p className="text-gray-600">IQR</p>
              <p className="font-semibold">{data.iqr}</p>
            </div>
            <div>
              <p className="text-gray-600">Skewness</p>
              <p className="font-semibold">{data.skewness}</p>
            </div>
            <div>
              <p className="text-gray-600">Kurtosis</p>
              <p className="font-semibold">{data.kurtosis}</p>
            </div>
            <div>
              <p className="text-gray-600">Outliers</p>
              <p className="font-semibold">{data.outliers.count}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderCategoricalStats = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Count</p>
          <p className="font-semibold">{data.count.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-600">Unique</p>
          <p className="font-semibold">{data.uniqueCount}</p>
        </div>
      </div>
      
      {expanded && (
        <div className="space-y-3 pt-3 border-t border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Top Values</p>
            <div className="space-y-1">
              {data.topValues.slice(0, 5).map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="truncate">{item.value}</span>
                  <span className="text-gray-600">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderDateTimeStats = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Count</p>
          <p className="font-semibold">{data.count.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-600">Unique Dates</p>
          <p className="font-semibold">{data.uniqueDates}</p>
        </div>
      </div>
      
      {expanded && (
        <div className="space-y-3 pt-3 border-t border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Range</p>
            <div className="space-y-1 text-sm">
              <div>
                <span className="text-gray-600">From: </span>
                <span className="font-medium">{data.min}</span>
              </div>
              <div>
                <span className="text-gray-600">To: </span>
                <span className="font-medium">{data.max}</span>
              </div>
              <div>
                <span className="text-gray-600">Duration: </span>
                <span className="font-medium">{data.range}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderStats = () => {
    if (data.error) {
      return <p className="text-red-600 text-sm">{data.error}</p>
    }

    switch (data.type) {
      case 'numeric':
        return renderNumericStats()
      case 'categorical':
        return renderCategoricalStats()
      case 'datetime':
        return renderDateTimeStats()
      default:
        return <p className="text-gray-600 text-sm">No data available</p>
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getTypeIcon(data.type)}
          <h3 className="font-semibold text-gray-900 truncate">{columnName}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className={clsx(
            'px-2 py-1 rounded-full text-xs font-medium',
            getTypeColor(data.type)
          )}>
            {data.type}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>
      
      {renderStats()}
    </div>
  )
}

export default DataCard 