import { useState } from 'react'
import { EventData } from './CreateEvent'
import { Upload, Calendar, MapPin, Link as LinkIcon } from 'lucide-react'

interface Props {
  eventData: EventData
  setEventData: (data: EventData) => void
  onNext: () => void
  onPrev: () => void
  isFirst: boolean
  isLast: boolean
}

const BasicDetails = ({ eventData, setEventData, onNext, isFirst }: Props) => {
  const [imagePreview, setImagePreview] = useState<string>('')

  const handleInputChange = (field: keyof EventData, value: any) => {
    setEventData({ ...eventData, [field]: value })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setImagePreview(result)
        handleInputChange('banner_image', result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Event Details</h2>
      
      <div className="space-y-6">
        {/* Event Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Title *
          </label>
          <input
            type="text"
            value={eventData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter event title"
            required
          />
        </div>

        {/* Event Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Description *
          </label>
          <textarea
            value={eventData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Describe your event in detail..."
            required
          />
        </div>

        {/* Banner Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Banner
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Event banner preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    setImagePreview('')
                    handleInputChange('banner_image', '')
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload event banner
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              value={eventData.start_date}
              onChange={(e) => handleInputChange('start_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              End Date & Time *
            </label>
            <input
              type="datetime-local"
              value={eventData.end_date}
              onChange={(e) => handleInputChange('end_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Type *
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: 'offline', label: 'Offline', icon: MapPin },
              { value: 'online', label: 'Online', icon: LinkIcon },
              { value: 'hybrid', label: 'Hybrid', icon: Calendar }
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleInputChange('event_type', value)}
                className={`p-4 border rounded-lg text-center transition-colors ${
                  eventData.event_type === value
                    ? 'border-primary bg-primary bg-opacity-10 text-primary'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Icon className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location/Link based on event type */}
        {eventData.event_type !== 'online' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Event Location *
            </label>
            <input
              type="text"
              value={eventData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter event location"
              required={eventData.event_type !== 'online'}
            />
          </div>
        )}

        {eventData.event_type !== 'offline' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <LinkIcon className="inline h-4 w-4 mr-1" />
              Online Meeting Link *
            </label>
            <input
              type="url"
              value={eventData.online_link}
              onChange={(e) => handleInputChange('online_link', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://zoom.us/j/..."
              required={eventData.event_type !== 'offline'}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-end mt-8 pt-6 border-t">
        <button
          onClick={onNext}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Next: Event Settings
        </button>
      </div>
    </div>
  )
}

export default BasicDetails