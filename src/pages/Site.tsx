import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe, Edit, Eye, Settings, Monitor, Tablet, Smartphone, CheckCircle, AlertCircle, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { DUMMY_USER } from '../lib/constants'

const Site = () => {
  const navigate = useNavigate()
  const user = DUMMY_USER
  const [siteData, setSiteData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState({ show: false, type: '', title: '', message: '' })
  const [showSettings, setShowSettings] = useState(false)
  const [previewDevice, setPreviewDevice] = useState('desktop')

  useEffect(() => {
    if (user) {
      fetchSiteData()
    }
  }, [user])

  const fetchSiteData = async () => {
    try {
      // First get organization subdomain
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('subdomain')
        .eq('id', user.id)
        .single()

      if (orgError) throw orgError
      const organizationSubdomain = orgData.subdomain

      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('organization_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setSiteData(data)
      } else {
        // Create default site
        const defaultSite = {
          organization_id: user.id,
          title: 'My Events Site',
          description: 'Welcome to our events portal',
          subdomain: organizationSubdomain,
          pages: [
            {
              id: 'home',
              name: 'Home',
              path: '/',
              components: [
                {
                  id: '1',
                  type: 'hero',
                  content: {
                    title: 'Welcome to Our Events',
                    subtitle: 'Discover amazing events and experiences',
                    buttonText: 'View Events',
                    buttonLink: '/events'
                  },
                  style: {
                    backgroundColor: '#1e40af',
                    textColor: '#ffffff',
                    padding: '80px 20px'
                  }
                },
                {
                  id: '2',
                  type: 'events',
                  content: {
                    title: 'Upcoming Events',
                    showCount: 6
                  },
                  style: {
                    backgroundColor: '#ffffff',
                    padding: '60px 20px'
                  }
                }
              ]
            }
          ],
          seo: {
            title: 'My Events Site',
            description: 'Welcome to our events portal',
            keywords: 'events, conferences, workshops'
          },
          status: 'draft'
        }

        const { data: newSite, error: createError } = await supabase
          .from('sites')
          .insert(defaultSite)
          .select()
          .single()

        if (createError) throw createError
        setSiteData(newSite)
      }
    } catch (error) {
      console.error('Error fetching site data:', error)
      setNotification({
        show: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to load site data'
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePublishSite = async () => {
    try {
      const { error } = await supabase
        .from('sites')
        .update({ status: 'published', updated_at: new Date().toISOString() })
        .eq('id', siteData.id)

      if (error) throw error

      setSiteData(prev => ({ ...prev, status: 'published' }))
      setNotification({
        show: true,
        type: 'success',
        title: 'Site Published',
        message: 'Your site is now live!'
      })
    } catch (error) {
      console.error('Error publishing site:', error)
      setNotification({
        show: true,
        type: 'error',
        title: 'Publish Failed',
        message: 'Failed to publish site'
      })
    }
  }

  const closeNotification = () => {
    setNotification({ show: false, type: '', title: '', message: '' })
  }

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-full mx-auto px-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading site...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-full mx-auto px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Site Builder</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowSettings(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>
            <button
              onClick={() => window.open(`https://${siteData?.subdomain}.ezent.me`, '_blank')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </button>
            <button
              onClick={() => navigate('/dashboard/site/builder')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-light"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Site
            </button>
          </div>
        </div>

        {/* Site Overview */}
        <div className="mt-8 bg-white shadow-sm rounded-xl border border-gray-200">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">{siteData?.title}</h3>
                  <p className="text-sm text-gray-500">{siteData?.description}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <a
                      href={`https://${siteData?.subdomain}.ezent.me`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-light text-sm font-medium"
                    >
                      {siteData?.subdomain}.ezent.me
                    </a>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${siteData?.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {siteData?.status}
                    </span>
                  </div>
                </div>
              </div>

              {siteData?.status === 'draft' && (
                <button
                  onClick={handlePublishSite}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Publish Site
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Device Preview */}
        <div className="mt-8 bg-white shadow-sm rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Site Preview</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-2 rounded-lg transition-colors ${previewDevice === 'desktop' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                  <Monitor className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-2 rounded-lg transition-colors ${previewDevice === 'tablet' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                  <Tablet className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-2 rounded-lg transition-colors ${previewDevice === 'mobile' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                  <Smartphone className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-center">
              <div className={`border border-gray-300 rounded-lg overflow-hidden transition-all duration-300 ${previewDevice === 'desktop' ? 'w-full max-w-6xl h-96' :
                  previewDevice === 'tablet' ? 'w-96 h-80' :
                    'w-64 h-96'
                }`}>
                <iframe
                  src={`https://${siteData?.subdomain}.ezent.me`}
                  className="w-full h-full"
                  title="Site Preview"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Site Stats */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Eye className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Page Views</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{siteData?.page_views || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Globe className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Visitors</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{siteData?.visitors || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Settings className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Last Updated</dt>
                    <dd className="text-sm font-semibold text-gray-900">
                      {siteData?.updated_at ? new Date(siteData.updated_at).toLocaleDateString() : 'Never'}
                    </dd>
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
                <div className={`flex-shrink-0 ${notification.type === 'success' ? 'text-green-600' : 'text-red-600'
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
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${notification.type === 'success'
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
      </div>
    </div>
  )
}

export default Site