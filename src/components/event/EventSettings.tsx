import { EventData } from './CreateEvent'
import { Users, DollarSign, Calendar, UserCheck } from 'lucide-react'

interface Props {
  eventData: EventData
  setEventData: (data: EventData) => void
  onNext: () => void
  onPrev: () => void
  isFirst: boolean
  isLast: boolean
}

const EventSettings = ({ eventData, setEventData, onNext, onPrev }: Props) => {
  const handleInputChange = (field: keyof EventData, value: any) => {
    setEventData({ ...eventData, [field]: value })
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Event Settings</h2>

      <div className="space-y-8">
        {/* Participation Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            <Users className="inline h-4 w-4 mr-1" />
            Participation Type *
          </label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: 'individual', label: 'Individual', desc: 'Single person registration' },
              { value: 'team', label: 'Team', desc: 'Group registration allowed' }
            ].map(({ value, label, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleInputChange('participation_type', value)}
                className={`p-4 border rounded-lg text-left transition-colors ${eventData.participation_type === value
                    ? 'border-primary bg-primary bg-opacity-10 text-primary'
                    : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <div className="font-medium">{label}</div>
                <div className="text-sm text-gray-500 mt-1">{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Team Size Settings */}
        {eventData.participation_type === 'team' && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Team Size *
              </label>
              <input
                type="number"
                min="1"
                value={eventData.min_team_size}
                onChange={(e) => handleInputChange('min_team_size', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Team Size *
              </label>
              <input
                type="number"
                min={eventData.min_team_size}
                value={eventData.max_team_size}
                onChange={(e) => handleInputChange('max_team_size', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        )}


        {/* Capacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <UserCheck className="inline h-4 w-4 mr-1" />
            Event Capacity
          </label>
          <input
            type="number"
            min="1"
            value={eventData.capacity}
            onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Maximum number of participants"
          />
          <p className="text-sm text-gray-500 mt-1">
            Leave empty for unlimited capacity
          </p>
        </div>

        {/* Registration Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            <Calendar className="inline h-4 w-4 mr-1" />
            Registration Period
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Opens
              </label>
              <input
                type="datetime-local"
                value={eventData.registration_start}
                onChange={(e) => handleInputChange('registration_start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Closes
              </label>
              <input
                type="datetime-local"
                value={eventData.registration_end}
                onChange={(e) => handleInputChange('registration_end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Leave empty to allow registration until event starts
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t">
        <button
          onClick={onPrev}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Next: Registration Form
        </button>
      </div>
    </div>
  )
}

export default EventSettings