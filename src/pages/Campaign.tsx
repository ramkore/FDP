import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Mail, MessageSquare, MoreVertical, Eye, Trash2, CheckCircle, AlertCircle, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const Campaign = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalSent: 0 })
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; campaign: any }>({ isOpen: false, campaign: null })
  const [deleting, setDeleting] = useState(false)
  const [notification, setNotification] = useState({ show: false, type: '', title: '', message: '' })

  useEffect(() => {
    if (user) {
      fetchCampaigns()
    }
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.relative')) {
        setActiveDropdown(null)
      }
    }
    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [activeDropdown])

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('organization_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCampaigns(data || [])
      calculateStats(data || [])
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (campaignsData) => {
    const totalSent = campaignsData.reduce((sum, c) => sum + (c.sent_count || 0), 0)
    setStats({ totalSent })
  }

  const handleDeleteCampaign = async () => {
    if (!deleteModal.campaign) return
    
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', deleteModal.campaign.id)
        .eq('organization_id', user.id)

      if (error) throw error
      
      setCampaigns(prev => prev.filter(c => c.id !== deleteModal.campaign.id))
      setDeleteModal({ isOpen: false, campaign: null })
      setNotification({
        show: true,
        type: 'success',
        title: 'Campaign Deleted',
        message: 'Campaign has been successfully deleted.'
      })
    } catch (error) {
      console.error('Error deleting campaign:', error)
      setNotification({
        show: true,
        type: 'error',
        title: 'Delete Failed',
        message: 'Failed to delete campaign. Please try again.'
      })
    } finally {
      setDeleting(false)
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'email' ? Mail : MessageSquare
  }

  const closeNotification = () => {
    setNotification({ show: false, type: '', title: '', message: '' })
  }

  return (
    <div className="py-6">
      <div className="max-w-full mx-auto px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Campaign</h1>
          <button 
            onClick={() => navigate('/dashboard/campaign/create')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-light"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </button>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading campaigns...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No campaigns yet</h3>
              <p className="mt-2 text-gray-600">Get started by creating your first campaign.</p>
              <button 
                onClick={() => navigate('/dashboard/campaign/create')}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-light"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </button>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-xl border border-gray-200">
              <ul className="divide-y divide-gray-100">
                {campaigns.map((campaign) => {
                  const TypeIcon = getTypeIcon(campaign.type)
                  return (
                    <li key={campaign.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <TypeIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{campaign.name}</p>
                              <p className="text-sm text-gray-500">{campaign.type} • Created {new Date(campaign.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{campaign.sent_count || 0} sent</p>
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              campaign.status === 'sent' 
                                ? 'bg-green-100 text-green-800'
                                : campaign.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {campaign.status}
                            </span>
                            <div className="relative">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setActiveDropdown(activeDropdown === campaign.id ? null : campaign.id)
                                }}
                                className="text-gray-400 hover:text-gray-600 p-1"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              {activeDropdown === campaign.id && (
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
                                        setDeleteModal({ isOpen: true, campaign })
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
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Campaign Stats */}
        <div className="mt-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Mail className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Sent</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.totalSent}</dd>
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
                    Delete Campaign
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Are you sure you want to delete "{deleteModal.campaign?.name}"? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, campaign: null })}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCampaign}
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

export default Campaign