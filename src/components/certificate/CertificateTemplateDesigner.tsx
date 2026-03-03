import { useState } from 'react'
import { GripVertical, Trash2, Plus, Type, Image, Award, Calendar, User, BookOpen, Palette, Settings, Layers, Paintbrush, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'

const CertificateTemplateDesigner = ({ template, onChange }) => {
  const [components, setComponents] = useState(template.components || [])
  const [selectedId, setSelectedId] = useState(null)
  const [draggedId, setDraggedId] = useState(null)
  const [certificateStyle, setCertificateStyle] = useState(template.certificateStyle || {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: '2px',
    borderRadius: '12px',
    padding: '48px',
    width: '800px',
    height: '600px',
    fontFamily: 'Georgia, serif'
  })

  const componentTypes = [
    { type: 'title', label: 'Title', icon: Type, defaultContent: 'Certificate Title', style: { fontSize: '32px', color: '#1a365d', fontWeight: 'bold', textAlign: 'center' } },
    { type: 'subtitle', label: 'Subtitle', icon: Type, defaultContent: 'Subtitle text', style: { fontSize: '18px', color: '#4a5568', textAlign: 'center' } },
    { type: 'text', label: 'Text', icon: Type, defaultContent: 'Your text here...', style: { fontSize: '16px', color: '#2d3748', textAlign: 'center' } },
    { type: 'name', label: 'Name Field', icon: User, defaultContent: '{{name}}', style: { fontSize: '28px', color: '#2d3748', fontWeight: 'bold', textAlign: 'center' } },
    { type: 'course', label: 'Course Field', icon: BookOpen, defaultContent: '{{course_name}}', style: { fontSize: '20px', color: '#2d3748', fontWeight: 'semibold', textAlign: 'center' } },
    { type: 'date', label: 'Date Field', icon: Calendar, defaultContent: '{{date}}', style: { fontSize: '14px', color: '#718096', textAlign: 'center' } },
    { type: 'image', label: 'Image', icon: Image, defaultContent: 'https://via.placeholder.com/200x100', style: { width: '200px', height: '100px' } },
    { type: 'logo', label: 'Logo', icon: Award, defaultContent: 'https://via.placeholder.com/80x80', style: { width: '80px', height: '80px' } }
  ]

  const updateComponents = (newComponents) => {
    setComponents(newComponents)
    onChange({
      components: newComponents,
      certificateStyle
    })
  }

  const updateCertificateStyle = (newStyle) => {
    setCertificateStyle(newStyle)
    onChange({
      components,
      certificateStyle: newStyle
    })
  }

  const formatText = (componentId, format) => {
    const component = components.find(c => c.id === componentId)
    if (!component) return
    
    let newStyle = { ...component.style }
    
    switch (format) {
      case 'bold':
        newStyle.fontWeight = newStyle.fontWeight === 'bold' ? 'normal' : 'bold'
        break
      case 'italic':
        newStyle.fontStyle = newStyle.fontStyle === 'italic' ? 'normal' : 'italic'
        break
      case 'underline':
        newStyle.textDecoration = newStyle.textDecoration === 'underline' ? 'none' : 'underline'
        break
    }
    
    updateComponent(componentId, { style: newStyle })
  }

  const alignText = (componentId, alignment) => {
    updateComponent(componentId, { 
      style: { 
        ...components.find(c => c.id === componentId)?.style, 
        textAlign: alignment 
      } 
    })
  }

  const addComponent = (componentType) => {
    const newComponent = {
      id: Date.now().toString(),
      type: componentType.type,
      content: componentType.defaultContent,
      style: { ...componentType.style }
    }
    updateComponents([...components, newComponent])
  }

  const updateComponent = (id, updates) => {
    updateComponents(components.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    ))
  }

  const deleteComponent = (id) => {
    updateComponents(components.filter(comp => comp.id !== id))
    setSelectedId(null)
  }

  const handleDragStart = (e, id) => {
    setDraggedId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetId) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) return

    const draggedIndex = components.findIndex(c => c.id === draggedId)
    const targetIndex = components.findIndex(c => c.id === targetId)
    
    const newComponents = [...components]
    const [draggedComponent] = newComponents.splice(draggedIndex, 1)
    newComponents.splice(targetIndex, 0, draggedComponent)
    
    updateComponents(newComponents)
    setDraggedId(null)
  }

  const renderComponentEditor = () => {
    const selected = components.find(c => c.id === selectedId)
    if (!selected && selectedId !== 'certificate') return (
      <div className="text-center py-12">
        <Layers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Select a component to edit</p>
        <p className="text-sm text-gray-400 mt-2">Click on any component or certificate settings to customize</p>
      </div>
    )

    if (selectedId === 'certificate') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Paintbrush className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Certificate Settings</h3>
                <p className="text-sm text-gray-600">Customize overall certificate appearance</p>
              </div>
            </div>
          </div>

          {/* Background & Border */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Palette className="h-4 w-4 text-gray-500 mr-2" />
              <h4 className="font-medium text-gray-900">Background & Border</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={certificateStyle.backgroundColor}
                    onChange={(e) => updateCertificateStyle({ ...certificateStyle, backgroundColor: e.target.value })}
                    className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={certificateStyle.backgroundColor}
                    onChange={(e) => updateCertificateStyle({ ...certificateStyle, backgroundColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Border Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={certificateStyle.borderColor}
                    onChange={(e) => updateCertificateStyle({ ...certificateStyle, borderColor: e.target.value })}
                    className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={certificateStyle.borderColor}
                    onChange={(e) => updateCertificateStyle({ ...certificateStyle, borderColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Layout & Spacing */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Settings className="h-4 w-4 text-gray-500 mr-2" />
              <h4 className="font-medium text-gray-900">Layout & Spacing</h4>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Border Width</label>
                <select
                  value={certificateStyle.borderWidth}
                  onChange={(e) => updateCertificateStyle({ ...certificateStyle, borderWidth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="0px">None</option>
                  <option value="1px">1px - Thin</option>
                  <option value="2px">2px - Medium</option>
                  <option value="3px">3px - Thick</option>
                  <option value="4px">4px - Bold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
                <select
                  value={certificateStyle.borderRadius}
                  onChange={(e) => updateCertificateStyle({ ...certificateStyle, borderRadius: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="0px">Square</option>
                  <option value="4px">Slightly Rounded</option>
                  <option value="8px">Rounded</option>
                  <option value="12px">More Rounded</option>
                  <option value="16px">Very Rounded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Padding</label>
                <select
                  value={certificateStyle.padding}
                  onChange={(e) => updateCertificateStyle({ ...certificateStyle, padding: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="24px">Tight</option>
                  <option value="32px">Small</option>
                  <option value="48px">Medium</option>
                  <option value="64px">Large</option>
                  <option value="80px">X-Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dimensions & Typography */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Type className="h-4 w-4 text-gray-500 mr-2" />
              <h4 className="font-medium text-gray-900">Dimensions & Typography</h4>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                <select
                  value={certificateStyle.width}
                  onChange={(e) => updateCertificateStyle({ ...certificateStyle, width: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="600px">600px - Small</option>
                  <option value="700px">700px - Medium</option>
                  <option value="800px">800px - Large</option>
                  <option value="900px">900px - X-Large</option>
                  <option value="1000px">1000px - XX-Large</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                <select
                  value={certificateStyle.height}
                  onChange={(e) => updateCertificateStyle({ ...certificateStyle, height: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="400px">400px - Small</option>
                  <option value="500px">500px - Medium</option>
                  <option value="600px">600px - Large</option>
                  <option value="700px">700px - X-Large</option>
                  <option value="800px">800px - XX-Large</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                <select
                  value={certificateStyle.fontFamily}
                  onChange={(e) => updateCertificateStyle({ ...certificateStyle, fontFamily: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Times New Roman, serif">Times New Roman</option>
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Helvetica, sans-serif">Helvetica</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-blue-50 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-primary/20 rounded-lg mr-3">
              {selected.type === 'title' && <Type className="h-5 w-5 text-primary" />}
              {selected.type === 'subtitle' && <Type className="h-5 w-5 text-primary" />}
              {selected.type === 'text' && <Type className="h-5 w-5 text-primary" />}
              {selected.type === 'name' && <User className="h-5 w-5 text-primary" />}
              {selected.type === 'course' && <BookOpen className="h-5 w-5 text-primary" />}
              {selected.type === 'date' && <Calendar className="h-5 w-5 text-primary" />}
              {selected.type === 'image' && <Image className="h-5 w-5 text-primary" />}
              {selected.type === 'logo' && <Award className="h-5 w-5 text-primary" />}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 capitalize">{selected.type} Component</h3>
              <p className="text-sm text-gray-600">Customize your {selected.type} settings</p>
            </div>
          </div>
          <button
            onClick={() => deleteComponent(selected.id)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Content Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Type className="h-4 w-4 text-gray-500 mr-2" />
            <h4 className="font-medium text-gray-900">Content</h4>
          </div>
          
          {(selected.type === 'image' || selected.type === 'logo') ? (
            <div className="space-y-3">
              <input
                type="url"
                value={selected.content}
                onChange={(e) => updateComponent(selected.id, { content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter image URL"
              />
              {selected.content && (
                <div className="mt-2">
                  <img src={selected.content} alt="Preview" className="max-w-full h-20 object-cover rounded border" />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {(selected.type === 'text' || selected.type === 'title' || selected.type === 'subtitle') && (
                <div className="flex items-center space-x-1 p-2 bg-gray-50 rounded-lg border">
                  <button
                    onClick={() => formatText(selected.id, 'bold')}
                    className={`p-2 rounded transition-colors ${
                      selected.style?.fontWeight === 'bold' ? 'bg-primary text-white' : 'hover:bg-gray-200'
                    }`}
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => formatText(selected.id, 'italic')}
                    className={`p-2 rounded transition-colors ${
                      selected.style?.fontStyle === 'italic' ? 'bg-primary text-white' : 'hover:bg-gray-200'
                    }`}
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => formatText(selected.id, 'underline')}
                    className={`p-2 rounded transition-colors ${
                      selected.style?.textDecoration === 'underline' ? 'bg-primary text-white' : 'hover:bg-gray-200'
                    }`}
                  >
                    <Underline className="h-4 w-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-2"></div>
                  <button
                    onClick={() => alignText(selected.id, 'left')}
                    className={`p-2 rounded transition-colors ${
                      selected.style?.textAlign === 'left' ? 'bg-primary text-white' : 'hover:bg-gray-200'
                    }`}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => alignText(selected.id, 'center')}
                    className={`p-2 rounded transition-colors ${
                      selected.style?.textAlign === 'center' ? 'bg-primary text-white' : 'hover:bg-gray-200'
                    }`}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => alignText(selected.id, 'right')}
                    className={`p-2 rounded transition-colors ${
                      selected.style?.textAlign === 'right' ? 'bg-primary text-white' : 'hover:bg-gray-200'
                    }`}
                  >
                    <AlignRight className="h-4 w-4" />
                  </button>
                </div>
              )}
              <textarea
                value={selected.content}
                onChange={(e) => updateComponent(selected.id, { content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={selected.type === 'text' ? 4 : 2}
                placeholder={`Enter your ${selected.type} content here...`}
              />
            </div>
          )}
        </div>

        {/* Typography Section */}
        {!['image', 'logo'].includes(selected.type) && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Type className="h-4 w-4 text-gray-500 mr-2" />
              <h4 className="font-medium text-gray-900">Typography</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                <select
                  value={selected.style.fontSize || '16px'}
                  onChange={(e) => updateComponent(selected.id, { style: { ...selected.style, fontSize: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="12px">12px - Small</option>
                  <option value="14px">14px - Regular</option>
                  <option value="16px">16px - Medium</option>
                  <option value="18px">18px - Large</option>
                  <option value="20px">20px - X-Large</option>
                  <option value="24px">24px - Heading</option>
                  <option value="28px">28px - Big Heading</option>
                  <option value="32px">32px - Hero</option>
                  <option value="36px">36px - Title</option>
                  <option value="48px">48px - Display</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={selected.style.color || '#000000'}
                    onChange={(e) => updateComponent(selected.id, { style: { ...selected.style, color: e.target.value } })}
                    className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selected.style.color || '#000000'}
                    onChange={(e) => updateComponent(selected.id, { style: { ...selected.style, color: e.target.value } })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image/Logo Sizing */}
        {['image', 'logo'].includes(selected.type) && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Image className="h-4 w-4 text-gray-500 mr-2" />
              <h4 className="font-medium text-gray-900">Image Settings</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                <select
                  value={selected.style.width || '200px'}
                  onChange={(e) => updateComponent(selected.id, { style: { ...selected.style, width: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="50px">50px - Tiny</option>
                  <option value="80px">80px - Small</option>
                  <option value="100px">100px - Medium</option>
                  <option value="150px">150px - Large</option>
                  <option value="200px">200px - X-Large</option>
                  <option value="300px">300px - XX-Large</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                <select
                  value={selected.style.height || '100px'}
                  onChange={(e) => updateComponent(selected.id, { style: { ...selected.style, height: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="auto">Auto</option>
                  <option value="50px">50px - Tiny</option>
                  <option value="80px">80px - Small</option>
                  <option value="100px">100px - Medium</option>
                  <option value="150px">150px - Large</option>
                  <option value="200px">200px - X-Large</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Spacing */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Settings className="h-4 w-4 text-gray-500 mr-2" />
            <h4 className="font-medium text-gray-900">Spacing</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Margin Top</label>
              <select
                value={selected.style.marginTop || '0px'}
                onChange={(e) => updateComponent(selected.id, { style: { ...selected.style, marginTop: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="0px">None</option>
                <option value="8px">8px - Small</option>
                <option value="16px">16px - Medium</option>
                <option value="24px">24px - Large</option>
                <option value="32px">32px - X-Large</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Margin Bottom</label>
              <select
                value={selected.style.marginBottom || '16px'}
                onChange={(e) => updateComponent(selected.id, { style: { ...selected.style, marginBottom: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="0px">None</option>
                <option value="8px">8px - Small</option>
                <option value="16px">16px - Medium</option>
                <option value="24px">24px - Large</option>
                <option value="32px">32px - X-Large</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderPreview = () => (
    <div className="flex justify-center">
      <div 
        className="border shadow-lg" 
        style={{
          backgroundColor: certificateStyle.backgroundColor,
          borderColor: certificateStyle.borderColor,
          borderWidth: certificateStyle.borderWidth,
          borderRadius: certificateStyle.borderRadius,
          padding: certificateStyle.padding,
          width: certificateStyle.width,
          height: certificateStyle.height,
          fontFamily: certificateStyle.fontFamily,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        {components.map((component, index) => {
          if (['title', 'subtitle', 'text', 'name', 'course', 'date'].includes(component.type)) {
            return (
              <div
                key={component.id}
                style={{
                  ...component.style,
                  marginTop: component.style.marginTop || '0px',
                  marginBottom: component.style.marginBottom || '16px',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {component.content.replace(/\{\{(\w+)\}\}/g, '[$1]')}
              </div>
            )
          }
          if (['image', 'logo'].includes(component.type)) {
            return (
              <img
                key={component.id}
                src={component.content}
                alt={component.type}
                style={{ 
                  ...component.style,
                  marginTop: component.style.marginTop || '0px',
                  marginBottom: component.style.marginBottom || '16px',
                  objectFit: 'contain'
                }}
              />
            )
          }
          return null
        })}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 p-6">
        {/* Components Library */}
        <div className="xl:col-span-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-primary/10 rounded-lg mr-3">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Add Components</h3>
              <p className="text-sm text-gray-500">Drag & drop to build</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {componentTypes.map((comp) => {
              const Icon = comp.icon
              return (
                <button
                  key={comp.type}
                  onClick={() => addComponent(comp)}
                  className="w-full flex items-center p-4 text-left border border-gray-200 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-blue-50 hover:border-primary/30 transition-all duration-200 group"
                >
                  <div className="p-2 bg-gray-100 group-hover:bg-primary/20 rounded-lg mr-3 transition-colors">
                    <Icon className="h-4 w-4 text-gray-500 group-hover:text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{comp.label}</div>
                    <div className="text-xs text-gray-500 capitalize">Add {comp.type} element</div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center mb-3">
              <div className="p-1 bg-blue-100 rounded mr-2">
                <Type className="h-3 w-3 text-blue-600" />
              </div>
              <h4 className="text-sm font-semibold text-blue-900">Dynamic Variables</h4>
            </div>
            <div className="text-xs text-blue-800 space-y-2">
              <div className="flex items-center">
                <code className="bg-blue-100 px-2 py-1 rounded text-xs mr-2">{'{{name}}'}</code>
                <span>Recipient's name</span>
              </div>
              <div className="flex items-center">
                <code className="bg-blue-100 px-2 py-1 rounded text-xs mr-2">{'{{course_name}}'}</code>
                <span>Course name</span>
              </div>
              <div className="flex items-center">
                <code className="bg-blue-100 px-2 py-1 rounded text-xs mr-2">{'{{date}}'}</code>
                <span>Completion date</span>
              </div>
            </div>
          </div>
        </div>

        {/* Template Builder */}
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-primary/10 rounded-lg mr-3">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Certificate Structure</h3>
              <p className="text-sm text-gray-500">Drag to reorder components</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-8">
            {/* Certificate Settings Button */}
            <div
              onClick={() => setSelectedId('certificate')}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 group ${
                selectedId === 'certificate'
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className={`p-2 rounded-lg mr-3 ${
                selectedId === 'certificate' ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'
              }`}>
                <Paintbrush className={`h-4 w-4 ${
                  selectedId === 'certificate' ? 'text-blue-600' : 'text-gray-500'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm">Certificate Settings</div>
                <div className="text-xs text-gray-500 truncate">
                  Background, borders, fonts & layout
                </div>
              </div>
            </div>

            {components.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <Layers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No components yet</p>
                <p className="text-sm text-gray-400 mt-1">Add components from the left panel to start building</p>
              </div>
            ) : (
              components.map((component, index) => {
                const Icon = componentTypes.find(c => c.type === component.type)?.icon || Type
                return (
                  <div
                    key={component.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, component.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, component.id)}
                    onClick={() => setSelectedId(component.id)}
                    className={`flex items-center p-4 border rounded-lg cursor-move transition-all duration-200 group ${
                      selectedId === component.id 
                        ? 'border-primary bg-gradient-to-r from-primary/10 to-blue-50 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <GripVertical className="h-4 w-4 text-gray-400 group-hover:text-gray-600 mr-3" />
                    <div className={`p-2 rounded-lg mr-3 ${
                      selectedId === component.id ? 'bg-primary/20' : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        selectedId === component.id ? 'text-primary' : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 capitalize text-sm">{component.type}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {component.content ? component.content.substring(0, 40) + '...' : 'Empty component'}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 ml-2">#{index + 1}</div>
                  </div>
                )
              })
            )}
          </div>

          {renderComponentEditor()}
        </div>

        {/* Live Preview */}
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg mr-3">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Certificate Preview</h3>
                <p className="text-sm text-gray-500">See how your certificate will look</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {components.length} components
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-dashed border-gray-200 overflow-auto max-h-[800px]">
            {components.length === 0 ? (
              <div className="text-center py-16">
                <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium text-lg">Preview will appear here</p>
                <p className="text-sm text-gray-400 mt-2">Add components to see your certificate design</p>
              </div>
            ) : (
              renderPreview()
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CertificateTemplateDesigner