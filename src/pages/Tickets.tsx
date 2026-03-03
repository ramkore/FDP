import { useState } from 'react'
import { Plus, Ticket, QrCode, Download, Mail, Filter } from 'lucide-react'

const Tickets = () => {
  const [tickets] = useState([
    {
      id: 'TKT-001',
      event: 'Annual Conference 2024',
      attendee: 'John Doe',
      email: 'john@example.com',
      type: 'VIP',
      price: '$299',
      status: 'Confirmed',
      issued: '2024-03-01',
      checkedIn: false
    },
    {
      id: 'TKT-002',
      event: 'Digital Marketing Workshop',
      attendee: 'Jane Smith',
      email: 'jane@example.com',
      type: 'Regular',
      price: '$99',
      status: 'Confirmed',
      issued: '2024-03-02',
      checkedIn: true
    },
    {
      id: 'TKT-003',
      event: 'Tech Summit',
      attendee: 'Mike Johnson',
      email: 'mike@example.com',
      type: 'Student',
      price: '$49',
      status: 'Pending',
      issued: '2024-03-03',
      checkedIn: false
    }
  ])

  const [filter, setFilter] = useState('All')
  const filters = ['All', 'Confirmed', 'Pending', 'Cancelled']

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'VIP':
        return 'bg-purple-100 text-purple-800'
      case 'Regular':
        return 'bg-blue-100 text-blue-800'
      case 'Student':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Tickets</h1>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-light">
            <Plus className="h-4 w-4 mr-2" />
            Generate Ticket
          </button>
        </div>

        {/* Filters */}
        <div className="mt-6 flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex space-x-2">
            {filters.map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  filter === filterOption
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets List */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <li key={ticket.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Ticket className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">{ticket.id}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(ticket.type)}`}>
                            {ticket.type}
                          </span>
                          {ticket.checkedIn && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Checked In
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-900">{ticket.attendee}</p>
                        <p className="text-sm text-gray-500">{ticket.event} • {ticket.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{ticket.price}</p>
                        <p className="text-sm text-gray-500">Issued {new Date(ticket.issued).toLocaleDateString()}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <QrCode className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Mail className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Ticket Stats */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Ticket className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Tickets</dt>
                    <dd className="text-2xl font-semibold text-gray-900">847</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <QrCode className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Checked In</dt>
                    <dd className="text-2xl font-semibold text-gray-900">623</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Download className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Downloaded</dt>
                    <dd className="text-2xl font-semibold text-gray-900">756</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Mail className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Sent</dt>
                    <dd className="text-2xl font-semibold text-gray-900">834</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tickets