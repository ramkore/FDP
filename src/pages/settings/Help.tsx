import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MessageCircle, Book, Phone } from 'lucide-react'

const Help = () => {
  const supportOptions = [
    {
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      icon: Mail,
      action: 'support@ezent.me',
      type: 'email'
    },
    {
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: MessageCircle,
      action: 'Start Chat',
      type: 'chat'
    },
    {
      title: 'Documentation',
      description: 'Browse our comprehensive help guides',
      icon: Book,
      action: 'View Docs',
      type: 'docs'
    },
    {
      title: 'Phone Support',
      description: 'Call us during business hours',
      icon: Phone,
      action: '+1 (555) 123-4567',
      type: 'phone'
    }
  ]

  const faqs = [
    {
      question: 'How do I create my first event?',
      answer: 'Navigate to the Events section and click "Create Event". Follow the step-by-step wizard to set up your event details, settings, and registration form.'
    },
    {
      question: 'Can I customize my event registration form?',
      answer: 'Yes! Our form builder allows you to add various field types including text, email, dropdowns, checkboxes, and file uploads with custom validation rules.'
    },
    {
      question: 'How do I change my subdomain?',
      answer: 'Subdomains can only be changed by contacting our support team. Please email us with your current and desired subdomain.'
    }
  ]

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center mb-8">
          <Link to="/dashboard/settings" className="mr-4 text-gray-400 hover:text-gray-600">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Help & Support</h1>
        </div>

        {/* Support Options */}
        <div className="mb-12">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Contact Support</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {supportOptions.map((option) => {
              const Icon = option.icon
              return (
                <div key={option.title} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary bg-opacity-10 rounded-lg p-3 mr-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{option.title}</h3>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                  </div>
                  {option.type === 'email' ? (
                    <a
                      href={`mailto:${option.action}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary bg-opacity-10 hover:bg-opacity-20"
                    >
                      {option.action}
                    </a>
                  ) : option.type === 'phone' ? (
                    <a
                      href={`tel:${option.action}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary bg-opacity-10 hover:bg-opacity-20"
                    >
                      {option.action}
                    </a>
                  ) : (
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary bg-opacity-10 hover:bg-opacity-20">
                      {option.action}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="bg-white rounded-lg shadow">
            {faqs.map((faq, index) => (
              <div key={index} className={`p-6 ${index !== faqs.length - 1 ? 'border-b border-gray-200' : ''}`}>
                <h3 className="text-md font-medium text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Help