import { useLocation, useNavigate } from 'react-router-dom'
import { Check, Globe, ExternalLink } from 'lucide-react'

const SubdomainSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { subdomain, organizationName } = location.state || {}

  if (!subdomain) {
    navigate('/choose-subdomain')
    return null
  }

  const subdomainUrl = `https://${subdomain}.ezent.me`

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Subdomain Registered!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your organization subdomain has been successfully set up
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <Globe className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-gray-900">Your Subdomain</p>
              <p className="text-lg font-semibold text-primary">{subdomain}.ezent.me</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-4">
              Your organization <strong>{organizationName}</strong> is now accessible at:
            </p>
            <div className="bg-gray-50 p-3 rounded-md">
              <a 
                href={subdomainUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-light flex items-center space-x-2"
              >
                <span>{subdomainUrl}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.open(subdomainUrl, '_blank')}
            className="w-full flex justify-center items-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Globe className="h-4 w-4" />
            <span>Visit Your Subdomain</span>
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubdomainSuccess