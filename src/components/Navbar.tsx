import { useState } from 'react'
import { DUMMY_USER } from '../lib/constants'

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const user = DUMMY_USER

  const solutions = [
    { name: 'Analytics', desc: 'Track your performance' },
    { name: 'Automation', desc: 'Streamline workflows' },
    { name: 'Integration', desc: 'Connect your tools' },
    { name: 'Security', desc: 'Protect your data' }
  ]

  const products = [
    { name: 'Platform', desc: 'Core functionality' },
    { name: 'API', desc: 'Developer tools' },
    { name: 'Mobile', desc: 'On-the-go access' },
    { name: 'Enterprise', desc: 'Scale your business' }
  ]

  const resources = [
    { name: 'About', desc: 'Learn about us' },
    { name: 'Changelog', desc: 'Latest updates' },
    { name: 'Blog', desc: 'Insights and tips' }
  ]

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold text-primary">Ezent</div>

            <div className="hidden md:flex items-center space-x-1">
              {[
                { name: 'Solutions', items: solutions },
                { name: 'Products', items: products },
                { name: 'Resources', items: resources }
              ].map((menu) => (
                <div
                  key={menu.name}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(menu.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 flex items-center">
                    {menu.name}
                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {activeDropdown === menu.name && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {menu.items.map((item) => (
                        <a
                          key={item.name}
                          href="#"
                          className="block px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <div className="font-medium text-primary text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <a href="/events" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200">
                Events
              </a>
              <a href="#" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200">
                Pricing
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-3">
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar