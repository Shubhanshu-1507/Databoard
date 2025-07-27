import Papa from 'papaparse'
import dayjs from 'dayjs'

// Parse CSV file using PapaParse
export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('Error parsing CSV file'))
          return
        }
        
        const data = results.data
        const schema = inferSchema(data)
        
        resolve({ data, schema })
      },
      error: (error) => {
        reject(error)
      }
    })
  })
}

// Infer column types from data
const inferSchema = (data) => {
  if (data.length === 0) return {}
  
  const schema = {}
  const sampleSize = Math.min(100, data.length)
  
  Object.keys(data[0]).forEach(column => {
    const values = data.slice(0, sampleSize).map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '')
    
    if (values.length === 0) {
      schema[column] = 'string'
      return
    }
    
    // Check if it's a date/time column
    if (isDateColumn(column, values)) {
      schema[column] = 'datetime'
      return
    }
    
    // Check if it's numeric
    if (isNumericColumn(values)) {
      schema[column] = 'numeric'
      return
    }
    
    // Default to categorical
    schema[column] = 'categorical'
  })
  
  return schema
}

// Check if column contains date/time values
const isDateColumn = (columnName, values) => {
  const dateKeywords = ['date', 'time', 'timestamp', 'created', 'updated']
  const hasDateKeyword = dateKeywords.some(keyword => 
    columnName.toLowerCase().includes(keyword)
  )
  
  if (hasDateKeyword) return true
  
  // Check if values can be parsed as dates
  const dateCount = values.filter(val => {
    const parsed = dayjs(val)
    return parsed.isValid()
  }).length
  
  return dateCount / values.length > 0.5
}

// Check if column contains numeric values
const isNumericColumn = (values) => {
  const numericCount = values.filter(val => {
    const num = parseFloat(val)
    return !isNaN(num) && isFinite(num)
  }).length
  
  return numericCount / values.length > 0.8
}

// Calculate comprehensive analytics for the dataset
export const calculateAnalytics = (data, schema) => {
  const analytics = {
    summary: {
      totalRows: data.length,
      totalColumns: Object.keys(schema).length,
      missingData: {}
    },
    columns: {}
  }
  
  Object.keys(schema).forEach(column => {
    const values = data.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '')
    const missingCount = data.length - values.length
    
    analytics.summary.missingData[column] = {
      count: missingCount,
      percentage: (missingCount / data.length) * 100
    }
    
    if (schema[column] === 'numeric') {
      analytics.columns[column] = calculateNumericStats(values)
    } else if (schema[column] === 'datetime') {
      analytics.columns[column] = calculateDateTimeStats(values)
    } else {
      analytics.columns[column] = calculateCategoricalStats(values)
    }
  })
  
  // Calculate correlation matrix for numeric columns
  const numericColumns = Object.keys(schema).filter(col => schema[col] === 'numeric')
  if (numericColumns.length > 1) {
    analytics.correlations = calculateCorrelationMatrix(data, numericColumns)
  }
  
  return analytics
}

// Calculate statistics for numeric columns
const calculateNumericStats = (values) => {
  const numbers = values.map(v => parseFloat(v)).filter(n => !isNaN(n) && isFinite(n))
  
  if (numbers.length === 0) {
    return { type: 'numeric', error: 'No valid numeric data' }
  }
  
  const sorted = numbers.sort((a, b) => a - b)
  const n = numbers.length
  const sum = numbers.reduce((a, b) => a + b, 0)
  const mean = sum / n
  const variance = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n
  const stdDev = Math.sqrt(variance)
  
  // Percentiles
  const q25 = sorted[Math.floor(n * 0.25)]
  const q50 = sorted[Math.floor(n * 0.5)]
  const q75 = sorted[Math.floor(n * 0.75)]
  const iqr = q75 - q25
  
  // Outliers (IQR method)
  const lowerBound = q25 - 1.5 * iqr
  const upperBound = q75 + 1.5 * iqr
  const outliers = numbers.filter(n => n < lowerBound || n > upperBound)
  
  // Skewness
  const skewness = numbers.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 3), 0) / n
  
  // Kurtosis
  const kurtosis = numbers.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 4), 0) / n - 3
  
  // Histogram data
  const min = Math.min(...numbers)
  const max = Math.max(...numbers)
  const binCount = Math.min(20, Math.ceil(Math.sqrt(n)))
  const binWidth = (max - min) / binCount
  const histogram = Array(binCount).fill(0)
  
  numbers.forEach(num => {
    const binIndex = Math.min(Math.floor((num - min) / binWidth), binCount - 1)
    histogram[binIndex]++
  })
  
  return {
    type: 'numeric',
    count: n,
    mean: parseFloat(mean.toFixed(4)),
    median: parseFloat(q50.toFixed(4)),
    stdDev: parseFloat(stdDev.toFixed(4)),
    min: parseFloat(min.toFixed(4)),
    max: parseFloat(max.toFixed(4)),
    q25: parseFloat(q25.toFixed(4)),
    q75: parseFloat(q75.toFixed(4)),
    iqr: parseFloat(iqr.toFixed(4)),
    skewness: parseFloat(skewness.toFixed(4)),
    kurtosis: parseFloat(kurtosis.toFixed(4)),
    outliers: {
      count: outliers.length,
      values: outliers.slice(0, 10) // Limit to first 10 outliers
    },
    histogram: {
      bins: histogram,
      binEdges: Array.from({ length: binCount + 1 }, (_, i) => min + i * binWidth),
      binWidth: parseFloat(binWidth.toFixed(4))
    }
  }
}

