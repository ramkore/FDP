import { FormField } from './FormBuilder'
import { EventData } from '../CreateEvent'

interface Props {
  fields: FormField[]
  eventData: EventData
}

const FormPreview = ({ fields, eventData }: Props) => {
  const renderField = (field: FormField) => {
    const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
      case 'url':
      case 'company':
      case 'job_title':
      case 'linkedin':
      case 'website':
      case 'twitter':
      case 'instagram':
      case 'team_name':
      case 'team_leader':
      case 'city':
      case 'zipcode':
      case 'emergency_contact':
        return (
          <input
            type={field.type === 'url' || field.type === 'website' || field.type === 'linkedin' ? 'url' : 
                  field.type === 'email' ? 'email' : 
                  field.type === 'phone' ? 'tel' : 
                  field.type === 'number' || field.type === 'team_size' ? 'number' : 'text'}
            placeholder={field.placeholder}
            className={baseClasses}
            required={field.required}
            disabled
          />
        )
      
      case 'textarea':
      case 'address':
      case 'accessibility_needs':
      case 'special_requirements':
        return (
          <textarea
            placeholder={field.placeholder}
            rows={field.type === 'address' ? 3 : 4}
            className={baseClasses}
            required={field.required}
            disabled
          />
        )
      
      case 'team_members':
        return (
          <div className="space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50">
            <p className="text-sm text-gray-600">Team member details will be collected based on team size</p>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Member 1 Name" className={baseClasses} disabled />
              <input type="email" placeholder="Member 1 Email" className={baseClasses} disabled />
            </div>
            <div className="text-xs text-gray-500">+ Additional members based on team size</div>
          </div>
        )
      
      case 'select':
      case 'tshirt_size':
      case 'dietary_restrictions':
      case 'gender':
      case 'industry':
      case 'experience_level':
      case 'organization_type':
      case 'referral_source':
      case 'country':
      case 'state':
        return (
          <select className={baseClasses} required={field.required} disabled>
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        )
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  required={field.required}
                  disabled
                />
                <span className="ml-2 text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  disabled
                />
                <span className="ml-2 text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )
      
      case 'terms_acceptance':
      case 'newsletter_signup':
      case 'photo_consent':
      case 'data_consent':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              required={field.required}
              disabled
            />
            <span className="ml-2 text-sm text-gray-700">I agree to {field.label.toLowerCase()}</span>
          </label>
        )
      
      case 'file':
        return (
          <div>
            <input
              type="file"
              className={baseClasses}
              required={field.required}
              disabled
            />
            {field.validation?.fileTypes && (
              <p className="text-xs text-gray-500 mt-1">
                Allowed: {field.validation.fileTypes.join(', ')}
              </p>
            )}
          </div>
        )
      
      case 'rating':
        return (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" className="text-2xl text-gray-300" disabled>
                ★
              </button>
            ))}
          </div>
        )
      
      case 'range':
        return (
          <div>
            <input
              type="range"
              min={field.validation?.min || 0}
              max={field.validation?.max || 100}
              className="w-full"
              disabled
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{field.validation?.min || 0}</span>
              <span>{field.validation?.max || 100}</span>
            </div>
          </div>
        )
      
      case 'color':
        return (
          <input
            type="color"
            className="h-10 w-20 border border-gray-300 rounded"
            disabled
          />
        )
      
      case 'time':
        return (
          <input
            type="time"
            className={baseClasses}
            required={field.required}
            disabled
          />
        )
      
      case 'datetime':
        return (
          <input
            type="datetime-local"
            className={baseClasses}
            required={field.required}
            disabled
          />
        )
      
      case 'date':
        return (
          <input
            type="date"
            className={baseClasses}
            required={field.required}
            disabled
          />
        )
      
      case 'signature':
        return (
          <div className="border border-gray-300 rounded-md p-4 bg-gray-50 text-center text-gray-500">
            Digital signature pad would appear here
          </div>
        )
      
      default:
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            className={baseClasses}
            required={field.required}
            disabled
          />
        )
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Registration Form Preview</h3>
        <p className="text-sm text-gray-600">This is how your registration form will appear to attendees</p>
      </div>

      {/* Event Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">{eventData.title || 'Event Title'}</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>📅 {eventData.start_date ? new Date(eventData.start_date).toLocaleDateString() : 'Event Date'}</p>
          <p>📍 {eventData.location || eventData.online_link || 'Event Location'}</p>
          <p>💰 {eventData.pricing_type === 'free' ? 'Free' : `${eventData.currency} ${eventData.price}`}</p>
          {eventData.participation_type === 'team' && (
            <p>👥 Team Size: {eventData.min_team_size}-{eventData.max_team_size} members</p>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <form className="space-y-6">
        {fields.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No form fields added yet.</p>
            <p className="text-sm">Add fields using the form builder to see the preview.</p>
          </div>
        ) : (
          fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
              {field.validation?.min && field.validation?.max && (
                <p className="text-xs text-gray-500 mt-1">
                  {field.type === 'number' ? 'Value' : 'Length'} should be between {field.validation.min} and {field.validation.max}
                </p>
              )}
            </div>
          ))
        )}

        {fields.length > 0 && (
          <div className="pt-4">
            <button
              type="button"
              className="w-full bg-primary text-white py-3 px-4 rounded-md font-medium hover:bg-primary-light transition-colors"
              disabled
            >
              Register for Event
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default FormPreview