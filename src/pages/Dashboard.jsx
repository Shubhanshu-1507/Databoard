import { useData } from '../contexts/DataContext'
import { Link } from 'react-router-dom'
import DataCard from '../components/DataCard'
import ChartSection from '../components/ChartSection'
import CorrelationMatrix from '../components/CorrelationMatrix'
import MissingDataPanel from '../components/MissingDataPanel'
import { Upload, BarChart3, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const { currentDataset, analytics } = useData()

  if (!currentDataset || !analytics) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <BarChart3 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Available</h2>
        <p className="text-gray-600 mb-8">
          Upload a CSV file to start analyzing your data with automated insights and visualizations.
        </p>
        <Link to="/upload" className="btn-primary inline-flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          Upload CSV File
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentDataset.name}
            </h1>
            <p className="text-gray-600">
              {analytics.summary.totalRows.toLocaleString()} rows • {analytics.summary.totalColumns} columns
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <TrendingUp className="h-4 w-4" />
            <span>Last updated: {new Date(currentDataset.uploadedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Rows</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.summary.totalRows.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Columns</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.summary.totalColumns}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Numeric Columns</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.values(analytics.columns).filter(col => col.type === 'numeric').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categorical Columns</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.values(analytics.columns).filter(col => col.type === 'categorical').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Missing Data Panel */}
      <div className="mb-8">
        <MissingDataPanel missingData={analytics.summary.missingData} />
      </div>

      {/* Data Cards Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Column Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(analytics.columns).map(([columnName, columnData]) => (
            <DataCard
              key={columnName}
              columnName={columnName}
              data={columnData}
            />
          ))}
        </div>
      </div>

      {/* Correlation Matrix */}
      {analytics.correlations && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Correlation Matrix</h2>
          <CorrelationMatrix correlations={analytics.correlations} />
        </div>
      )}

      {/* Charts Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Visualizations</h2>
        <ChartSection 
          data={currentDataset.data} 
          schema={currentDataset.schema}
          analytics={analytics}
        />
      </div>
    </div>
  )
}

export default Dashboard 