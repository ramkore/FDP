import { Link } from 'react-router-dom'
import { User, HelpCircle, FileText, CreditCard, ChevronRight } from 'lucide-react'

const Settings = () => {
  const settingsItems = [
    {
      name: 'Profile',
      description: 'Manage your account information and subdomain',
      icon: User,
      href: '/dashboard/settings/profile',
      color: 'bg-blue-500'
    },
    {
      name: 'Help & Support',
      description: 'Get help and contact our support team',
      icon: HelpCircle,
      href: '/dashboard/settings/help',
      color: 'bg-green-500'
    },
    {
      name: 'Terms & Conditions',
      description: 'Review our terms of service and policies',
      icon: FileText,
      href: '/dashboard/settings/terms',
      color: 'bg-purple-500'
    },
    {
      name: 'Pricing Plan',
      description: 'View and manage your subscription plan',
      icon: CreditCard,
      href: '/dashboard/settings/pricing',
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Settings</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {settingsItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`${item.color} rounded-lg p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Settings