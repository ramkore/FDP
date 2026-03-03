import { Plus, Users, Calendar, TrendingUp, Eye } from 'lucide-react'

const Dashboard = () => {
  const stats = [
    { name: 'Total Events', value: '12', icon: Calendar, change: '+4.75%', changeType: 'positive' },
    { name: 'Total Attendees', value: '2,847', icon: Users, change: '+12.02%', changeType: 'positive' },
    { name: 'Page Views', value: '8,429', icon: Eye, change: '+2.05%', changeType: 'positive' },
    { name: 'Revenue', value: '$24,780', icon: TrendingUp, change: '+8.12%', changeType: 'positive' },
  ]

  const quickActions = [
    { name: 'Create Event', icon: Calendar, color: 'bg-blue-500' },
    { name: 'New Campaign', icon: Plus, color: 'bg-green-500' },
    { name: 'Generate Certificate', icon: Plus, color: 'bg-purple-500' },
    { name: 'View Site', icon: Eye, color: 'bg-orange-500' },
  ]

  const recentEvents = [
    { name: 'Annual Conference 2024', attendees: 234, status: 'Active', date: '2024-03-15' },
    { name: 'Digital Marketing Workshop', attendees: 28, status: 'Active', date: '2024-03-22' },
    { name: 'Tech Summit', attendees: 156, status: 'Completed', date: '2024-03-10' },
  ]

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Stats */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Icon className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
                            <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                              {item.change}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.name}
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div>
                    <span className={`rounded-lg inline-flex p-3 ${action.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-900">{action.name}</h3>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Recent Events */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Events</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {recentEvents.map((event, index) => (
                <li key={index}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{event.name}</p>
                          <p className="text-sm text-gray-500">{event.attendees} attendees • {event.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          event.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard