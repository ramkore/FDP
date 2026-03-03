import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Mail, MessageSquare, Phone, Upload, Info, Eye, Send, CheckCircle, AlertCircle, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { DUMMY_USER } from '../../lib/constants'
import Modal from '../Modal'
import TemplateDesigner from './TemplateDesigner'

const CreateCampaign = () => {
  const navigate = useNavigate()
  const user = DUMMY_USER
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showCSVModal, setShowCSVModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [notification, setNotification] = useState({ show: false, type: '', title: '', message: '' })

  const [campaignData, setCampaignData] = useState({
    name: '',
    schedule: '',
    type: 'email',
    template: {
      subject: 'Your Event Update',
      title: 'Hello {{name}}!',
      content: 'We have exciting news about your event registration.',
      footer: 'Best regards, Event Team'
    },
    contacts: []
  })

  const handleBasicInfoChange = (field, value) => {
    setCampaignData(prev => ({ ...prev, [field]: value }))
  }

  const handleTemplateChange = (template) => {
    setCampaignData(prev => ({ ...prev, template }))
  }

  const handleCSVUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploading(true)
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const csv = e.target.result
        const lines = csv.split('\n').filter(line => line.trim())

        if (lines.length < 2) {
          setNotification({
            show: true,
            type: 'error',
            title: 'Invalid CSV File',
            message: 'CSV file must have at least a header row and one data row'
          })
          setUploading(false)
          return
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/["/]/g, ''))
        const contacts = []

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/["/]/g, ''))
          const contact = {}

          headers.forEach((header, index) => {
            contact[header] = values[index] || ''
          })

          // Normalize field names
          const normalizedContact = {
            name: contact.name || contact.user_name || contact['user name'] || contact.username || 'Unknown',
            email: contact.email || contact.user_email || contact['user email'] || contact['email address'] || '',
            team_name: contact.team_name || contact['team name'] || contact.team || '',
            user_name: contact.name || contact.user_name || contact['user name'] || contact.username || 'Unknown',
            user_email: contact.email || contact.user_email || contact['user email'] || contact['email address'] || ''
          }

          if (normalizedContact.email) {
            contacts.push(normalizedContact)
          }
        }

        setCampaignData(prev => ({ ...prev, contacts }))
        console.log('Loaded contacts:', contacts)
      } catch (error) {
        console.error('Error parsing CSV:', error)
        setNotification({
          show: true,
          type: 'error',
          title: 'CSV Parse Error',
          message: 'Error parsing CSV file. Please check the format.'
        })
      } finally {
        setUploading(false)
        event.target.value = '' // Reset file input
      }
    }

    reader.onerror = () => {
      setNotification({
        show: true,
        type: 'error',
        title: 'File Read Error',
        message: 'Error reading file. Please try again.'
      })
      setUploading(false)
    }

    reader.readAsText(file)
  }

  const handleDeleteContacts = () => {
    setCampaignData(prev => ({ ...prev, contacts: [] }))
  }

  const handleCreateCampaign = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          organization_id: user.id,
          name: campaignData.name,
          type: campaignData.type,
          schedule: campaignData.schedule,
          template: campaignData.template,
          contacts: campaignData.contacts,
          status: 'draft'
        })
        .select()
        .single()

      if (error) throw error
      setNotification({
        show: true,
        type: 'success',
        title: 'Campaign Created',
        message: 'Your campaign has been saved as draft successfully.'
      })
      setTimeout(() => navigate('/dashboard/campaign'), 2000)
    } catch (error) {
      console.error('Error creating campaign:', error)
      setNotification({
        show: true,
        type: 'error',
        title: 'Creation Failed',
        message: 'Failed to create campaign. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendCampaign = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          organization_id: user.id,
          name: campaignData.name,
          type: campaignData.type,
          schedule: null,
          template: campaignData.template,
          contacts: campaignData.contacts,
          status: 'sent',
          sent_count: campaignData.contacts.length
        })
        .select()
        .single()

      if (error) throw error

      setNotification({
        show: true,
        type: 'success',
        title: 'Campaign Sent',
        message: 'Your campaign has been sent successfully!'
      })
      setTimeout(() => navigate('/dashboard/campaign'), 2000)
    } catch (error) {
      console.error('Error sending campaign:', error)
      setNotification({
        show: true,
        type: 'error',
        title: 'Send Failed',
        message: `Failed to send campaign: ${error.message}`
      })
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleCampaign = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          organization_id: user.id,
          name: campaignData.name,
          type: campaignData.type,
          schedule: campaignData.schedule,
          template: campaignData.template,
          contacts: campaignData.contacts,
          status: 'scheduled'
        })
        .select()
        .single()

      if (error) throw error
      setNotification({
        show: true,
        type: 'success',
        title: 'Campaign Scheduled',
        message: 'Your campaign has been scheduled successfully.'
      })
      setTimeout(() => navigate('/dashboard/campaign'), 2000)
    } catch (error) {
      console.error('Error scheduling campaign:', error)
      setNotification({
        show: true,
        type: 'error',
        title: 'Scheduling Failed',
        message: 'Failed to schedule campaign. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const closeNotification = () => {
    setNotification({ show: false, type: '', title: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard/campaign')}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Campaigns
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create New Campaign</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${currentStep >= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${currentStep > step ? 'bg-primary' : 'bg-gray-200'
                    }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Basic Info</span>
            <span>Template Design</span>
            <span>Contacts</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm max-w-none">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="p-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Name
                    </label>
                    <input
                      type="text"
                      value={campaignData.name}
                      onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                      placeholder="Enter campaign name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule
                    </label>
                    <input
                      type="datetime-local"
                      value={campaignData.schedule}
                      onChange={(e) => handleBasicInfoChange('schedule', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Leave empty to send immediately, or set a future date to schedule
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Campaign Type
                  </label>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { value: 'email', label: 'Email', icon: Mail, desc: 'Send rich HTML emails to your contacts' },
                      { value: 'sms', label: 'SMS', icon: MessageSquare, desc: 'Send text messages directly to phones' },
                      { value: 'whatsapp', label: 'WhatsApp', icon: Phone, desc: 'Send messages via WhatsApp Business' }
                    ].map(({ value, label, icon: Icon, desc }) => (
                      <button
                        key={value}
                        onClick={() => handleBasicInfoChange('type', value)}
                        className={`flex items-center p-6 border rounded-xl transition-all duration-200 text-left ${campaignData.type === value
                          ? 'border-primary bg-gradient-to-r from-primary/10 to-blue-50 text-primary shadow-sm'
                          : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
                          }`}
                      >
                        <div className={`p-3 rounded-lg mr-4 ${campaignData.type === value ? 'bg-primary/20' : 'bg-gray-100'
                          }`}>
                          <Icon className={`h-6 w-6 ${campaignData.type === value ? 'text-primary' : 'text-gray-500'
                            }`} />
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{label}</div>
                          <div className="text-sm text-gray-500 mt-1">{desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!campaignData.name || !campaignData.type}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-light disabled:opacity-50"
                >
                  Next: Template Design
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Template Design */}
          {currentStep === 2 && (
            <div className="p-2">
              <h2 className="text-lg font-medium text-gray-900 mb-6 px-4">Template Design</h2>

              <TemplateDesigner
                type={campaignData.type}
                template={campaignData.template}
                onChange={handleTemplateChange}
              />

              <div className="flex justify-between mt-8 px-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-light"
                >
                  Next: Add Contacts
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contacts */}
          {currentStep === 3 && (
            <div className="p-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Add Contacts</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={`border-2 border-dashed rounded-xl p-8 transition-colors ${uploading ? 'border-primary bg-primary/5' : 'border-gray-300'
                  }`}>
                  <div className="text-center">
                    <Upload className={`mx-auto h-12 w-12 ${uploading ? 'text-primary animate-pulse' : 'text-gray-400'
                      }`} />
                    <div className="mt-4">
                      <label className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          {uploading ? 'Processing CSV...' : 'Upload CSV file with contacts'}
                        </span>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleCSVUpload}
                          disabled={uploading}
                          className="sr-only"
                        />
                        <span className="mt-1 block text-sm text-gray-500">
                          {uploading ? 'Please wait...' : 'CSV files only'}
                        </span>
                      </label>
                    </div>
                    <div className="mt-4 flex items-center justify-center space-x-4">
                      <button
                        onClick={() => setShowCSVModal(true)}
                        className="inline-flex items-center text-sm text-primary hover:text-primary-light"
                      >
                        <Info className="h-4 w-4 mr-1" />
                        How to get CSV data?
                      </button>
                      {campaignData.contacts.length > 0 && (
                        <span className="text-sm text-green-600 font-medium">
                          ✓ {campaignData.contacts.length} contacts loaded
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {campaignData.contacts.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Loaded Contacts ({campaignData.contacts.length})
                      </h3>
                      <button
                        onClick={handleDeleteContacts}
                        className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border">
                      <div className="space-y-3">
                        {campaignData.contacts.slice(0, 8).map((contact, index) => (
                          <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {contact.name || 'Unknown'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {contact.email || 'No email'}
                              </p>
                              {contact.team_name && (
                                <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1 inline-block">
                                  Team: {contact.team_name}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        {campaignData.contacts.length > 8 && (
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <p className="text-sm text-gray-500">
                              +{campaignData.contacts.length - 8} more contacts
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Back
                </button>
                <div className="space-x-3">
                  <button
                    onClick={handleCreateCampaign}
                    disabled={loading || campaignData.contacts.length === 0}
                    className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary/5 disabled:opacity-50"
                  >
                    Save as Draft
                  </button>
                  {campaignData.schedule ? (
                    <button
                      onClick={() => handleScheduleCampaign()}
                      disabled={loading || campaignData.contacts.length === 0}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Calendar className="h-4 w-4 mr-2 inline" />
                      {loading ? 'Scheduling...' : 'Schedule Campaign'}
                    </button>
                  ) : (
                    <button
                      onClick={handleSendCampaign}
                      disabled={loading || campaignData.contacts.length === 0}
                      className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-light disabled:opacity-50"
                    >
                      <Send className="h-4 w-4 mr-2 inline" />
                      {loading ? 'Sending...' : 'Send Now'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notification Modal */}
        {notification.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
              <div className="flex items-start">
                <div className={`flex-shrink-0 ${notification.type === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {notification.type === 'success' ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <AlertCircle className="h-6 w-6" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {notification.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={closeNotification}
                  className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeNotification}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${notification.type === 'success'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CSV Help Modal */}
        <Modal
          isOpen={showCSVModal}
          onClose={() => setShowCSVModal(false)}
          title="How to get CSV data from Events"
        >
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <h4 className="font-medium text-gray-900 mb-2">Steps to export contact data:</h4>
              <ol className="list-decimal list-inside space-y-2">
                <li>Go to <strong>Events</strong> page from the sidebar</li>
                <li>Click on <strong>"Manage Event"</strong> for the event you want</li>
                <li>Scroll down to <strong>"Export Registration Data"</strong> section</li>
                <li>Select the fields you want to include (Name, Email, etc.)</li>
                <li>Click <strong>"Download CSV"</strong> to get your contact list</li>
                <li>Upload the downloaded CSV file here</li>
              </ol>
            </div>
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Make sure your CSV includes at least 'name' and 'email' columns for the campaign to work properly.
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default CreateCampaign