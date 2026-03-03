import { useState } from 'react'
import { EventData } from '../CreateEvent'
import { Plus, Eye, Settings } from 'lucide-react'
import FormFieldEditor from './FormFieldEditor'
import FormPreview from './FormPreview'

export interface FormField {
  id: string
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file' | 'date' | 'number' | 'url' | 'time' | 'datetime' | 'color' | 'range' | 'rating' | 'signature' | 'address' | 'country' | 'state' | 'city' | 'zipcode' | 'company' | 'job_title' | 'linkedin' | 'twitter' | 'instagram' | 'website' | 'emergency_contact' | 'dietary_restrictions' | 'tshirt_size' | 'gender' | 'age_group' | 'experience_level' | 'team_name' | 'team_size' | 'team_members' | 'team_leader' | 'organization_type' | 'industry' | 'referral_source' | 'special_requirements' | 'accessibility_needs' | 'payment_method' | 'invoice_details' | 'terms_acceptance' | 'newsletter_signup' | 'photo_consent' | 'data_consent'
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    fileTypes?: string[]
    maxFileSize?: number
  }
  conditional?: {
    dependsOn: string
    showWhen: string
  }
  teamSpecific?: boolean
}

interface Props {
  eventData: EventData
  setEventData: (data: EventData) => void
  onNext: () => void
  onPrev: () => void
  isFirst: boolean
  isLast: boolean
}

const FormBuilder = ({ eventData, setEventData, onPrev }: Props) => {
  const [fields, setFields] = useState<FormField[]>(eventData.registration_form || [])
  const [editingField, setEditingField] = useState<FormField | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [activeCategory, setActiveCategory] = useState('basic')

  const fieldCategories = {
    basic: [
      { type: 'text', label: 'Full Name', required: true },
      { type: 'email', label: 'Email Address', required: true },
      { type: 'phone', label: 'Phone Number', required: false },
      { type: 'textarea', label: 'Additional Comments', required: false },
      { type: 'number', label: 'Age', required: false },
      { type: 'date', label: 'Date of Birth', required: false },
      { type: 'gender', label: 'Gender', options: ['Male', 'Female', 'Other', 'Prefer not to say'], required: false }
    ],
    contact: [
      { type: 'address', label: 'Full Address', required: false },
      { type: 'country', label: 'Country', required: false },
      { type: 'state', label: 'State/Province', required: false },
      { type: 'city', label: 'City', required: false },
      { type: 'zipcode', label: 'ZIP/Postal Code', required: false },
      { type: 'emergency_contact', label: 'Emergency Contact', required: false }
    ],
    professional: [
      { type: 'company', label: 'Company/Organization', required: false },
      { type: 'job_title', label: 'Job Title', required: false },
      { type: 'industry', label: 'Industry', options: ['Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Other'], required: false },
      { type: 'experience_level', label: 'Experience Level', options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], required: false },
      { type: 'linkedin', label: 'LinkedIn Profile', required: false },
      { type: 'website', label: 'Website/Portfolio', required: false }
    ],
    team: [
      { type: 'team_name', label: 'Team Name', required: true, teamSpecific: true },
      { type: 'team_size', label: 'Team Size', required: true, teamSpecific: true },
      { type: 'team_members', label: 'Team Members Details', required: true, teamSpecific: true },
      { type: 'team_leader', label: 'Team Leader', required: true, teamSpecific: true },
      { type: 'organization_type', label: 'Organization Type', options: ['Company', 'University', 'Non-profit', 'Government', 'Other'], required: false, teamSpecific: true }
    ],
    event: [
      { type: 'tshirt_size', label: 'T-Shirt Size', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], required: false },
      { type: 'dietary_restrictions', label: 'Dietary Restrictions', options: ['None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher', 'Other'], required: false },
      { type: 'accessibility_needs', label: 'Accessibility Requirements', required: false },
      { type: 'special_requirements', label: 'Special Requirements', required: false },
      { type: 'referral_source', label: 'How did you hear about us?', options: ['Social Media', 'Website', 'Friend', 'Email', 'Advertisement', 'Other'], required: false }
    ],
    media: [
      { type: 'file', label: 'Resume/CV', validation: { fileTypes: ['.pdf', '.doc', '.docx'] }, required: false },
      { type: 'file', label: 'Profile Photo', validation: { fileTypes: ['.jpg', '.jpeg', '.png'] }, required: false },
      { type: 'file', label: 'Portfolio/Work Samples', required: false },
      { type: 'signature', label: 'Digital Signature', required: false }
    ],
    social: [
      { type: 'twitter', label: 'Twitter Handle', required: false },
      { type: 'instagram', label: 'Instagram Handle', required: false },
      { type: 'linkedin', label: 'LinkedIn Profile', required: false }
    ],
    advanced: [
      { type: 'rating', label: 'Rate Your Interest (1-5)', validation: { min: 1, max: 5 }, required: false },
      { type: 'range', label: 'Budget Range', validation: { min: 0, max: 10000 }, required: false },
      { type: 'color', label: 'Preferred Color', required: false },
      { type: 'time', label: 'Preferred Time', required: false },
      { type: 'datetime', label: 'Preferred Date & Time', required: false }
    ],
    legal: [
      { type: 'terms_acceptance', label: 'Accept Terms & Conditions', required: true },
      { type: 'newsletter_signup', label: 'Subscribe to Newsletter', required: false },
      { type: 'photo_consent', label: 'Photo/Video Consent', required: false },
      { type: 'data_consent', label: 'Data Processing Consent', required: true }
    ]
  }

  const addField = (fieldTemplate: Partial<FormField>) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: fieldTemplate.type!,
      label: fieldTemplate.label!,
      placeholder: fieldTemplate.placeholder || '',
      required: fieldTemplate.required || false,
      options: fieldTemplate.options || [],
      validation: fieldTemplate.validation || {}
    }
    setEditingField(newField)
  }

  const saveField = (field: FormField) => {
    const updatedFields = editingField?.id && fields.find(f => f.id === editingField.id)
      ? fields.map(f => f.id === field.id ? field : f)
      : [...fields, field]
    
    setFields(updatedFields)
    setEventData({ ...eventData, registration_form: updatedFields })
    setEditingField(null)
  }

  const deleteField = (fieldId: string) => {
    const updatedFields = fields.filter(f => f.id !== fieldId)
    setFields(updatedFields)
    setEventData({ ...eventData, registration_form: updatedFields })
  }

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const index = fields.findIndex(f => f.id === fieldId)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= fields.length) return

    const updatedFields = [...fields]
    const [movedField] = updatedFields.splice(index, 1)
    updatedFields.splice(newIndex, 0, movedField)
    
    setFields(updatedFields)
    setEventData({ ...eventData, registration_form: updatedFields })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Registration Form Builder</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Preview Form'}
          </button>
        </div>
      </div>

      {showPreview ? (
        <FormPreview fields={fields} eventData={eventData} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Builder */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-md font-medium text-gray-900 mb-4">Add Form Fields</h3>
            
            {/* Category Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8 overflow-x-auto">
                {Object.entries(fieldCategories).map(([category, categoryFields]) => {
                  // Filter team fields based on participation type
                  if (category === 'team' && eventData.participation_type !== 'team') {
                    return null
                  }
                  
                  const categoryNames = {
                    basic: 'Basic',
                    contact: 'Contact',
                    professional: 'Professional',
                    team: 'Team',
                    event: 'Event',
                    media: 'Files',
                    social: 'Social',
                    advanced: 'Advanced',
                    legal: 'Legal'
                  }
                  
                  return (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeCategory === category
                          ? 'border-primary text-primary'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {categoryNames[category as keyof typeof categoryNames]}
                      <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                        {categoryFields.length}
                      </span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Active Category Fields */}
            <div className="mb-6">
              {(() => {
                const categoryFields = fieldCategories[activeCategory as keyof typeof fieldCategories]
                if (!categoryFields) return null
                
                const categoryTitles = {
                  basic: 'Basic Information Fields',
                  contact: 'Contact & Address Fields',
                  professional: 'Professional Information',
                  team: 'Team Registration Fields',
                  event: 'Event-Specific Fields',
                  media: 'File Upload Fields',
                  social: 'Social Media Fields',
                  advanced: 'Advanced Input Fields',
                  legal: 'Legal & Consent Fields'
                }
                
                return (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      {categoryTitles[activeCategory as keyof typeof categoryTitles]}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {categoryFields.map((field, index) => (
                        <button
                          key={`${activeCategory}-${index}`}
                          onClick={() => addField(field)}
                          className="p-4 border border-gray-200 rounded-lg text-left hover:border-primary hover:shadow-sm transition-all group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900 group-hover:text-primary">
                                {field.label}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 capitalize">
                                {field.type?.replace('_', ' ')}
                              </div>
                              {field.required && (
                                <span className="inline-block mt-1 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                                  Required
                                </span>
                              )}
                              {field.teamSpecific && (
                                <span className="inline-block mt-1 ml-1 text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                                  Team Only
                                </span>
                              )}
                            </div>
                            <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              <Plus className="h-4 w-4" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Current Fields */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Form Fields ({fields.length})</h4>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{field.label}</div>
                    <div className="text-xs text-gray-500">
                      {field.type} • {field.required ? 'Required' : 'Optional'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => moveField(field.id, 'up')}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveField(field.id, 'down')}
                      disabled={index === fields.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => setEditingField(field)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteField(field.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Field Editor */}
          <div>
            {editingField ? (
              <FormFieldEditor
                field={editingField}
                onSave={saveField}
                onCancel={() => setEditingField(null)}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Plus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a field type to start building your form</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t">
        <button
          onClick={onPrev}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Previous
        </button>
        <div className="text-sm text-gray-500">
          Form ready! Use the save buttons above to create your event.
        </div>
      </div>
    </div>
  )
}

export default FormBuilder