import { useState } from 'react'
import { X, Type, Palette, Settings, Image, Link, Layout } from 'lucide-react'

const ComponentEditor = ({ component, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState('content')

  const updateContent = (field, value) => {
    onUpdate({
      ...component,
      content: { ...component.content, [field]: value }
    })
  }

  const updateStyle = (field, value) => {
    onUpdate({
      ...component,
      style: { ...component.style, [field]: value }
    })
  }

  const renderContentEditor = () => {
    switch (component.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={component.content.title}
                onChange={(e) => updateContent('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <textarea
                value={component.content.subtitle}
                onChange={(e) => updateContent('subtitle', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
              <input
                type="text"
                value={component.content.buttonText}
                onChange={(e) => updateContent('buttonText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
              <input
                type="text"
                value={component.content.buttonLink}
                onChange={(e) => updateContent('buttonLink', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="#section or /page"
              />
            </div>
          </div>
        )

      case 'text':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={component.content.content}
              onChange={(e) => updateContent('content', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        )

      case 'heading':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
              <input
                type="text"
                value={component.content.text}
                onChange={(e) => updateContent('text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heading Level</label>
              <select
                value={component.content.level}
                onChange={(e) => updateContent('level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="h1">H1 - Main Title</option>
                <option value="h2">H2 - Section Title</option>
                <option value="h3">H3 - Subsection</option>
                <option value="h4">H4 - Small Heading</option>
              </select>
            </div>
          </div>
        )

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                value={component.content.src}
                onChange={(e) => updateContent('src', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
              <input
                type="text"
                value={component.content.alt}
                onChange={(e) => updateContent('alt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
              <input
                type="text"
                value={component.content.caption}
                onChange={(e) => updateContent('caption', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )

      case 'events':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={component.content.title}
                onChange={(e) => updateContent('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Events</label>
              <select
                value={component.content.showCount}
                onChange={(e) => updateContent('showCount', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value={3}>3 Events</option>
                <option value={6}>6 Events</option>
                <option value={9}>9 Events</option>
                <option value={12}>12 Events</option>
              </select>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-sm text-gray-500">
            Content editing for {component.type} component
          </div>
        )
    }
  }

  const renderStyleEditor = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Colors</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Background</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={component.style.backgroundColor || '#ffffff'}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={component.style.backgroundColor || '#ffffff'}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Text Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={component.style.color || '#000000'}
                onChange={(e) => updateStyle('color', e.target.value)}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={component.style.color || '#000000'}
                onChange={(e) => updateStyle('color', e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Typography</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Font Size</label>
            <select
              value={component.style.fontSize || '16px'}
              onChange={(e) => updateStyle('fontSize', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            >
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="18px">18px</option>
              <option value="20px">20px</option>
              <option value="24px">24px</option>
              <option value="32px">32px</option>
              <option value="48px">48px</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Text Align</label>
            <select
              value={component.style.textAlign || 'left'}
              onChange={(e) => updateStyle('textAlign', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Spacing</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Padding</label>
            <select
              value={component.style.padding || '20px'}
              onChange={(e) => updateStyle('padding', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            >
              <option value="0px">None</option>
              <option value="10px">Small</option>
              <option value="20px">Medium</option>
              <option value="40px">Large</option>
              <option value="60px">X-Large</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Margin</label>
            <select
              value={component.style.margin || '0px'}
              onChange={(e) => updateStyle('margin', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            >
              <option value="0px">None</option>
              <option value="10px">Small</option>
              <option value="20px">Medium</option>
              <option value="40px">Large</option>
              <option value="60px">X-Large</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Edit Component</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500 capitalize">{component.type} Component</p>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'content'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Type className="h-4 w-4 mx-auto mb-1" />
            Content
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'style'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Palette className="h-4 w-4 mx-auto mb-1" />
            Style
          </button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'content' ? renderContentEditor() : renderStyleEditor()}
      </div>
    </div>
  )
}

export default ComponentEditor