import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Calendar } from 'lucide-react'

const Pricing = () => {
  const currentPlan = {
    name: 'Free Plan',
    features: [
      'Unlimited events',
      'Advanced registration forms',
      'Email support',
      'Subdomain hosting',
      'Up to 100 attendees per event'
    ]
  }

  const plans = [
    {
      name: 'Starter',
      price: '$29',
      billing: 'per month',
      description: 'Perfect for small organizations',
      features: [
        'Up to 10 events per month',
        'Advanced form builder',
        'Custom branding',
        'Email & chat support',
        'Up to 500 attendees per event',
        'Basic analytics'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$79',
      billing: 'per month',
      description: 'Best for growing businesses',
      features: [
        'Unlimited events',
        'Advanced form builder',
        'Custom branding & themes',
        'Priority support',
        'Unlimited attendees',
        'Advanced analytics',
        'Certificate generation',
        'Campaign management'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$199',
      billing: 'per month',
      description: 'For large organizations',
      features: [
        'Everything in Professional',
        'White-label solution',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced security features',
        'SLA guarantee'
      ],
      popular: false
    }
  ]

  return (
    <div className="py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center mb-8">
          <Link to="/dashboard/settings" className="mr-4 text-gray-400 hover:text-gray-600">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Pricing Plan</h1>
        </div>

        {/* Current Plan */}
        <div className="mb-12">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Current Plan</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-lg p-3 mr-4">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{currentPlan.name}</h3>
                  <p className="text-sm text-gray-500">
                    {currentPlan.price} {currentPlan.billing}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Next billing date</p>
                  <p className="text-sm text-gray-500">N/A (Free plan)</p>
                </div>
                <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50">
                  Manage Billing
                </button>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Plan Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Available Plans */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-6">Upgrade Your Plan</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-lg shadow ${plan.popular ? 'ring-2 ring-primary' : ''
                  } relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-3 py-1 text-xs font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-sm text-gray-500 ml-1">{plan.billing}</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full mt-8 px-4 py-2 rounded-md text-sm font-medium ${plan.popular
                        ? 'bg-primary text-white hover:bg-primary-light'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {plan.popular ? 'Upgrade Now' : 'Choose Plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Information */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-md font-medium text-gray-900">Billing Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <p className="font-medium text-gray-900 mb-2">Payment Method</p>
              <p>No payment method on file</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-2">Billing Address</p>
              <p>Not provided</p>
            </div>
          </div>
          <button className="mt-4 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50">
            Add Payment Method
          </button>
        </div>
      </div>
    </div>
  )
}

export default Pricing