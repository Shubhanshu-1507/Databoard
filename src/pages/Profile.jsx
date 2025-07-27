import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Calendar, Database } from 'lucide-react'

const Profile = () => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">
          Manage your account and view your data upload history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Display Name</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {currentUser.displayName || 'Not set'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email Address</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {currentUser.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Member Since</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload History */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Upload History</h2>
            </div>

            {currentUser.datasets && currentUser.datasets.length > 0 ? (
              <div className="space-y-4">
                {currentUser.datasets.slice(0, 5).map((dataset) => (
                  <div key={dataset.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 truncate">{dataset.name}</h3>
                    <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                      <span>{dataset.rowCount.toLocaleString()} rows</span>
                      <span>{new Date(dataset.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {currentUser.datasets.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{currentUser.datasets.length - 5} more datasets
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">No datasets uploaded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 