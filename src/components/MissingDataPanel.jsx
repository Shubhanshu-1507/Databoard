import { AlertTriangle } from 'lucide-react'

const MissingDataPanel = ({ missingData }) => {
  const columnsWithMissingData = Object.entries(missingData).filter(
    ([_, data]) => data.count > 0
  )

  if (columnsWithMissingData.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Data Quality</h3>
            <p className="text-gray-600">No missing data detected in your dataset.</p>
          </div>
        </div>
      </div>
    )
  }

  const totalMissing = columnsWithMissingData.reduce(
    (sum, [_, data]) => sum + data.count, 0
  )

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Missing Data Analysis</h3>
          <p className="text-gray-600">
            {totalMissing.toLocaleString()} missing values detected across {columnsWithMissingData.length} columns
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {columnsWithMissingData
          .sort(([_, a], [__, b]) => b.count - a.count)
          .map(([columnName, data]) => (
            <div key={columnName} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{columnName}</h4>
                <span className="text-sm text-gray-600">
                  {data.count.toLocaleString()} missing ({data.percentage.toFixed(1)}%)
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${data.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default MissingDataPanel 