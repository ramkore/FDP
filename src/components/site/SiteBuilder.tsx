import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Eye, Monitor, Tablet, Smartphone, Plus, Undo, Redo } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { DUMMY_USER } from '../../lib/constants'
import { EditorProvider, EditableComponent } from './editor/EditorCore'
import PropertyEditor from './editor/PropertyEditor'
import ComponentLibrary from './editor/ComponentLibrary'
import { componentMap } from './components/FlexibleComponents'
import { EditableWrapper } from './editor/EditableWrapper'

const SiteBuilder = () => {
  const navigate = useNavigate()
  const user = DUMMY_USER
  const [siteData, setSiteData] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')
  const [previewDevice, setPreviewDevice] = useState('desktop')
  const [selectedComponent, setSelectedComponent] = useState<EditableComponent | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState({ show: false, type: '', title: '', message: '' })
  const [showPageManager, setShowPageManager] = useState(false)

  useEffect(() => {
    if (user) {
      fetchSiteData()
    }
  }, [user])

  const fetchSiteData = async () => {
    try {
      // Get organization subdomain first
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('subdomain')
        .eq('id', user.id)
        .single()

      if (orgError) throw orgError

      // Get site data
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('organization_id', user.id)
        .single()

      if (error) throw error
      const siteWithDefaults = {
        ...data,
        subdomain: orgData.subdomain,
        pages: data.pages || [
          {
            id: 'home',
            name: 'Home',
            components: []
          }
        ]
      }
      setSiteData(siteWithDefaults)
      addToHistory(siteWithDefaults)
    } catch (error) {
      console.error('Error fetching site data:', error)
      setNotification({
        show: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to load site data'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSite = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('sites')
        .update({
          pages: siteData.pages,
          updated_at: new Date().toISOString()
        })
        .eq('id', siteData.id)

      if (error) throw error

      setNotification({
        show: true,
        type: 'success',
        title: 'Site Saved',
        message: 'Your changes have been saved successfully'
      })
    } catch (error) {
      console.error('Error saving site:', error)
      setNotification({
        show: true,
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save changes'
      })
    } finally {
      setSaving(false)
    }
  }

  const addToHistory = (newSiteData: any) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(JSON.parse(JSON.stringify(newSiteData)))
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setSiteData(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setSiteData(history[historyIndex + 1])
    }
  }

  const addComponent = (componentType: string) => {
    const newComponent: EditableComponent = {
      id: Date.now().toString(),
      type: componentType,
      content: getDefaultContent(componentType),
      style: getDefaultStyle(componentType),
      layout: {},
      responsive: {
        desktop: {},
        tablet: {},
        mobile: {}
      }
    }

    const newSiteData = { ...siteData }
    const currentPageData = newSiteData.pages.find((p: any) => p.id === currentPage)

    if (currentPageData) {
      currentPageData.components.push(newComponent)
      setSiteData(newSiteData)
      addToHistory(newSiteData)
    }
  }

  const getDefaultContent = (type: string) => {
    const defaults: Record<string, any> = {
      text: { content: 'Your text content goes here...' },
      heading: { text: 'Your Heading', level: 'h2' },
      image: { src: 'https://via.placeholder.com/600x400', alt: 'Image', caption: '' },
      button: { text: 'Click Me', link: '#', variant: 'primary' },
      hero: {
        title: 'Welcome to Our Site',
        subtitle: 'Create amazing experiences',
        buttonText: 'Get Started',
        buttonLink: '#'
      }
    }
    return defaults[type] || {}
  }

  const getDefaultStyle = (type: string) => {
    const defaults: Record<string, any> = {
      text: { fontSize: '16px', color: '#374151', padding: '20px' },
      heading: { fontSize: '32px', color: '#1f2937', fontWeight: 'bold', marginBottom: '20px' },
      image: { width: '100%', borderRadius: '8px' },
      button: { display: 'inline-block' },
      hero: {
        backgroundColor: '#1e40af',
        color: '#ffffff',
        padding: '80px 20px',
        textAlign: 'center'
      }
    }
    return defaults[type] || {}
  }

  const updateComponent = (componentId: string, updates: Partial<EditableComponent>) => {
    const newSiteData = { ...siteData }
    const currentPageData = newSiteData.pages.find((p: any) => p.id === currentPage)

    if (currentPageData) {
      const componentIndex = currentPageData.components.findIndex((c: any) => c.id === componentId)
      if (componentIndex !== -1) {
        currentPageData.components[componentIndex] = {
          ...currentPageData.components[componentIndex],
          ...updates
        }
        setSiteData(newSiteData)
        addToHistory(newSiteData)
      }
    }
  }

  const deleteComponent = (componentId: string) => {
    const newSiteData = { ...siteData }
    const currentPageData = newSiteData.pages.find((p: any) => p.id === currentPage)

    if (currentPageData) {
      currentPageData.components = currentPageData.components.filter((c: any) => c.id !== componentId)
      setSiteData(newSiteData)
      addToHistory(newSiteData)
    }
  }

  const duplicateComponent = (componentId: string) => {
    const newSiteData = { ...siteData }
    const currentPageData = newSiteData.pages.find((p: any) => p.id === currentPage)

    if (currentPageData) {
      const component = currentPageData.components.find((c: any) => c.id === componentId)
      if (component) {
        const duplicatedComponent = {
          ...JSON.parse(JSON.stringify(component)),
          id: Date.now().toString()
        }
        const componentIndex = currentPageData.components.findIndex((c: any) => c.id === componentId)
        currentPageData.components.splice(componentIndex + 1, 0, duplicatedComponent)
        setSiteData(newSiteData)
        addToHistory(newSiteData)
      }
    }
  }

  const moveComponent = (componentId: string, direction: 'up' | 'down') => {
    const newSiteData = { ...siteData }
    const currentPageData = newSiteData.pages.find((p: any) => p.id === currentPage)

    if (currentPageData) {
      const componentIndex = currentPageData.components.findIndex((c: any) => c.id === componentId)
      if (componentIndex !== -1) {
        const newIndex = direction === 'up' ? componentIndex - 1 : componentIndex + 1
        if (newIndex >= 0 && newIndex < currentPageData.components.length) {
          const [component] = currentPageData.components.splice(componentIndex, 1)
          currentPageData.components.splice(newIndex, 0, component)
          setSiteData(newSiteData)
          addToHistory(newSiteData)
        }
      }
    }
  }

  const renderComponent = (component: EditableComponent) => {
    const ComponentToRender = componentMap[component.type as keyof typeof componentMap]
    if (!ComponentToRender) {
      return (
        <EditableWrapper component={component}>
          <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded">
            Unknown component type: {component.type}
          </div>
        </EditableWrapper>
      )
    }
    return <ComponentToRender key={component.id} component={component} />
  }

  const getCurrentPage = () => {
    return siteData?.pages?.find(page => page.id === currentPage)
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading site builder...</p>
        </div>
      </div>
    )
  }

  return (
    <EditorProvider
      onUpdateComponent={updateComponent}
      onDeleteComponent={deleteComponent}
      onDuplicateComponent={duplicateComponent}
      onMoveComponent={moveComponent}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard/site')}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Site
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Flexible Site Builder</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* History Controls */}
              <div className="flex space-x-1">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  title="Undo"
                >
                  <Undo className="h-4 w-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  title="Redo"
                >
                  <Redo className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => window.open(`https://${siteData?.subdomain}.ezent.me`, '_blank')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </button>

              <button
                onClick={handleSaveSite}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-light disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-screen">
          {/* Component Library */}
          <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <ComponentLibrary onAddComponent={addComponent} />
          </div>

          {/* Main Builder Area */}
          <div className="flex-1 flex flex-col">
            {/* Page Tabs */}
            <div className="bg-white border-b border-gray-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  {siteData?.pages?.map(page => (
                    <button
                      key={page.id}
                      onClick={() => setCurrentPage(page.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === page.id
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                      {page.name}
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* Builder Content */}
            <div className="flex-1 flex">
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-6xl mx-auto">
                  {getCurrentPage()?.components?.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="text-gray-400 mb-4">
                        <Plus className="h-16 w-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Start Building Your Page
                      </h3>
                      <p className="text-gray-500">
                        Add components from the library to get started
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getCurrentPage()?.components?.map((component: EditableComponent) =>
                        renderComponent(component)
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Property Editor */}
              <PropertyEditor />
            </div>
          </div>
        </div>


      </div>
    </EditorProvider>
  )
}

export default SiteBuilder