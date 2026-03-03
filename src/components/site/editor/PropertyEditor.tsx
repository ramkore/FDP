import { useState } from 'react'
import { 
  Type, Palette, Layout, Smartphone, Monitor, Tablet, 
  Settings, Zap, Eye, Code, Image, Link2, 
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline
} from 'lucide-react'
import { useEditor, EditableComponent } from './EditorCore'

const PropertyEditor = () => {
  const { selectedComponent, updateComponent, previewDevice } = useEditor()
  const [activeTab, setActiveTab] = useState('content')

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6 text-center text-gray-500">
        <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Select a component to edit its properties</p>
      </div>
    )
  }

  const updateContent = (field: string, value: any) => {
    updateComponent(selectedComponent.id, {
      content: { ...selectedComponent.content, [field]: value }
    })
  }

  const updateStyle = (field: string, value: any) => {
    updateComponent(selectedComponent.id, {
      style: { ...selectedComponent.style, [field]: value }
    })
  }

  const updateResponsiveStyle = (field: string, value: any) => {
    updateComponent(selectedComponent.id, {
      responsive: {
        ...selectedComponent.responsive,
        [previewDevice]: {
          ...selectedComponent.responsive?.[previewDevice],
          [field]: value
        }
      }
    })
  }

  const updateLayout = (field: string, value: any) => {
    updateComponent(selectedComponent.id, {
      layout: { ...selectedComponent.layout, [field]: value }
    })
  }

  const updateAnimation = (field: string, value: any) => {
    updateComponent(selectedComponent.id, {
      animation: { ...selectedComponent.animation, [field]: value }
    })
  }

  const tabs = [
    { id: 'content', label: 'Content', icon: Type },
    { id: 'style', label: 'Style', icon: Palette },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'responsive', label: 'Responsive', icon: Smartphone },
    { id: 'animation', label: 'Animation', icon: Zap },
    { id: 'advanced', label: 'Advanced', icon: Code }
  ]

  const renderContentEditor = () => (
    <div className="space-y-4">
      {Object.entries(selectedComponent.content).map(([key, value]) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          {typeof value === 'string' && value.length > 50 ? (
            <textarea
              value={value}
              onChange={(e) => updateContent(key, e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          ) : typeof value === 'boolean' ? (
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => updateContent(key, e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">{key}</span>
            </label>
          ) : typeof value === 'number' ? (
            <input
              type="number"
              value={value}
              onChange={(e) => updateContent(key, parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          ) : Array.isArray(value) ? (
            <div className="space-y-2">
              {value.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={typeof item === 'string' ? item : JSON.stringify(item)}
                    onChange={(e) => {
                      const newArray = [...value]
                      newArray[index] = e.target.value
                      updateContent(key, newArray)
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <button
                    onClick={() => {
                      const newArray = value.filter((_, i) => i !== index)
                      updateContent(key, newArray)
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => updateContent(key, [...value, ''])}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                + Add Item
              </button>
            </div>
          ) : (
            <input
              type="text"
              value={value?.toString() || ''}
              onChange={(e) => updateContent(key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          )}
        </div>
      ))}
      
      <button
        onClick={() => {
          const newKey = prompt('Enter property name:')
          if (newKey) {
            updateContent(newKey, '')
          }
        }}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400 hover:text-gray-600"
      >
        + Add Property
      </button>
    </div>
  )

  const renderStyleEditor = () => (
    <div className="space-y-6">
      {/* Typography */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Typography</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Font Size</label>
            <input
              type="text"
              value={selectedComponent.style?.fontSize || '16px'}
              onChange={(e) => updateStyle('fontSize', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Font Weight</label>
            <select
              value={selectedComponent.style?.fontWeight || 'normal'}
              onChange={(e) => updateStyle('fontWeight', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="lighter">Lighter</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
              <option value="600">600</option>
              <option value="700">700</option>
              <option value="800">800</option>
              <option value="900">900</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Text Align</label>
            <div className="flex space-x-1">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() => updateStyle('textAlign', align)}
                  className={`p-1 rounded ${
                    selectedComponent.style?.textAlign === align
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {align === 'left' && <AlignLeft className="h-3 w-3" />}
                  {align === 'center' && <AlignCenter className="h-3 w-3" />}
                  {align === 'right' && <AlignRight className="h-3 w-3" />}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Line Height</label>
            <input
              type="text"
              value={selectedComponent.style?.lineHeight || '1.5'}
              onChange={(e) => updateStyle('lineHeight', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Colors</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Text Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={selectedComponent.style?.color || '#000000'}
                onChange={(e) => updateStyle('color', e.target.value)}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedComponent.style?.color || '#000000'}
                onChange={(e) => updateStyle('color', e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Background</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={selectedComponent.style?.backgroundColor || '#ffffff'}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedComponent.style?.backgroundColor || '#ffffff'}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Spacing</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Padding</label>
            <input
              type="text"
              value={selectedComponent.style?.padding || '0px'}
              onChange={(e) => updateStyle('padding', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              placeholder="10px or 10px 20px"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Margin</label>
            <input
              type="text"
              value={selectedComponent.style?.margin || '0px'}
              onChange={(e) => updateStyle('margin', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              placeholder="10px or 10px 20px"
            />
          </div>
        </div>
      </div>

      {/* Border */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Border</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Border Width</label>
            <input
              type="text"
              value={selectedComponent.style?.borderWidth || '0px'}
              onChange={(e) => updateStyle('borderWidth', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Border Style</label>
            <select
              value={selectedComponent.style?.borderStyle || 'solid'}
              onChange={(e) => updateStyle('borderStyle', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="none">None</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Border Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={selectedComponent.style?.borderColor || '#000000'}
                onChange={(e) => updateStyle('borderColor', e.target.value)}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedComponent.style?.borderColor || '#000000'}
                onChange={(e) => updateStyle('borderColor', e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Border Radius</label>
            <input
              type="text"
              value={selectedComponent.style?.borderRadius || '0px'}
              onChange={(e) => updateStyle('borderRadius', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderLayoutEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
        <select
          value={selectedComponent.layout?.position || 'static'}
          onChange={(e) => updateLayout('position', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="static">Static</option>
          <option value="relative">Relative</option>
          <option value="absolute">Absolute</option>
          <option value="fixed">Fixed</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
          <input
            type="text"
            value={selectedComponent.layout?.width || 'auto'}
            onChange={(e) => updateLayout('width', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="auto, 100px, 50%"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
          <input
            type="text"
            value={selectedComponent.layout?.height || 'auto'}
            onChange={(e) => updateLayout('height', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="auto, 100px, 50%"
          />
        </div>
      </div>

      {selectedComponent.layout?.position === 'absolute' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Top</label>
            <input
              type="text"
              value={selectedComponent.layout?.top || '0px'}
              onChange={(e) => updateLayout('top', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Left</label>
            <input
              type="text"
              value={selectedComponent.layout?.left || '0px'}
              onChange={(e) => updateLayout('left', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Z-Index</label>
        <input
          type="number"
          value={selectedComponent.layout?.zIndex || 0}
          onChange={(e) => updateLayout('zIndex', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>
    </div>
  )

  const renderResponsiveEditor = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-sm font-medium text-gray-700">Editing for:</span>
        <div className="flex space-x-1">
          {[
            { device: 'desktop', icon: Monitor },
            { device: 'tablet', icon: Tablet },
            { device: 'mobile', icon: Smartphone }
          ].map(({ device, icon: Icon }) => (
            <button
              key={device}
              className={`p-2 rounded ${
                previewDevice === device
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        Changes will apply to {previewDevice} view only
      </div>

      {/* Responsive-specific styles */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Display</label>
          <select
            value={selectedComponent.responsive?.[previewDevice]?.display || 'block'}
            onChange={(e) => updateResponsiveStyle('display', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="block">Block</option>
            <option value="inline">Inline</option>
            <option value="inline-block">Inline Block</option>
            <option value="flex">Flex</option>
            <option value="grid">Grid</option>
            <option value="none">Hidden</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
            <input
              type="text"
              value={selectedComponent.responsive?.[previewDevice]?.fontSize || ''}
              onChange={(e) => updateResponsiveStyle('fontSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Inherit from base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Padding</label>
            <input
              type="text"
              value={selectedComponent.responsive?.[previewDevice]?.padding || ''}
              onChange={(e) => updateResponsiveStyle('padding', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Inherit from base"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderAnimationEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Animation Type</label>
        <select
          value={selectedComponent.animation?.type || 'none'}
          onChange={(e) => updateAnimation('type', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="none">None</option>
          <option value="fadeIn">Fade In</option>
          <option value="slideUp">Slide Up</option>
          <option value="slideDown">Slide Down</option>
          <option value="slideLeft">Slide Left</option>
          <option value="slideRight">Slide Right</option>
          <option value="zoomIn">Zoom In</option>
          <option value="zoomOut">Zoom Out</option>
          <option value="bounce">Bounce</option>
          <option value="pulse">Pulse</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
          <input
            type="text"
            value={selectedComponent.animation?.duration || '0.3s'}
            onChange={(e) => updateAnimation('duration', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="0.3s"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Delay</label>
          <input
            type="text"
            value={selectedComponent.animation?.delay || '0s'}
            onChange={(e) => updateAnimation('delay', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="0s"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Trigger</label>
        <select
          value={selectedComponent.animation?.trigger || 'scroll'}
          onChange={(e) => updateAnimation('trigger', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="scroll">On Scroll</option>
          <option value="hover">On Hover</option>
          <option value="click">On Click</option>
        </select>
      </div>
    </div>
  )

  const renderAdvancedEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Custom CSS</label>
        <textarea
          value={JSON.stringify(selectedComponent.style, null, 2)}
          onChange={(e) => {
            try {
              const newStyle = JSON.parse(e.target.value)
              updateComponent(selectedComponent.id, { style: newStyle })
            } catch (error) {
              // Invalid JSON, ignore
            }
          }}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
          placeholder="Custom CSS properties as JSON"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Conditional Display</label>
        <div className="space-y-2">
          <input
            type="text"
            value={selectedComponent.conditions?.showIf || ''}
            onChange={(e) => updateComponent(selectedComponent.id, {
              conditions: { ...selectedComponent.conditions, showIf: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="Show if condition (e.g., user.role === 'admin')"
          />
          <input
            type="text"
            value={selectedComponent.conditions?.hideIf || ''}
            onChange={(e) => updateComponent(selectedComponent.id, {
              conditions: { ...selectedComponent.conditions, hideIf: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="Hide if condition"
          />
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content': return renderContentEditor()
      case 'style': return renderStyleEditor()
      case 'layout': return renderLayoutEditor()
      case 'responsive': return renderResponsiveEditor()
      case 'animation': return renderAnimationEditor()
      case 'advanced': return renderAdvancedEditor()
      default: return null
    }
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Properties</h3>
        <p className="text-sm text-gray-500 capitalize">{selectedComponent.type} Component</p>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-3 w-3 mx-auto mb-1" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {renderTabContent()}
      </div>
    </div>
  )
}

export default PropertyEditor