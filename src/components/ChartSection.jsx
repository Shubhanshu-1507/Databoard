import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter,
  AreaChart, Area, ComposedChart
} from 'recharts'
import { Download, BarChart3, TrendingUp, PieChart as PieChartIcon } from 'lucide-react'
import html2canvas from 'html2canvas'

const ChartSection = ({ data, schema, analytics }) => {
  const [selectedCharts, setSelectedCharts] = useState({})

  const numericColumns = Object.keys(schema).filter(col => schema[col] === 'numeric')
  const categoricalColumns = Object.keys(schema).filter(col => schema[col] === 'categorical')

  const toggleChart = (columnName, chartType) => {
    setSelectedCharts(prev => ({
      ...prev,
      [`${columnName}-${chartType}`]: !prev[`${columnName}-${chartType}`]
    }))
  }

  const exportChart = async (chartRef, filename) => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current)
        const link = document.createElement('a')
        link.download = `${filename}.png`
        link.href = canvas.toDataURL()
        link.click()
      } catch (error) {
        console.error('Error exporting chart:', error)
      }
    }
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  const renderHistogram = (columnName, columnData) => {
    if (!columnData.histogram) return null

    const chartData = columnData.histogram.bins.map((count, index) => ({
      bin: `${columnData.histogram.binEdges[index].toFixed(2)} - ${columnData.histogram.binEdges[index + 1].toFixed(2)}`,
      count
    }))

    return (
      <div key={`${columnName}-histogram`} className="card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">
            {columnName} - Histogram
          </h4>
          <button
            onClick={() => exportChart(document.getElementById(`histogram-${columnName}`), `${columnName}-histogram`)}
            className="btn-secondary text-sm"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
        </div>
        <div id={`histogram-${columnName}`} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bin" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  const renderBarChart = (columnName, columnData) => {
    if (columnData.type !== 'categorical') return null

    const chartData = columnData.topValues.slice(0, 10).map(item => ({
      value: item.value,
      count: item.count
    }))

    return (
      <div key={`${columnName}-bar`} className="card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">
            {columnName} - Top Values
          </h4>
          <button
            onClick={() => exportChart(document.getElementById(`bar-${columnName}`), `${columnName}-bar-chart`)}
            className="btn-secondary text-sm"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
        </div>
        <div id={`bar-${columnName}`} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="value" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  const renderPieChart = (columnName, columnData) => {
    if (columnData.type !== 'categorical') return null

    const chartData = columnData.topValues.slice(0, 6).map(item => ({
      name: item.value,
      value: item.count
    }))

    return (
      <div key={`${columnName}-pie`} className="card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">
            {columnName} - Distribution
          </h4>
          <button
            onClick={() => exportChart(document.getElementById(`pie-${columnName}`), `${columnName}-pie-chart`)}
            className="btn-secondary text-sm"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
        </div>
        <div id={`pie-${columnName}`} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  const renderScatterPlot = () => {
    if (numericColumns.length < 2) return null

    const [col1, col2] = numericColumns.slice(0, 2)
    const chartData = data.slice(0, 100).map(row => ({
      [col1]: parseFloat(row[col1]) || 0,
      [col2]: parseFloat(row[col2]) || 0
    }))

    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">
            {col1} vs {col2} - Scatter Plot
          </h4>
          <button
            onClick={() => exportChart(document.getElementById('scatter-plot'), 'scatter-plot')}
            className="btn-secondary text-sm"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
        </div>
        <div id="scatter-plot" className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={col1} name={col1} />
              <YAxis dataKey={col2} name={col2} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Data Points" data={chartData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Chart Controls */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {numericColumns.map(column => (
            <div key={column} className="space-y-2">
              <h4 className="font-medium text-gray-900">{column}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleChart(column, 'histogram')}
                  className={`btn-secondary text-xs ${selectedCharts[`${column}-histogram`] ? 'bg-primary-600 text-white' : ''}`}
                >
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Histogram
                </button>
              </div>
            </div>
          ))}
          
          {categoricalColumns.map(column => (
            <div key={column} className="space-y-2">
              <h4 className="font-medium text-gray-900">{column}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleChart(column, 'bar')}
                  className={`btn-secondary text-xs ${selectedCharts[`${column}-bar`] ? 'bg-primary-600 text-white' : ''}`}
                >
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Bar
                </button>
                <button
                  onClick={() => toggleChart(column, 'pie')}
                  className={`btn-secondary text-xs ${selectedCharts[`${column}-pie`] ? 'bg-primary-600 text-white' : ''}`}
                >
                  <PieChartIcon className="h-3 w-3 mr-1" />
                  Pie
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Individual Column Charts */}
        {numericColumns.map(column => {
          const columnData = analytics.columns[column]
          return selectedCharts[`${column}-histogram`] ? renderHistogram(column, columnData) : null
        })}
        
        {categoricalColumns.map(column => {
          const columnData = analytics.columns[column]
          return (
            <>
              {selectedCharts[`${column}-bar`] && renderBarChart(column, columnData)}
              {selectedCharts[`${column}-pie`] && renderPieChart(column, columnData)}
            </>
          )
        })}

        {/* Scatter Plot */}
        {numericColumns.length >= 2 && renderScatterPlot()}
      </div>
    </div>
  )
}

export default ChartSection 