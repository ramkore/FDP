import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Award, Download, Eye, Users, MoreVertical, Trash2, CheckCircle, AlertCircle, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const Certificates = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalIssued: 0, totalDownloaded: 0, totalTemplates: 0 })
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; certificate: any }>({ isOpen: false, certificate: null })
  const [deleting, setDeleting] = useState(false)
  const [notification, setNotification] = useState({ show: false, type: '', title: '', message: '' })

  useEffect(() => {
    if (user) {
      fetchCertificates()
    }
  }, [user])

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('organization_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCertificates(data || [])
      calculateStats(data || [])
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (certificatesData) => {
    const totalIssued = certificatesData.reduce((sum, c) => sum + (c.issued_count || 0), 0)
    const totalDownloaded = certificatesData.reduce((sum, c) => sum + (c.download_count || 0), 0)
    setStats({ totalIssued, totalDownloaded, totalTemplates: certificatesData.length })
  }

  const handleDeleteCertificate = async () => {
    if (!deleteModal.certificate) return
    
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', deleteModal.certificate.id)
        .eq('organization_id', user.id)

      if (error) throw error
      
      setCertificates(prev => prev.filter(c => c.id !== deleteModal.certificate.id))
      setDeleteModal({ isOpen: false, certificate: null })
      setNotification({
        show: true,
        type: 'success',
        title: 'Certificate Deleted',
        message: 'Certificate has been successfully deleted.'
      })
    } catch (error) {
      console.error('Error deleting certificate:', error)
      setNotification({
        show: true,
        type: 'error',
        title: 'Delete Failed',
        message: 'Failed to delete certificate. Please try again.'
      })
    } finally {
      setDeleting(false)
    }
  }

  const closeNotification = () => {
    setNotification({ show: false, type: '', title: '', message: '' })
  }

  return (
    <div className="py-6">
      <div className="max-w-full mx-auto px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Certificates</h1>
          <button 
            onClick={() => navigate('/dashboard/certificates/create')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-light"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Certificate
          </button>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading certificates...</p>
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-12">
              <Award className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No certificates yet</h3>
              <p className="mt-2 text-gray-600">Get started by creating your first certificate template.</p>
              <button 
                onClick={() => navigate('/dashboard/certificates/create')}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-light"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Certificate
              </button>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-xl border border-gray-200">
              <ul className="divide-y divide-gray-100">
                {certificates.map((certificate) => (
                  <li key={certificate.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Award className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{certificate.name}</p>
                            <p className="text-sm text-gray-500">Created {new Date(certificate.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{certificate.issued_count || 0} issued</p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            certificate.status === 'published' 
                              ? 'bg-green-100 text-green-800'
                              : certificate.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {certificate.status}
                          </span>
                          <div className="relative">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveDropdown(activeDropdown === certificate.id ? null : certificate.id)
                              }}
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            {activeDropdown === certificate.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                                <div className="py-1">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setActiveDropdown(null)
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setDeleteModal({ isOpen: true, certificate })
                                      setActiveDropdown(null)
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Certificate Stats */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Award className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Issued</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.totalIssued}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Download className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Downloaded</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.totalDownloaded}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Templates</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.totalTemplates}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Modal */}
        {notification.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
              <div className="flex items-start">
                <div className={`flex-shrink-0 ${
                  notification.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {notification.type === 'success' ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <AlertCircle className="h-6 w-6" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {notification.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={closeNotification}
                  className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeNotification}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    notification.type === 'success'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 text-red-600">
                  <Trash2 className="h-6 w-6" />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Certificate
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Are you sure you want to delete "{deleteModal.certificate?.name}"? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, certificate: null })}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCertificate}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Certificates