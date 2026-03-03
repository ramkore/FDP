import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { DUMMY_USER } from '../../lib/constants'
import BasicDetails from './BasicDetails'
import EventSettings from './EventSettings'
import FormBuilder from './form-builder/FormBuilder'
import { Save, Eye, ArrowLeft } from 'lucide-react'

export interface EventData {
  title: string
  description: string
  event_type: 'online' | 'offline' | 'hybrid'
  participation_type: 'individual' | 'team'
  pricing_type: 'free' | 'paid'
  price: number
  currency: string
  start_date: string
  end_date: string
  registration_start: string
  registration_end: string
  location: string
  online_link: string
  capacity: number
  min_team_size: number
  max_team_size: number
  banner_image: string
  registration_form: any[]
}

const CreateEvent = () => {
  const navigate = useNavigate()
  const user = DUMMY_USER
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
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

  const handleSave = async (status: 'draft' | 'published') => {
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('events')
        .insert({
          ...eventData,
          organization_id: user.id,
          status
        })

      if (error) throw error

      navigate('/dashboard/events')
    } catch (error: any) {
      console.error('Error saving event:', error.message)
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Create Event</h1>
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
              Publish Event
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

export default CreateEvent