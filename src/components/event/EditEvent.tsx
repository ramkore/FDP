import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { DUMMY_USER } from '../../lib/constants'
import BasicDetails from './BasicDetails'
import EventSettings from './EventSettings'
import FormBuilder from './form-builder/FormBuilder'
import { Save, Eye, ArrowLeft } from 'lucide-react'
import { EventData } from './CreateEvent'

const EditEvent = () => {
  const navigate = useNavigate()
  const { eventId } = useParams()
  const user = DUMMY_USER
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    description: '',
    event_type: 'offline',
    participation_type: 'individual',
    pricing_type: 'free',
    price: 0,
    currency: 'USD',
    start_date: '',
    end_date: '',
    registration_start: '',
    registration_end: '',
    location: '',
    online_link: '',
    capacity: 100,
    min_team_size: 1,
    max_team_size: 1,
    banner_image: '',
    registration_form: []
  })

  const steps = [
    { id: 1, name: 'Basic Details', component: BasicDetails },
    { id: 2, name: 'Event Settings', component: EventSettings },
    { id: 3, name: 'Registration Form', component: FormBuilder }
  ]

  useEffect(() => {
    if (eventId && user) {
      fetchEvent()
    }
  }, [eventId, user])

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .eq('organization_id', user?.id)
        .single()

      if (error) throw error

      setEventData({
        title: data.title || '',
        description: data.description || '',
        event_type: data.event_type || 'offline',
        participation_type: data.participation_type || 'individual',
        pricing_type: data.pricing_type || 'free',
        price: data.price || 0,
        currency: data.currency || 'USD',
        start_date: data.start_date || '',
        end_date: data.end_date || '',
        registration_start: data.registration_start || '',
        registration_end: data.registration_end || '',
        location: data.location || '',
        online_link: data.online_link || '',
        capacity: data.capacity || 100,
        min_team_size: data.min_team_size || 1,
        max_team_size: data.max_team_size || 1,
        banner_image: data.banner_image || '',
        registration_form: data.registration_form || []
      })
    } catch (error) {
      console.error('Error fetching event:', error)
      navigate('/dashboard/events')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSave = async (status: 'draft' | 'published') => {
    if (!user || !eventId) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('events')
        .update({
          ...eventData,
          status
        })
        .eq('id', eventId)
        .eq('organization_id', user.id)

      if (error) throw error

      navigate('/dashboard/events')
    } catch (error: any) {
      console.error('Error updating event:', error.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const CurrentStepComponent = steps[currentStep - 1].component

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard/events')}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleSave('draft')}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </button>
            <button
              onClick={() => handleSave('published')}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-light disabled:opacity-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              Update Event
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav className="flex space-x-4">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${currentStep === step.id
                    ? 'bg-primary text-white'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {step.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Current Step Content */}
        <div className="bg-white shadow rounded-lg">
          <CurrentStepComponent
            eventData={eventData}
            setEventData={setEventData}
            onNext={() => setCurrentStep(Math.min(currentStep + 1, steps.length))}
            onPrev={() => setCurrentStep(Math.max(currentStep - 1, 1))}
            isFirst={currentStep === 1}
            isLast={currentStep === steps.length}
          />
        </div>
      </div>
    </div>
  )
}

export default EditEvent