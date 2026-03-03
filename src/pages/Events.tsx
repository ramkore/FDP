import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Calendar, MapPin, Users, Edit, Trash2, Settings, RefreshCw, Search, Grid, List, Eye } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { DUMMY_USER } from '../lib/constants'
import Modal from '../components/Modal'

const Events = () => {
  const navigate = useNavigate()
  const user = DUMMY_USER
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, eventId: '', eventTitle: '' })
  const [deleting, setDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [viewMode, setViewMode] = useState('column')
  const [stats, setStats] = useState({ total: 0, active: 0, upcoming: 0, past: 0 })

  useEffect(() => {
    if (user) {
      fetchEvents()
    }
  }, [user])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, filterType])

  const fetchEvents = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organization_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      const eventsData = data || []
      setEvents(eventsData)
      calculateStats(eventsData)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (eventsData) => {
    const now = new Date()
    const total = eventsData.length
    const active = eventsData.filter(event => {
      const startDate = new Date(event.start_date)
      const endDate = new Date(event.end_date)
      return startDate <= now && endDate >= now
    }).length
    const upcoming = eventsData.filter(event => new Date(event.start_date) > now).length
    const past = eventsData.filter(event => new Date(event.end_date) < now).length

    setStats({ total, active, upcoming, past })
  }

  const filterEvents = () => {
    let filtered = events

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterType !== 'all') {
      const now = new Date()
      filtered = filtered.filter(event => {
        if (filterType === 'upcoming') return new Date(event.start_date) > now
        if (filterType === 'past') return new Date(event.end_date) < now
        return true
      })
    }

    setFilteredEvents(filtered)
  }

  const handleEdit = (eventId: string) => {
    navigate(`/dashboard/events/edit/${eventId}`)
  }

  const handleManage = (eventId: string) => {
    navigate(`/dashboard/manage/${eventId}`)
  }

  const handleRefresh = () => {
    setLoading(true)
    fetchEvents()
  }

  const handleDeleteClick = (eventId: string, eventTitle: string) => {
    setDeleteModal({ isOpen: true, eventId, eventTitle })
  }

  const handleDeleteConfirm = async () => {
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', deleteModal.eventId)

      if (error) throw error

      setEvents(events.filter(event => event.id !== deleteModal.eventId))
      setDeleteModal({ isOpen: false, eventId: '', eventTitle: '' })
    } catch (error) {
      console.error('Error deleting event:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Event Dashboard</h1>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={() => navigate('/dashboard/events/create')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-light"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">all time</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                <p className="text-xs text-gray-500">currently running</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
                <p className="text-xs text-gray-500">scheduled</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Past Events</p>
                <p className="text-2xl font-bold text-gray-600">{stats.past}</p>
                <p className="text-xs text-gray-500">completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Events</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('column')}
                  className={`p-2 rounded-md ${viewMode === 'column' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('row')}
                  className={`p-2 rounded-md ${viewMode === 'row' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${filterType === 'all' ? 'bg-primary text-white' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('upcoming')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${filterType === 'upcoming' ? 'bg-primary text-white' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setFilterType('past')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${filterType === 'past' ? 'bg-primary text-white' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}
                >
                  Past
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading events...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No events found</h3>
                <p className="mt-2 text-gray-600">
                  {events.length === 0 ? 'Get started by creating your first event.' : 'Try adjusting your search or filters.'}
                </p>
                {events.length === 0 && (
                  <button
                    onClick={() => navigate('/dashboard/events/create')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-light"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </button>
                )}
              </div>
            ) : viewMode === 'row' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrations</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEvents.map((event) => (
                      <tr key={event.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(event.start_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {event.location || event.online_link || 'Online'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${event.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : event.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {event.capacity ? `0/${event.capacity}` : 'Unlimited'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleManage(event.id)}
                            className="text-primary hover:text-primary-light"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(event.id)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(event.id, event.title)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="bg-white border rounded-lg hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${event.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : event.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                          }`}>
                          {event.status === 'published' ? 'Published' : event.status === 'draft' ? 'Draft' : event.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(event.start_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {event.location || event.online_link || 'Online Event'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          {event.capacity ? `0/${event.capacity} attendees` : 'Unlimited capacity'}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(event.id)}
                            className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(event.id, event.title)}
                            className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                        <button
                          onClick={() => handleManage(event.id)}
                          className="w-full inline-flex justify-center items-center px-3 py-2 border border-primary shadow-sm text-sm font-medium rounded-md text-primary bg-white hover:bg-primary hover:text-white transition-colors"
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Manage Event
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, eventId: '', eventTitle: '' })}
          title="Delete Event"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <strong>{deleteModal.eventTitle}</strong>? This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setDeleteModal({ isOpen: false, eventId: '', eventTitle: '' })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Event'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default Events