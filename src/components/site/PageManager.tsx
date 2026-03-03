import { useState } from 'react'
import { X, Plus, Edit, Trash2, Home, FileText, Settings, CheckCircle, AlertCircle } from 'lucide-react'

const PageManager = ({ pages, onUpdate, onClose }) => {
  const [editingPage, setEditingPage] = useState(null)
  const [newPage, setNewPage] = useState({ name: '', path: '', template: 'blank' })
  const [showAddForm, setShowAddForm] = useState(false)

  const pageTemplates = [
    {
      id: 'blank',
      name: 'Blank Page',
      description: 'Start with an empty page',
      components: []
    },
    {
      id: 'about',
      name: 'About Page',
      description: 'Pre-built about page layout',
      components: [
        {
          id: '1',
          type: 'hero',
          content: {
            title: 'About Us',
            subtitle: 'Learn more about our story and mission',
            buttonText: 'Contact Us',
            buttonLink: '/contact'
          },
          style: {
            backgroundColor: '#1e40af',
            textColor: '#ffffff',
            padding: '80px 20px',
            textAlign: 'center'
          }
        },
        {
          id: '2',
          type: 'section',
          content: {
            title: 'Our Story',
            content: 'Tell your story here. Share your mission, values, and what makes you unique.'
          },
          style: {
            backgroundColor: '#ffffff',
            padding: '60px 20px',
            textAlign: 'center'
          }
        }
      ]
    },
    {
      id: 'contact',
      name: 'Contact Page',
      description: 'Contact form and information',
      components: [
        {
          id: '1',
          type: 'heading',
          content: {
            text: 'Contact Us',
            level: 'h1'
          },
          style: {
            fontSize: '48px',
            color: '#1f2937',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px',
            padding: '40px 20px 20px'
          }
        },
        {
          id: '2',
          type: 'contact-form',
          content: {
            title: 'Get In Touch',
            fields: ['name', 'email', 'message'],
            buttonText: 'Send Message'
          },
          style: {
            backgroundColor: '#f9fafb',
            padding: '40px 20px',
            borderRadius: '8px'
          }
        }
      ]
    }
  ]

  const addPage = () => {
    if (!newPage.name || !newPage.path) return

    const template = pageTemplates.find(t => t.id === newPage.template)
    const page = {
      id: Date.now().toString(),
      name: newPage.name,
      path: newPage.path.startsWith('/') ? newPage.path : `/${newPage.path}`,
      components: template ? [...template.components] : []
    }

    onUpdate([...pages, page])
    setNewPage({ name: '', path: '', template: 'blank' })
    setShowAddForm(false)
  }

  const updatePage = (pageId, updates) => {
    const updatedPages = pages.map(page =>
      page.id === pageId ? { ...page, ...updates } : page
    )
    onUpdate(updatedPages)
    setEditingPage(null)
  }

  const deletePage = (pageId) => {
    if (pages.length <= 1) return // Don't delete the last page
    const updatedPages = pages.filter(page => page.id !== pageId)
    onUpdate(updatedPages)
  }

  const getPageIcon = (path) => {
    if (path === '/' || path === '/home') return Home
    if (path.includes('about')) return FileText
    if (path.includes('contact')) return Settings
    return FileText
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Manage Pages</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Add New Page */}
          <div className="mb-6">
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Page
              </button>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Page</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page Name</label>
                    <input
                      type="text"
                      value={newPage.name}
                      onChange={(e) => setNewPage({ ...newPage, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="About Us"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL Path</label>
                    <input
                      type="text"
                      value={newPage.path}
                      onChange={(e) => setNewPage({ ...newPage, path: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="/about"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {pageTemplates.map(template => (
                      <button
                        key={template.id}
                        onClick={() => setNewPage({ ...newPage, template: template.id })}
                        className={`p-3 border rounded-lg text-left transition-colors ${
                          newPage.template === template.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="font-medium text-sm">{template.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{template.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={addPage}
                    disabled={!newPage.name || !newPage.path}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 transition-colors"
                  >
                    Create Page
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false)
                      setNewPage({ name: '', path: '', template: 'blank' })
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Existing Pages */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Existing Pages</h3>
            <div className="space-y-3">
              {pages.map(page => {
                const PageIcon = getPageIcon(page.path)
                return (
                  <div key={page.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 rounded-lg mr-3">
                        <PageIcon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        {editingPage === page.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              defaultValue={page.name}
                              onBlur={(e) => updatePage(page.id, { name: e.target.value })}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <input
                              type="text"
                              defaultValue={page.path}
                              onBlur={(e) => updatePage(page.id, { path: e.target.value })}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="font-medium text-gray-900">{page.name}</div>
                            <div className="text-sm text-gray-500">{page.path}</div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {page.components.length} components
                      </span>
                      <button
                        onClick={() => setEditingPage(editingPage === page.id ? null : page.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {pages.length > 1 && (
                        <button
                          onClick={() => deletePage(page.id)}
                          className="p-1 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default PageManager