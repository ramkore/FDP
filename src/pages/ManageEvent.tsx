import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Trash2, UserCheck, UserX, Calendar, MapPin, Users, Clock, Share2, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { DUMMY_USER } from '../lib/constants'
import Modal from '../components/Modal'
import CSVDownloadSection from '../components/CSVDownloadSection'

const ManageEvent = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const user = DUMMY_USER
  const [searchParams, setSearchParams] = useSearchParams()
  const [event, setEvent] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [registrationStats, setRegistrationStats] = useState({ total: 0, completionRate: 0 })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const activeTab = searchParams.get('tab')
  const isRegistrationTab = activeTab === 'registrationdata'

  useEffect(() => {
    if (user && eventId) {
      fetchEvent()
      fetchRegistrationStats()
      if (isRegistrationTab) {
        fetchRegistrations()
      } else {
        fetchRecentRegistrations()
      }
    }
  }, [user, eventId, isRegistrationTab, currentPage, searchTerm])

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .eq('organization_id', user.id)
        .single()

      if (error) throw error
      setEvent(data)
    } catch (error) {
      console.error('Error fetching event:', error)
      navigate('/dashboard/events')
    } finally {
      setLoading(false)
    }
  }

  const fetchRegistrationStats = async () => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('id, status')
        .eq('event_id', eventId)

      if (error) throw error
      const total = data?.length || 0
      const completed = data?.filter(r => r.status === 'registered').length || 0
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

      setRegistrationStats({ total, completionRate })
    } catch (error) {
      console.error('Error fetching registration stats:', error)
    }
  }

  const fetchRecentRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId)
        .order('registration_date', { ascending: false })
        .limit(5)

      if (error) throw error
      setRegistrations(data || [])
    } catch (error) {
      console.error('Error fetching recent registrations:', error)
    }
  }

  const fetchRegistrations = async () => {
    try {
      const itemsPerPage = 15
      const from = (currentPage - 1) * itemsPerPage
      const to = from + itemsPerPage - 1

      let query = supabase
        .from('event_registrations')
        .select('*', { count: 'exact' })
        .eq('event_id', eventId)
        .order('registration_date', { ascending: false })
        .range(from, to)

      if (searchTerm) {
        query = query.or(`user_name.ilike.%${searchTerm}%,user_email.ilike.%${searchTerm}%`)
      }

      const { data, error, count } = await query

      if (error) throw error
      setRegistrations(data || [])
      setTotalPages(Math.ceil((count || 0) / itemsPerPage))
    } catch (error) {
      console.error('Error fetching registrations:', error)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true)
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: newStatus })
        .eq('id', eventId)

      if (error) throw error
      setEvent({ ...event, status: newStatus })
    } catch (error) {
      console.error('Error updating event status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const handleRegistrationToggle = async () => {
    const newStatus = event.registration_open ? 'closed' : 'open'
    setUpdating(true)
    try {
      const { error } = await supabase
        .from('events')
        .update({ registration_open: !event.registration_open })
        .eq('id', eventId)

      if (error) throw error
      setEvent({ ...event, registration_open: !event.registration_open })
    } catch (error) {
      console.error('Error updating registration status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    setUpdating(true)
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error
      navigate('/dashboard/events')
    } catch (error) {
      console.error('Error deleting event:', error)
      setUpdating(false)
    }
  }

  const handleShareEvent = () => {
    const eventUrl = `${window.location.origin}/events/${eventId}`
    navigator.clipboard.writeText(eventUrl)
    // You could add a toast notification here
  }

  const handleViewAllRegistrations = () => {
    setSearchParams({ tab: 'registrationdata', page: '1' })
    setCurrentPage(1)
  }

  const handleBackToOverview = () => {
    setSearchParams({})
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    setSearchParams({ tab: 'registrationdata', page: page.toString() })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Event not found</h2>
          <button
            onClick={() => navigate('/dashboard/events')}
            className="mt-4 text-primary hover:underline"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard/events')}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Events
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Manage Event</h1>
        </div>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {!isRegistrationTab ? (
                <>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">{event.title}</h2>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${event.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : event.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                        {event.status === 'published' ? 'Published' : event.status === 'draft' ? 'Draft' : event.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-blue-900 mb-2">Total Registrations</h3>
                        <p className="text-3xl font-bold text-blue-600">{registrationStats.total}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-green-900 mb-2">Completion Rate</h3>
                        <p className="text-3xl font-bold text-green-600">{registrationStats.completionRate}%</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <button
                        onClick={handleBackToOverview}
                        className="mr-4 text-gray-600 hover:text-gray-900"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <h2 className="text-xl font-semibold text-gray-900">Event Registrations</h2>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {!isRegistrationTab ? (
                <>
                  {/* Quick Actions */}
                  <div className="border-t pt-6 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <button
                        onClick={() => handleStatusUpdate(event.status === 'published' ? 'draft' : 'published')}
                        disabled={updating}
                        className={`flex items-center justify-center px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${event.status === 'published'
                            ? 'border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                            : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                          } disabled:opacity-50`}
                      >
                        {event.status === 'published' ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Unpublish Event
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Publish Event
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleRegistrationToggle}
                        disabled={updating}
                        className={`flex items-center justify-center px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${event.registration_open
                            ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
                            : 'border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100'
                          } disabled:opacity-50`}
                      >
                        {event.registration_open ? (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            Stop Registrations
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Start Registrations
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setDeleteModal(true)}
                        className="flex items-center justify-center px-4 py-3 rounded-lg border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 text-sm font-medium transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Event
                      </button>

                      <button
                        onClick={() => navigate(`/dashboard/events/edit/${eventId}`)}
                        className="flex items-center justify-center px-4 py-3 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium transition-colors"
                      >
                        Edit Details
                      </button>
                    </div>
                  </div>

                  {/* Recent Registrations */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">Recent Registrations</h3>
                      <button
                        onClick={handleViewAllRegistrations}
                        className="text-primary hover:text-primary-light text-sm font-medium"
                      >
                        All Registrations
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Showing the 5 most recent registrations. Click "All Registrations" to view and manage all event registrations.
                    </p>

                    {registrations.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {registrations.map((registration) => (
                              <tr key={registration.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {registration.user_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {registration.user_email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(registration.registration_date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${registration.status === 'registered'
                                      ? 'bg-green-100 text-green-800'
                                      : registration.status === 'cancelled'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {registration.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No registrations yet</p>
                    )}
                  </div>

                  {/* CSV Download Section */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Export Registration Data</h3>
                    <CSVDownloadSection eventId={eventId} />
                  </div>
                </>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {registrations.map((registration) => (
                        <tr key={registration.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {registration.user_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {registration.user_email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {registration.team_name || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(registration.registration_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${registration.status === 'registered'
                                ? 'bg-green-100 text-green-800'
                                : registration.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {registration.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${registration.payment_status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : registration.payment_status === 'failed'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {registration.payment_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center mt-6 space-x-2">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium ${page === currentPage
                                ? 'bg-primary text-white'
                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            {page}
                          </button>
                        )
                      })}

                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="w-80">
            <div className="sticky top-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Event Details</h3>

                {/* Banner Image */}
                {event.banner_image && (
                  <div className="mb-4">
                    <img
                      src={event.banner_image}
                      alt={event.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    {event.description && (
                      <p className="text-sm text-gray-600 mt-1 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                        {event.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                      <div>
                        <div>{new Date(event.start_date).toLocaleDateString()}</div>
                        <div className="text-xs">{new Date(event.start_date).toLocaleTimeString()}</div>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                      <div>{event.location || event.online_link || 'Online Event'}</div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-3 text-gray-400" />
                      <div>{event.capacity ? `${event.capacity} max capacity` : 'Unlimited capacity'}</div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-3 text-gray-400" />
                      <div>Created {new Date(event.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-gray-600">Registration Status</span>
                      <span className={`font-medium ${event.registration_open ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {event.registration_open ? 'Open' : 'Closed'}
                      </span>
                    </div>

                    <button
                      onClick={handleShareEvent}
                      className="w-full flex items-center justify-center px-4 py-2 border border-primary text-primary bg-white hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          title="Delete Event"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <strong>{event.title}</strong>? This action cannot be undone and will remove all associated data.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={updating}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {updating ? 'Deleting...' : 'Delete Event'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default ManageEvent