// Calculate statistics for datetime columns
const calculateDateTimeStats = (values) => {
  const dates = values.map(v => dayjs(v)).filter(d => d.isValid())
  
  if (dates.length === 0) {
    return { type: 'datetime', error: 'No valid date data' }
  }
  
  const sorted = dates.sort((a, b) => a.valueOf() - b.valueOf())
  const min = sorted[0]
  const max = sorted[sorted.length - 1]
  const range = max.diff(min, 'day')
  
  return {
    type: 'datetime',
    count: dates.length,
    min: min.format('YYYY-MM-DD HH:mm:ss'),
    max: max.format('YYYY-MM-DD HH:mm:ss'),
    range: `${range} days`,
    uniqueDates: [...new Set(dates.map(d => d.format('YYYY-MM-DD')))].length
  }
}

// Calculate statistics for categorical columns
const calculateCategoricalStats = (values) => {
  const valueCounts = {}
  values.forEach(val => {
    valueCounts[val] = (valueCounts[val] || 0) + 1
  })
  
  const uniqueValues = Object.keys(valueCounts)
  const sortedValues = uniqueValues.sort((a, b) => valueCounts[b] - valueCounts[a])
  
  return {
    type: 'categorical',
    count: values.length,
    uniqueCount: uniqueValues.length,
    topValues: sortedValues.slice(0, 10).map(val => ({
      value: val,
      count: valueCounts[val],
      percentage: parseFloat(((valueCounts[val] / values.length) * 100).toFixed(2))
    })),
    sampleValues: uniqueValues.slice(0, 5)
  }
}

// Calculate correlation matrix for numeric columns
const calculateCorrelationMatrix = (data, numericColumns) => {
  const matrix = {}
  
  numericColumns.forEach(col1 => {
    matrix[col1] = {}
    numericColumns.forEach(col2 => {
      if (col1 === col2) {
        matrix[col1][col2] = 1
      } else {
        matrix[col1][col2] = calculatePearsonCorrelation(data, col1, col2)
      }
    })
  })
  
  return matrix
}

// Calculate Pearson correlation coefficient
const calculatePearsonCorrelation = (data, col1, col2) => {
  const values1 = data.map(row => parseFloat(row[col1])).filter(n => !isNaN(n) && isFinite(n))
  const values2 = data.map(row => parseFloat(row[col2])).filter(n => !isNaN(n) && isFinite(n))
  
  if (values1.length !== values2.length || values1.length === 0) {
    return 0
  }
  
  const n = values1.length
  const sum1 = values1.reduce((a, b) => a + b, 0)
  const sum2 = values2.reduce((a, b) => a + b, 0)
  const sum1Sq = values1.reduce((a, b) => a + b * b, 0)
  const sum2Sq = values2.reduce((a, b) => a + b * b, 0)
  const pSum = values1.reduce((a, b, i) => a + b * values2[i], 0)
  
  const num = pSum - (sum1 * sum2 / n)
  const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n))
  
  return den === 0 ? 0 : parseFloat((num / den).toFixed(4))
} 