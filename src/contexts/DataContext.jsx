import { createContext, useContext, useState } from 'react'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './AuthContext'
import { parseCSV, calculateAnalytics } from '../utils/analytics'

const DataContext = createContext()

export function useData() {
  return useContext(DataContext)
}

export function DataProvider({ children }) {
  const [currentDataset, setCurrentDataset] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)
  const { currentUser } = useAuth()

  const processCSV = async (file) => {
    setLoading(true)
    try {
      console.log('Starting CSV processing for file:', file.name)
      
      // Parse CSV
      console.log('Parsing CSV...')
      const { data, schema } = await parseCSV(file)
      console.log('CSV parsed successfully. Rows:', data.length, 'Schema:', schema)
      
      // Calculate analytics
      console.log('Calculating analytics...')
      const analyticsData = calculateAnalytics(data, schema)
      console.log('Analytics calculated successfully')
      
      // Create dataset object
      const dataset = {
        id: Date.now().toString(),
        name: file.name,
        uploadedAt: new Date().toISOString(),
        rowCount: data.length,
        columnCount: Object.keys(schema).length,
        schema,
        data: data.slice(0, 1000), // Store first 1000 rows for preview
        analytics: analyticsData
      }
      
      setCurrentDataset(dataset)
      setAnalytics(analyticsData)
      
      // Save to Firestore if user is authenticated
      if (currentUser) {
        console.log('Saving to Firestore for user:', currentUser.uid)
        try {
          const userRef = doc(db, 'users', currentUser.uid)
          await updateDoc(userRef, {
            datasets: arrayUnion({
              id: dataset.id,
              name: dataset.name,
              uploadedAt: dataset.uploadedAt,
              rowCount: dataset.rowCount,
              columnCount: dataset.columnCount
            })
          })
          console.log('Successfully saved to Firestore')
        } catch (firestoreError) {
          console.error('Firestore error:', firestoreError)
          // Don't throw here - the upload was successful, just Firestore failed
        }
      } else {
        console.log('No user authenticated, skipping Firestore save')
      }
      
      return dataset
    } catch (error) {
      console.error('Error processing CSV:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const clearData = () => {
    setCurrentDataset(null)
    setAnalytics(null)
  }

  const value = {
    currentDataset,
    analytics,
    loading,
    processCSV,
    clearData
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
} 