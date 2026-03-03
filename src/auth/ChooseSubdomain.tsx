import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Check, X, Globe, AlertTriangle } from 'lucide-react'

const ChooseSubdomain = () => {
  const [subdomain, setSubdomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])
  
  const { organizationName, email } = location.state || {}

  const checkAvailability = async (value: string) => {
    if (value.length < 3) {
      setAvailable(null)
      return
    }

    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/
    if (!subdomainRegex.test(value)) {
      setError('Subdomain can only contain lowercase letters, numbers, and hyphens')
      setAvailable(false)
      return
    }

    setChecking(true)
    setError('')
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('subdomain')
        .eq('subdomain', value)
        .single()

      setAvailable(!data)
    } catch (error) {
      setAvailable(true) // If no record found, it's available
    } finally {
      setChecking(false)
    }
  }

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setSubdomain(value)
    
    if (value !== subdomain) {
      setAvailable(null)
      if (value.length >= 3) {
        const timeoutId = setTimeout(() => checkAvailability(value), 500)
        return () => clearTimeout(timeoutId)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!available || !user) return

    setLoading(true)
    setError('')

    try {
      const { error: updateError } = await supabase
        .from('organizations')
        .update({ subdomain })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Redirect to success page
      navigate('/subdomain-success', { 
        state: { 
          subdomain,
          organizationName 
        }
      })
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!organizationName || !email) {
    navigate('/signup')
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-primary">
            Choose your subdomain
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            This will be your organization's unique URL
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div>
            <div className="flex">
              <input
                type="text"
                required
                value={subdomain}
                onChange={handleSubdomainChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="your-company"
                minLength={3}
              />
              <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600">
                .ezent.me
              </span>
            </div>
            
            <div className="mt-2 flex items-center gap-2 h-6">
              {checking ? (
                <div className="text-sm text-gray-500">Checking availability...</div>
              ) : subdomain && available !== null ? (
                available ? (
                  <div className="flex items-center text-sm text-green-600">
                    <Check className="h-4 w-4 mr-1" />
                    Available
                  </div>
                ) : (
                  <div className="flex items-center text-sm text-red-600">
                    <X className="h-4 w-4 mr-1" />
                    {error || 'Not available'}
                  </div>
                )
              ) : null}
            </div>

            <div className="bg-yellow-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Choose Your Domain Name Carefully. Once you have chosen your domain name, it is difficult to change it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !available || checking || !subdomain}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Continue to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChooseSubdomain