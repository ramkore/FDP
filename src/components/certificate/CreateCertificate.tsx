import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Upload, Info, Eye, Send, CheckCircle, AlertCircle, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { DUMMY_USER } from '../../lib/constants'
import Modal from '../Modal'
import CertificateTemplateDesigner from './CertificateTemplateDesigner'

const CreateCertificate = () => {
  const navigate = useNavigate()
  const user = DUMMY_USER
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showCSVModal, setShowCSVModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [notification, setNotification] = useState({ show: false, type: '', title: '', message: '' })

  const [certificateData, setCertificateData] = useState({
    name: '',
    schedule: '',
    template: {
      components: [
        { id: '1', type: 'title', content: 'Certificate of Achievement', style: { fontSize: '32px', color: '#1a365d', fontWeight: 'bold', textAlign: 'center' } },
        { id: '2', type: 'subtitle', content: 'This is to certify that', style: { fontSize: '18px', color: '#4a5568', textAlign: 'center' } },
        { id: '3', type: 'name', content: '{{name}}', style: { fontSize: '28px', color: '#2d3748', fontWeight: 'bold', textAlign: 'center' } },
        { id: '4', type: 'description', content: 'has successfully completed the requirements for', style: { fontSize: '16px', color: '#4a5568', textAlign: 'center' } },
        { id: '5', type: 'course', content: '{{course_name}}', style: { fontSize: '20px', color: '#2d3748', fontWeight: 'semibold', textAlign: 'center' } },
        { id: '6', type: 'date', content: 'Date: {{date}}', style: { fontSize: '14px', color: '#718096', textAlign: 'center' } }
      ],
      certificateStyle: {
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: '2px',
        borderRadius: '12px',
        padding: '48px',
        width: '800px',
        height: '600px',
        fontFamily: 'Georgia, serif'
      }
    },
    recipients: []
  })

  const handleBasicInfoChange = (field, value) => {
    setCertificateData(prev => ({ ...prev, [field]: value }))
  }

  const handleTemplateChange = (template) => {
    setCertificateData(prev => ({ ...prev, template }))
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
        const recipients = []

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/["/]/g, ''))
          const recipient = {}

          headers.forEach((header, index) => {
            recipient[header] = values[index] || ''
          })

          const normalizedRecipient = {
            name: recipient.name || recipient.user_name || recipient['user name'] || recipient.username || 'Unknown',
            email: recipient.email || recipient.user_email || recipient['user email'] || recipient['email address'] || '',
            course_name: recipient.course_name || recipient['course name'] || recipient.course || recipient.event_name || recipient['event name'] || '',
            date: recipient.date || recipient.completion_date || recipient['completion date'] || new Date().toLocaleDateString()
          }

          if (normalizedRecipient.email) {
            recipients.push(normalizedRecipient)
          }
        }

        setCertificateData(prev => ({ ...prev, recipients }))
        console.log('Loaded recipients:', recipients)
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
        event.target.value = ''
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

  const handleDeleteRecipients = () => {
    setCertificateData(prev => ({ ...prev, recipients: [] }))
  }

  const handleCreateCertificate = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('certificates')
        .insert({
          organization_id: user.id,
          name: certificateData.name,
          schedule: certificateData.schedule,
          template: certificateData.template,
          recipients: certificateData.recipients,
          status: 'draft'
        })
        .select()
        .single()

      if (error) throw error
      setNotification({
        show: true,
        type: 'success',
        title: 'Certificate Created',
        message: 'Your certificate has been saved as draft successfully.'
      })
      setTimeout(() => navigate('/dashboard/certificates'), 2000)
    } catch (error) {
      console.error('Error creating certificate:', error)
      setNotification({
        show: true,
        type: 'error',
        title: 'Creation Failed',
        message: 'Failed to create certificate. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePublishCertificate = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('certificates')
        .insert({
          organization_id: user.id,
          name: certificateData.name,
          schedule: null,
          template: certificateData.template,
          recipients: certificateData.recipients,
          status: 'published',
          issued_count: certificateData.recipients.length
        })
        .select()
        .single()

      if (error) throw error

      setNotification({
        show: true,
        type: 'success',
        title: 'Certificates Published',
        message: `${certificateData.recipients.length} certificates have been published successfully!`
      })
      setTimeout(() => navigate('/dashboard/certificates'), 2000)
    } catch (error) {
      console.error('Error publishing certificates:', error)
      setNotification({
        show: true,
        type: 'error',
        title: 'Publish Failed',
        message: `Failed to publish certificates: ${error.message}`
      })
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleCertificate = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('certificates')
        .insert({
          organization_id: user.id,
          name: certificateData.name,
          schedule: certificateData.schedule,
          template: certificateData.template,
          recipients: certificateData.recipients,
          status: 'scheduled'
        })
        .select()
        .single()

      if (error) throw error
      setNotification({
        show: true,
        type: 'success',
        title: 'Certificate Scheduled',
        message: 'Your certificate has been scheduled successfully.'
      })
      setTimeout(() => navigate('/dashboard/certificates'), 2000)
    } catch (error) {
      console.error('Error scheduling certificate:', error)
      setNotification({
        show: true,
        type: 'error',
        title: 'Scheduling Failed',
        message: 'Failed to schedule certificate. Please try again.'
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
            onClick={() => navigate('/dashboard/certificates')}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Certificates
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create New Certificate</h1>
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
            <span>Recipients</span>
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
                      Certificate Name
                    </label>
                    <input
                      type="text"
                      value={certificateData.name}
                      onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                      placeholder="Enter certificate name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule Publication
                    </label>
                    <input
                      type="datetime-local"
                      value={certificateData.schedule}
                      onChange={(e) => handleBasicInfoChange('schedule', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Leave empty to publish immediately, or set a future date to schedule
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Certificate Features</h3>
                  <ul className="space-y-3 text-sm text-blue-800">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                      Drag & drop template designer
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                      Dynamic variables support
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                      Bulk certificate generation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                      Email delivery to recipients
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!certificateData.name}
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

              <CertificateTemplateDesigner
                template={certificateData.template}
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
                  Next: Add Recipients
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Recipients */}
          {currentStep === 3 && (
            <div className="p-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Add Recipients</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={`border-2 border-dashed rounded-xl p-8 transition-colors ${uploading ? 'border-primary bg-primary/5' : 'border-gray-300'
                  }`}>
                  <div className="text-center">
                    <Upload className={`mx-auto h-12 w-12 ${uploading ? 'text-primary animate-pulse' : 'text-gray-400'
                      }`} />
                    <div className="mt-4">
                      <label className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          {uploading ? 'Processing CSV...' : 'Upload CSV file with recipients'}
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
                        CSV Format Help
                      </button>
                      {certificateData.recipients.length > 0 && (
                        <span className="text-sm text-green-600 font-medium">
                          ✓ {certificateData.recipients.length} recipients loaded
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {certificateData.recipients.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Recipients ({certificateData.recipients.length})
                      </h3>
                      <button
                        onClick={handleDeleteRecipients}
                        className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border">
                      <div className="space-y-3">
                        {certificateData.recipients.slice(0, 8).map((recipient, index) => (
                          <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {recipient.name || 'Unknown'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {recipient.email || 'No email'}
                              </p>
                              {recipient.course_name && (
                                <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1 inline-block">
                                  Course: {recipient.course_name}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        {certificateData.recipients.length > 8 && (
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <p className="text-sm text-gray-500">
                              +{certificateData.recipients.length - 8} more recipients
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
                    onClick={handleCreateCertificate}
                    disabled={loading || certificateData.recipients.length === 0}
                    className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary/5 disabled:opacity-50"
                  >
                    Save as Draft
                  </button>
                  {certificateData.schedule ? (
                    <button
                      onClick={() => handleScheduleCertificate()}
                      disabled={loading || certificateData.recipients.length === 0}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Calendar className="h-4 w-4 mr-2 inline" />
                      {loading ? 'Scheduling...' : 'Schedule Publication'}
                    </button>
                  ) : (
                    <button
                      onClick={handlePublishCertificate}
                      disabled={loading || certificateData.recipients.length === 0}
                      className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-light disabled:opacity-50"
                    >
                      <Send className="h-4 w-4 mr-2 inline" />
                      {loading ? 'Publishing...' : 'Publish Now'}
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
          title="CSV Format for Certificate Recipients"
        >
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <h4 className="font-medium text-gray-900 mb-2">Required CSV columns:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>name</strong> - Recipient's full name</li>
                <li><strong>email</strong> - Recipient's email address</li>
                <li><strong>course_name</strong> - Course or event name</li>
                <li><strong>date</strong> - Completion date (optional)</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h5 className="font-medium text-gray-900 mb-2">Example CSV format:</h5>
              <code className="text-xs text-gray-700">
                name,email,course_name,date<br />
                John Doe,john@example.com,Web Development,2024-03-15<br />
                Jane Smith,jane@example.com,Data Science,2024-03-16
              </code>
            </div>
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> You can export participant data from your events and use it directly for certificate generation.
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default CreateCertificate