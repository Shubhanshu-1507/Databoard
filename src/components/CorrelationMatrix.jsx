import { useState } from 'react'
import { BarChart3 } from 'lucide-react'

const CorrelationMatrix = ({ correlations }) => {
  const [hoveredCell, setHoveredCell] = useState(null)

  const columns = Object.keys(correlations)
  
  const getCorrelationColor = (value) => {
    const absValue = Math.abs(value)
    if (absValue < 0.1) return 'bg-gray-100'
    if (absValue < 0.3) return 'bg-blue-100'
    if (absValue < 0.5) return 'bg-blue-200'
    if (absValue < 0.7) return 'bg-blue-300'
    if (absValue < 0.9) return 'bg-blue-400'
    return 'bg-blue-500'
  }

  const getCorrelationTextColor = (value) => {
    const absValue = Math.abs(value)
    if (absValue < 0.3) return 'text-gray-600'
    if (absValue < 0.7) return 'text-gray-700'
    return 'text-white'
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <BarChart3 className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Correlation Matrix</h3>
          <p className="text-gray-600">
            Pearson correlation coefficients between numeric columns
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Column
                </th>
                {columns.map(column => (
                  <th key={column} className="px-2 py-2 text-center text-xs font-medium text-gray-700 min-w-[80px]">
                    {column.length > 8 ? column.substring(0, 8) + '...' : column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {columns.map(rowCol => (
                <tr key={rowCol}>
                  <td className="px-4 py-2 text-sm font-medium text-gray-700 border-r border-gray-200">
                    {rowCol.length > 12 ? rowCol.substring(0, 12) + '...' : rowCol}
                  </td>
                  {columns.map(colCol => {
                    const value = correlations[rowCol][colCol]
                    const isDiagonal = rowCol === colCol
                    
                    return (
                      <td
                        key={colCol}
                        className={`px-2 py-2 text-center text-xs border border-gray-200 transition-all duration-200 ${
                          isDiagonal 
                            ? 'bg-gray-100 font-semibold' 
                            : getCorrelationColor(value)
                        } ${getCorrelationTextColor(value)}`}
                        onMouseEnter={() => setHoveredCell({ row: rowCol, col: colCol, value })}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {isDiagonal ? '1.00' : value.toFixed(2)}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300"></div>
          <span className="text-gray-600">No correlation</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-100 border border-gray-300"></div>
          <span className="text-gray-600">Weak</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-300 border border-gray-300"></div>
          <span className="text-gray-600">Moderate</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 border border-gray-300"></div>
          <span className="text-white">Strong</span>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && !hoveredCell.isDiagonal && (
        <div className="absolute bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none z-10">
          {hoveredCell.row} vs {hoveredCell.col}: {hoveredCell.value.toFixed(4)}
        </div>
      )}
    </div>
  )
}

export default CorrelationMatrix 