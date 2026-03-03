import { useState } from 'react'
import { Download, Filter } from 'lucide-react'
import { supabase } from '../lib/supabase'

const CSVDownloadSection = ({ eventId }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all',
    dateRange: 'all',
    includeFields: {
      name: true,
      email: true,
      team: true,
      registrationDate: true,
      status: true,
      paymentStatus: true,
      formData: false
    }
  })

  const handleDownload = async () => {
    setDownloading(true)
    try {
      let query = supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId)
        .order('registration_date', { ascending: false })

      // Apply filters
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }
      if (filters.paymentStatus !== 'all') {
        query = query.eq('payment_status', filters.paymentStatus)
      }
      if (filters.dateRange !== 'all') {
        const days = parseInt(filters.dateRange)
        const dateFrom = new Date()
        dateFrom.setDate(dateFrom.getDate() - days)
        query = query.gte('registration_date', dateFrom.toISOString())
      }

      const { data, error } = await query
      if (error) throw error

      // Generate CSV
      const csvData = generateCSV(data, filters.includeFields)
      downloadCSV(csvData, `event-registrations-${eventId}.csv`)
    } catch (error) {
      console.error('Error downloading CSV:', error)
    } finally {
      setDownloading(false)
    }
  }

  const generateCSV = (data, includeFields) => {
    if (!data || data.length === 0) return 'No data available'

    const headers = []
    if (includeFields.name) headers.push('Name')
    if (includeFields.email) headers.push('Email')
    if (includeFields.team) headers.push('Team Name')
    if (includeFields.registrationDate) headers.push('Registration Date')
    if (includeFields.status) headers.push('Status')
    if (includeFields.paymentStatus) headers.push('Payment Status')
    if (includeFields.formData) headers.push('Form Data')

    const rows = data.map(row => {
      const csvRow = []
      if (includeFields.name) csvRow.push(`"${row.user_name || ''}"`)
      if (includeFields.email) csvRow.push(`"${row.user_email || ''}"`)
      if (includeFields.team) csvRow.push(`"${row.team_name || ''}"`)
      if (includeFields.registrationDate) csvRow.push(`"${new Date(row.registration_date).toLocaleString()}"`)
      if (includeFields.status) csvRow.push(`"${row.status || ''}"`)
      if (includeFields.paymentStatus) csvRow.push(`"${row.payment_status || ''}"`)
      if (includeFields.formData) csvRow.push(`"${JSON.stringify(row.form_data || {})}"`)
      return csvRow.join(',')
    })

    return [headers.join(','), ...rows].join('\n')
  }

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFieldToggle = (field) => {
    setFilters(prev => ({
      ...prev,
      includeFields: {
        ...prev.includeFields,
        [field]: !prev.includeFields[field]
      }
    }))
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Download className="h-5 w-5 text-gray-600 mr-2" />
          <span className="font-medium text-gray-900">Download Registration Data</span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-sm text-primary hover:text-primary-light"
        >
          <Filter className="h-4 w-4 mr-1" />
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 mb-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Registration Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="registered">Registered</option>
              <option value="cancelled">Cancelled</option>
              <option value="attended">Attended</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
            <select
              value={filters.paymentStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Payment Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Time</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>

          {/* Fields to Include */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fields to Include</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(filters.includeFields).map(([field, checked]) => (
                <label key={field} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleFieldToggle(field)}
                    className="mr-2 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {field === 'formData' ? 'Form Data' : field.replace(/([A-Z])/g, ' $1')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 text-sm font-medium"
        >
          <Download className="h-4 w-4 mr-2" />
          {downloading ? 'Downloading...' : 'Download CSV'}
        </button>
        
        <button
          onClick={() => handleDownload()}
          disabled={downloading}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
        >
          Quick Download
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        CSV file will include filtered registration data based on your selected criteria.
      </p>
    </div>
  )
}

export default CSVDownloadSection