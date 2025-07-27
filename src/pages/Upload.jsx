import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { Upload as UploadIcon, FileText, X, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const Upload = () => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const { processCSV, loading } = useData()
  const navigate = useNavigate()

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file)
      } else {
        toast.error('Please select a valid CSV file')
      }
    }
  }, [])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file)
      } else {
        toast.error('Please select a valid CSV file')
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first')
      return
    }

    try {
      await processCSV(selectedFile)
      toast.success('File uploaded and processed successfully!')
      navigate('/')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to process CSV file. Please check the file format.')
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload CSV Data</h1>
        <p className="text-gray-600">
          Upload your CSV file to analyze and visualize your data with automated insights.
        </p>
      </div>

      <div className="card">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary-400 bg-primary-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!selectedFile ? (
            <div className="space-y-4">
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drop your CSV file here
                </p>
                <p className="text-gray-500 mt-1">
                  or click to browse files
                </p>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="btn-primary cursor-pointer inline-flex items-center"
              >
                <UploadIcon className="h-5 w-5 mr-2" />
                Choose File
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <div>
                <p className="text-lg font-medium text-gray-900">
                  File selected successfully
                </p>
                <div className="flex items-center justify-center mt-2 space-x-2">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{selectedFile.name}</span>
                  <span className="text-gray-400">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="btn-primary flex items-center"
                >
                  {loading ? (
                    <div className="loading-spinner mr-2"></div>
                  ) : (
                    <UploadIcon className="h-5 w-5 mr-2" />
                  )}
                  {loading ? 'Processing...' : 'Upload & Analyze'}
                </button>
                <button
                  onClick={removeFile}
                  className="btn-secondary flex items-center"
                >
                  <X className="h-5 w-5 mr-2" />
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Features</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Data Analysis</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Automatic column type detection</li>
              <li>• Statistical summaries (mean, median, std dev)</li>
              <li>• Missing data analysis</li>
              <li>• Correlation matrix for numeric columns</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Visualizations</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Histograms and box plots</li>
              <li>• Scatter plots and line charts</li>
              <li>• Bar charts and pie charts</li>
              <li>• Interactive chart controls</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload 