import { useState } from 'react'
import { FormField } from './FormBuilder'
import { Save, X, Plus, Trash2 } from 'lucide-react'

interface Props {
  field: FormField
  onSave: (field: FormField) => void
  onCancel: () => void
}

const FormFieldEditor = ({ field, onSave, onCancel }: Props) => {
  const [editedField, setEditedField] = useState<FormField>({ ...field })

  const handleSave = () => {
    if (!editedField.label.trim()) return
    onSave(editedField)
  }

  const addOption = () => {
    setEditedField({
      ...editedField,
      options: [...(editedField.options || []), '']
    })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(editedField.options || [])]
    newOptions[index] = value
    setEditedField({ ...editedField, options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = editedField.options?.filter((_, i) => i !== index) || []
    setEditedField({ ...editedField, options: newOptions })
  }

  const needsOptions = ['select', 'radio', 'checkbox', 'tshirt_size', 'dietary_restrictions', 'gender', 'industry', 'experience_level', 'organization_type', 'referral_source'].includes(editedField.type)

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-md font-medium text-gray-900">Edit Field</h4>
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="inline-flex items-center px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary-light"
          >
            <Save className="h-3 w-3 mr-1" />
            Save
          </button>
          <button
            onClick={onCancel}
            className="inline-flex items-center px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            <X className="h-3 w-3 mr-1" />
            Cancel
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Field Label */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field Label *
          </label>
          <input
            type="text"
            value={editedField.label}
            onChange={(e) => setEditedField({ ...editedField, label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            placeholder="Enter field label"
          />
        </div>

        {/* Field Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field Type
          </label>
          <select
            value={editedField.type}
            onChange={(e) => setEditedField({ 
              ...editedField, 
              type: e.target.value as FormField['type'],
              options: needsOptions ? editedField.options : undefined
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm relative z-10"
          >
            <optgroup label="Basic Fields">
              <option value="text">Text Input</option>
              <option value="email">Email</option>
              <option value="phone">Phone Number</option>
              <option value="textarea">Text Area</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="time">Time</option>
              <option value="datetime">Date & Time</option>
              <option value="url">URL</option>
            </optgroup>
            <optgroup label="Selection Fields">
              <option value="select">Dropdown</option>
              <option value="radio">Radio Buttons</option>
              <option value="checkbox">Checkboxes</option>
              <option value="rating">Rating (1-5)</option>
              <option value="range">Range Slider</option>
            </optgroup>
            <optgroup label="Contact Fields">
              <option value="address">Address</option>
              <option value="country">Country</option>
              <option value="state">State/Province</option>
              <option value="city">City</option>
              <option value="zipcode">ZIP Code</option>
            </optgroup>
            <optgroup label="Professional Fields">
              <option value="company">Company</option>
              <option value="job_title">Job Title</option>
              <option value="linkedin">LinkedIn</option>
              <option value="website">Website</option>
            </optgroup>
            <optgroup label="Team Fields">
              <option value="team_name">Team Name</option>
              <option value="team_size">Team Size</option>
              <option value="team_members">Team Members</option>
              <option value="team_leader">Team Leader</option>
            </optgroup>
            <optgroup label="Event Fields">
              <option value="tshirt_size">T-Shirt Size</option>
              <option value="dietary_restrictions">Dietary Restrictions</option>
              <option value="accessibility_needs">Accessibility Needs</option>
            </optgroup>
            <optgroup label="File & Media">
              <option value="file">File Upload</option>
              <option value="signature">Digital Signature</option>
              <option value="color">Color Picker</option>
            </optgroup>
            <optgroup label="Legal & Consent">
              <option value="terms_acceptance">Terms Acceptance</option>
              <option value="newsletter_signup">Newsletter Signup</option>
              <option value="photo_consent">Photo Consent</option>
              <option value="data_consent">Data Consent</option>
            </optgroup>
          </select>
        </div>

        {/* Placeholder */}
        {!needsOptions && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placeholder Text
            </label>
            <input
              type="text"
              value={editedField.placeholder || ''}
              onChange={(e) => setEditedField({ ...editedField, placeholder: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="Enter placeholder text"
            />
          </div>
        )}

        {/* Required Field */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="required"
            checked={editedField.required}
            onChange={(e) => setEditedField({ ...editedField, required: e.target.checked })}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="required" className="ml-2 text-sm text-gray-700">
            Required field
          </label>
        </div>

        {/* Options for select, radio, checkbox */}
        {needsOptions && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Options
              </label>
              <button
                onClick={addOption}
                className="inline-flex items-center px-2 py-1 text-xs bg-primary text-white rounded-md hover:bg-primary-light"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Option
              </button>
            </div>
            <div className="space-y-2">
              {(editedField.options || []).map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    placeholder={`Option ${index + 1}`}
                  />
                  <button
                    onClick={() => removeOption(index)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Upload Settings */}
        {editedField.type === 'file' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File Settings
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Allowed File Types</label>
                <input
                  type="text"
                  value={editedField.validation?.fileTypes?.join(', ') || ''}
                  onChange={(e) => setEditedField({
                    ...editedField,
                    validation: { 
                      ...editedField.validation, 
                      fileTypes: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                    }
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder=".pdf, .doc, .jpg, .png"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max File Size (MB)</label>
                <input
                  type="number"
                  value={editedField.validation?.maxFileSize || ''}
                  onChange={(e) => setEditedField({
                    ...editedField,
                    validation: { ...editedField.validation, maxFileSize: parseInt(e.target.value) || undefined }
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="5"
                />
              </div>
            </div>
          </div>
        )}

        {/* Team Members Field Settings */}
        {editedField.type === 'team_members' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Members Configuration
            </label>
            <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
              This field will automatically generate member detail forms based on team size.
              Each member will have: Name, Email, Phone, Role fields.
            </div>
          </div>
        )}

        {/* Validation Rules */}
        {(editedField.type === 'text' || editedField.type === 'textarea' || editedField.type === 'number' || editedField.type === 'range') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Validation Rules
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  {editedField.type === 'number' || editedField.type === 'range' ? 'Min Value' : 'Min Length'}
                </label>
                <input
                  type="number"
                  value={editedField.validation?.min || ''}
                  onChange={(e) => setEditedField({
                    ...editedField,
                    validation: { ...editedField.validation, min: parseInt(e.target.value) || undefined }
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  {editedField.type === 'number' || editedField.type === 'range' ? 'Max Value' : 'Max Length'}
                </label>
                <input
                  type="number"
                  value={editedField.validation?.max || ''}
                  onChange={(e) => setEditedField({
                    ...editedField,
                    validation: { ...editedField.validation, max: parseInt(e.target.value) || undefined }
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FormFieldEditor