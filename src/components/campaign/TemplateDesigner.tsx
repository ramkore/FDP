import { useState } from 'react'
import { Eye, GripVertical, Trash2, Plus, Type, Image, Link, Square, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Palette, Settings, Layers, Paintbrush } from 'lucide-react'

const TemplateDesigner = ({ type, template, onChange }) => {
  const [components, setComponents] = useState(template.components || [
    { id: '1', type: 'header', content: 'Hello {{name}}!', style: { fontSize: '24px', color: '#333', fontWeight: 'bold' } },
    { id: '2', type: 'text', content: 'We have exciting news about your event registration.', style: { fontSize: '16px', color: '#666' } },
    { id: '3', type: 'footer', content: 'Best regards, Event Team', style: { fontSize: '14px', color: '#999' } }
  ])
  const [selectedId, setSelectedId] = useState(null)
  const [draggedId, setDraggedId] = useState(null)
  const [subject, setSubject] = useState(template.subject || 'Your Event Update')
  const [campaignStyle, setCampaignStyle] = useState(template.campaignStyle || {
    backgroundColor: '#ffffff',
    borderColor: '#e5e5e5',
    borderWidth: '1px',
    borderRadius: '8px',
    padding: '24px',
    maxWidth: '600px',
    fontFamily: 'Arial, sans-serif'
  })

  const componentTypes = [
    { type: 'header', label: 'Header', icon: Type, defaultContent: 'Header Text', style: { fontSize: '24px', color: '#333', fontWeight: 'bold' } },
    { type: 'text', label: 'Text', icon: Type, defaultContent: 'Your content here...', style: { fontSize: '16px', color: '#666' } },
    { type: 'image', label: 'Image', icon: Image, defaultContent: 'https://via.placeholder.com/400x200', style: { width: '100%' } },
    { type: 'button', label: 'Button', icon: Square, defaultContent: 'Click Here', style: { backgroundColor: '#007bff', color: '#fff', padding: '12px 24px' } },
    { type: 'divider', label: 'Divider', icon: Square, defaultContent: '', style: { height: '1px', backgroundColor: '#e5e5e5', margin: '20px 0' } },
    { type: 'link', label: 'Link', icon: Link, defaultContent: 'Click here to learn more', style: { color: '#007bff', textDecoration: 'underline' } }
  ]

  const updateComponents = (newComponents) => {
    setComponents(newComponents)
    onChange({
      subject,
      components: newComponents,
      campaignStyle,
      title: newComponents.find(c => c.type === 'header')?.content || '',
      content: newComponents.filter(c => c.type === 'text').map(c => c.content).join('\n\n'),
      footer: newComponents.find(c => c.type === 'footer')?.content || ''
    })
  }

  const updateCampaignStyle = (newStyle) => {
    setCampaignStyle(newStyle)
    onChange({
      subject,
      components,
      campaignStyle: newStyle,
      title: components.find(c => c.type === 'header')?.content || '',
      content: components.filter(c => c.type === 'text').map(c => c.content).join('\n\n'),
      footer: components.find(c => c.type === 'footer')?.content || ''
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
    if (!selected && selectedId !== 'campaign') return (
      <div className="text-center py-12">
        <Layers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Select a component to edit</p>
        <p className="text-sm text-gray-400 mt-2">Click on any component or campaign settings to customize</p>
      </div>
    )

    if (selectedId === 'campaign') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Paintbrush className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Campaign Settings</h3>
                <p className="text-sm text-gray-600">Customize overall campaign appearance</p>
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
                    value={campaignStyle.backgroundColor}
                    onChange={(e) => updateCampaignStyle({ ...campaignStyle, backgroundColor: e.target.value })}
                    className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={campaignStyle.backgroundColor}
                    onChange={(e) => updateCampaignStyle({ ...campaignStyle, backgroundColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Border Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={campaignStyle.borderColor}
                    onChange={(e) => updateCampaignStyle({ ...campaignStyle, borderColor: e.target.value })}
                    className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={campaignStyle.borderColor}
                    onChange={(e) => updateCampaignStyle({ ...campaignStyle, borderColor: e.target.value })}
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
                  value={campaignStyle.borderWidth}
                  onChange={(e) => updateCampaignStyle({ ...campaignStyle, borderWidth: e.target.value })}
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
                  value={campaignStyle.borderRadius}
                  onChange={(e) => updateCampaignStyle({ ...campaignStyle, borderRadius: e.target.value })}
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
                  value={campaignStyle.padding}
                  onChange={(e) => updateCampaignStyle({ ...campaignStyle, padding: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="12px">Tight</option>
                  <option value="16px">Small</option>
                  <option value="24px">Medium</option>
                  <option value="32px">Large</option>
                  <option value="48px">X-Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Type className="h-4 w-4 text-gray-500 mr-2" />
              <h4 className="font-medium text-gray-900">Typography</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                <select
                  value={campaignStyle.fontFamily}
                  onChange={(e) => updateCampaignStyle({ ...campaignStyle, fontFamily: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Helvetica, sans-serif">Helvetica</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Times New Roman, serif">Times New Roman</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                  <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Width</label>
                <select
                  value={campaignStyle.maxWidth}
                  onChange={(e) => updateCampaignStyle({ ...campaignStyle, maxWidth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="400px">400px - Narrow</option>
                  <option value="500px">500px - Small</option>
                  <option value="600px">600px - Medium</option>
                  <option value="700px">700px - Large</option>
                  <option value="800px">800px - Wide</option>
                  <option value="100%">100% - Full Width</option>
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
              {selected.type === 'header' && <Type className="h-5 w-5 text-primary" />}
              {selected.type === 'text' && <Type className="h-5 w-5 text-primary" />}
              {selected.type === 'image' && <Image className="h-5 w-5 text-primary" />}
              {selected.type === 'button' && <Square className="h-5 w-5 text-primary" />}
              {selected.type === 'link' && <Link className="h-5 w-5 text-primary" />}
              {selected.type === 'divider' && <Square className="h-5 w-5 text-primary" />}
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
          
          {selected.type === 'image' ? (
            <div className="space-y-3">
              <input
                type="url"
                value={selected.content}
                onChange={(e) => updateComponent(selected.id, { content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
              />
              {selected.content && (
                <div className="mt-2">
                  <img src={selected.content} alt="Preview" className="max-w-full h-20 object-cover rounded border" />
                </div>
              )}
            </div>
          ) : selected.type === 'divider' ? (
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-2" />
                Divider component - customize appearance using styling options below
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {(selected.type === 'text' || selected.type === 'header') && (
                <div className="flex items-center space-x-1 p-2 bg-gray-50 rounded-lg border">
                  <button
                    onClick={() => formatText(selected.id, 'bold')}
                    className={`p-2 rounded transition-colors ${
                      selected.style?.fontWeight === 'bold' ? 'bg-primary text-white' : 'hover:bg-gray-200'
                    }`}
                    title="Bold"
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => formatText(selected.id, 'italic')}
                    className={`p-2 rounded transition-colors ${
                      selected.style?.fontStyle === 'italic' ? 'bg-primary text-white' : 'hover:bg-gray-200'
                    }`}
                    title="Italic"
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => formatText(selected.id, 'underline')}
                    className={`p-2 rounded transition-colors ${
                      selected.style?.textDecoration === 'underline' ? 'bg-primary text-white' : 'hover:bg-gray-200'
                    }`}
                    title="Underline"
                  >
                    <Underline className="h-4 w-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-2"></div>
                  <button
                    onClick={() => alignText(selected.id, 'left')}
                    className={`p-2 rounded transition-colors ${
                      selected.style?.textAlign === 'left' ? 'bg-primary text-white' : 'hover:bg-gray-200'
                    }`}
                    title="Align Left"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => alignText(selected.id, 'center')}
                    className={`p-2 rounded transition-colors ${
                      selected.style?.textAlign === 'center' ? 'bg-primary text-white' : 'hover:bg-gray-200'
                    }`}
                    title="Align Center"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => alignText(selected.id, 'right')}
                    className={`p-2 rounded transition-colors ${
                      selected.style?.textAlign === 'right' ? 'bg-primary text-white' : 'hover:bg-gray-200'
                    }`}
                    title="Align Right"
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
        {selected.type !== 'divider' && selected.type !== 'image' && (
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="12px">12px - Small</option>
                  <option value="14px">14px - Regular</option>
                  <option value="16px">16px - Medium</option>
                  <option value="18px">18px - Large</option>
                  <option value="20px">20px - X-Large</option>
                  <option value="24px">24px - Heading</option>
                  <option value="28px">28px - Big Heading</option>
                  <option value="32px">32px - Hero</option>
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
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Sizing Section */}
        {selected.type === 'image' && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Image className="h-4 w-4 text-gray-500 mr-2" />
              <h4 className="font-medium text-gray-900">Image Settings</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                <select
                  value={selected.style.width || '100%'}
                  onChange={(e) => updateComponent(selected.id, { style: { ...selected.style, width: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="25%">25% - Quarter</option>
                  <option value="50%">50% - Half</option>
                  <option value="75%">75% - Three Quarter</option>
                  <option value="100%">100% - Full Width</option>
                  <option value="200px">200px - Small</option>
                  <option value="300px">300px - Medium</option>
                  <option value="400px">400px - Large</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                <select
                  value={selected.style.height || 'auto'}
                  onChange={(e) => updateComponent(selected.id, { style: { ...selected.style, height: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="auto">Auto - Maintain Ratio</option>
                  <option value="100px">100px - Small</option>
                  <option value="150px">150px - Medium</option>
                  <option value="200px">200px - Large</option>
                  <option value="300px">300px - X-Large</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Colors & Background Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Palette className="h-4 w-4 text-gray-500 mr-2" />
            <h4 className="font-medium text-gray-900">Colors & Background</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={selected.style.backgroundColor || '#ffffff'}
                  onChange={(e) => updateComponent(selected.id, { style: { ...selected.style, backgroundColor: e.target.value } })}
                  className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={selected.style.backgroundColor || '#ffffff'}
                  onChange={(e) => updateComponent(selected.id, { style: { ...selected.style, backgroundColor: e.target.value } })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="#ffffff"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Border Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={selected.style.borderColor || '#e5e5e5'}
                  onChange={(e) => updateComponent(selected.id, { style: { ...selected.style, borderColor: e.target.value, border: `1px solid ${e.target.value}` } })}
                  className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={selected.style.borderColor || '#e5e5e5'}
                  onChange={(e) => updateComponent(selected.id, { style: { ...selected.style, borderColor: e.target.value, border: `1px solid ${e.target.value}` } })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="#e5e5e5"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Spacing & Layout Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Settings className="h-4 w-4 text-gray-500 mr-2" />
            <h4 className="font-medium text-gray-900">Spacing & Layout</h4>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Padding</label>
              <select
                value={selected.style.padding || '0px'}
                onChange={(e) => updateComponent(selected.id, { style: { ...selected.style, padding: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="0px">None</option>
                <option value="5px">5px - Tight</option>
                <option value="10px">10px - Small</option>
                <option value="15px">15px - Medium</option>
                <option value="20px">20px - Large</option>
                <option value="30px">30px - X-Large</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Margin</label>
              <select
                value={selected.style.margin || '0px'}
                onChange={(e) => updateComponent(selected.id, { style: { ...selected.style, margin: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="0px">None</option>
                <option value="5px">5px - Tight</option>
                <option value="10px">10px - Small</option>
                <option value="15px">15px - Medium</option>
                <option value="20px">20px - Large</option>
                <option value="30px">30px - X-Large</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
              <select
                value={selected.style.borderRadius || '0px'}
                onChange={(e) => updateComponent(selected.id, { style: { ...selected.style, borderRadius: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="0px">None - Square</option>
                <option value="4px">4px - Slightly Rounded</option>
                <option value="8px">8px - Rounded</option>
                <option value="12px">12px - More Rounded</option>
                <option value="20px">20px - Very Rounded</option>
                <option value="50px">50px - Pill Shape</option>
              </select>
            </div>
          </div>
        </div>

        {selected.type === 'button' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
              <input
                type="color"
                value={selected.style.backgroundColor || '#007bff'}
                onChange={(e) => updateComponent(selected.id, { style: { ...selected.style, backgroundColor: e.target.value } })}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Link URL</label>
              <input
                type="url"
                value={selected.link || ''}
                onChange={(e) => updateComponent(selected.id, { link: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://example.com"
              />
            </div>
          </div>
        )}

        {selected.type === 'link' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Link URL</label>
            <input
              type="url"
              value={selected.link || ''}
              onChange={(e) => updateComponent(selected.id, { link: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://example.com"
            />
          </div>
        )}

        {selected.type === 'divider' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <input
                type="color"
                value={selected.style.backgroundColor || '#e5e5e5'}
                onChange={(e) => updateComponent(selected.id, { style: { ...selected.style, backgroundColor: e.target.value } })}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
              <select
                value={selected.style.height || '1px'}
                onChange={(e) => updateComponent(selected.id, { style: { ...selected.style, height: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="1px">1px</option>
                <option value="2px">2px</option>
                <option value="3px">3px</option>
                <option value="5px">5px</option>
              </select>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderPreview = () => (
    <div className="mx-auto" style={{ maxWidth: campaignStyle.maxWidth }}>
      <div 
        className="border rounded-lg" 
        style={{
          backgroundColor: campaignStyle.backgroundColor,
          borderColor: campaignStyle.borderColor,
          borderWidth: campaignStyle.borderWidth,
          borderRadius: campaignStyle.borderRadius,
          padding: campaignStyle.padding,
          fontFamily: campaignStyle.fontFamily
        }}
      >
        {type === 'email' && (
          <div className="border-b pb-4 mb-4" style={{ borderColor: campaignStyle.borderColor }}>
            <h3 className="text-lg font-medium text-gray-900">Subject: {subject}</h3>
          </div>
        )}
        
        {components.map((component) => {
        if (component.type === 'header' || component.type === 'text' || component.type === 'footer') {
          return (
            <div
              key={component.id}
              style={{
                ...component.style,
                marginBottom: '16px',
                whiteSpace: 'pre-wrap',
                padding: component.style.padding || '0px',
                margin: component.style.margin || '0px 0px 16px 0px',
                borderRadius: component.style.borderRadius || '0px'
              }}
            >
              {component.content.replace(/\{\{(\w+)\}\}/g, '[$1]')}
            </div>
          )
        }
        if (component.type === 'image') {
          return (
            <img
              key={component.id}
              src={component.content}
              alt="Campaign"
              style={{ 
                ...component.style, 
                marginBottom: '16px', 
                borderRadius: component.style.borderRadius || '4px',
                padding: component.style.padding || '0px',
                margin: component.style.margin || '0px 0px 16px 0px'
              }}
            />
          )
        }
        if (component.type === 'button') {
          return (
            <div key={component.id} style={{ textAlign: 'center', marginBottom: '16px' }}>
              <a
                href={component.link || '#'}
                style={{
                  ...component.style,
                  textDecoration: 'none',
                  borderRadius: component.style.borderRadius || '4px',
                  display: 'inline-block',
                  padding: component.style.padding || '12px 24px',
                  margin: component.style.margin || '0px'
                }}
              >
                {component.content}
              </a>
            </div>
          )
        }
        if (component.type === 'divider') {
          return <hr key={component.id} style={{ 
            ...component.style, 
            border: 'none',
            margin: component.style.margin || '20px 0px'
          }} />
        }
        if (component.type === 'link') {
          return (
            <div key={component.id} style={{ 
              marginBottom: '16px',
              padding: component.style.padding || '0px',
              margin: component.style.margin || '0px 0px 16px 0px'
            }}>
              <a
                href={component.link || '#'}
                style={{
                  ...component.style,
                  fontSize: component.style.fontSize || '16px',
                  borderRadius: component.style.borderRadius || '0px'
                }}
              >
                {component.content.replace(/\{\{(\w+)\}\}/g, '[$1]')}
              </a>
            </div>
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

          {type === 'email' && (
            <div className="mt-8 p-4 bg-gradient-to-r from-primary/5 to-blue-50 rounded-lg border border-primary/20">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Email Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value)
                  onChange({ subject: e.target.value, components })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your email subject..."
              />
            </div>
          )}

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
                <span>Contact's name</span>
              </div>
              <div className="flex items-center">
                <code className="bg-blue-100 px-2 py-1 rounded text-xs mr-2">{'{{email}}'}</code>
                <span>Contact's email</span>
              </div>
              <div className="flex items-center">
                <code className="bg-blue-100 px-2 py-1 rounded text-xs mr-2">{'{{team_name}}'}</code>
                <span>Team name</span>
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
              <h3 className="font-semibold text-gray-900">Template Structure</h3>
              <p className="text-sm text-gray-500">Drag to reorder components</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-8">
            {/* Campaign Settings Button */}
            <div
              onClick={() => setSelectedId('campaign')}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 group ${
                selectedId === 'campaign'
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className={`p-2 rounded-lg mr-3 ${
                selectedId === 'campaign' ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'
              }`}>
                <Paintbrush className={`h-4 w-4 ${
                  selectedId === 'campaign' ? 'text-blue-600' : 'text-gray-500'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm">Campaign Settings</div>
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
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Live Preview</h3>
                <p className="text-sm text-gray-500">See how your campaign will look</p>
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
                <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium text-lg">Preview will appear here</p>
                <p className="text-sm text-gray-400 mt-2">Add components to see your campaign design</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border">
                {renderPreview()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplateDesigner