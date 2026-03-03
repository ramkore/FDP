import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Calendar, MapPin, Clock, Users } from 'lucide-react'

interface Organization {
  id: string
  name: string
  subdomain: string
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  registered: number
}

const SubdomainPage = () => {
  const { subdomain } = useParams()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrganizationData()
  }, [subdomain])

  const fetchOrganizationData = async () => {
    try {
      // Fetch organization by subdomain
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('subdomain', subdomain)
        .single()

      if (orgError) throw orgError
      setOrganization(orgData)

      // Fetch events for this organization
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('organization_id', orgData.id)
        .eq('status', 'published')
        .order('start_date', { ascending: true })

      if (eventsError) throw eventsError
      setEvents(eventsData || [])
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Organization Not Found</h1>
          <p className="text-gray-600">The subdomain "{subdomain}" does not exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{organization.name}</h1>
          <p className="mt-2 text-gray-600">Welcome to our events portal</p>
        </div>
      </header>

      {/* Events Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Events</h2>
          <p className="text-gray-600">Discover and register for our latest events</p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No events scheduled</h3>
            <p className="mt-2 text-gray-600">Check back later for upcoming events.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(event.start_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {new Date(event.start_date).toLocaleTimeString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location || event.online_link || 'Online Event'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {event.capacity ? `0/${event.capacity} registered` : 'Unlimited capacity'}
                    </div>
                  </div>

                  {event.capacity && (
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  )}

                  <button 
                    className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-light transition-colors disabled:opacity-50"
                    disabled={event.capacity && false}
                  >
                    {event.pricing_type === 'free' ? 'Register Now' : `Register - ${event.currency} ${event.price}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default SubdomainPage