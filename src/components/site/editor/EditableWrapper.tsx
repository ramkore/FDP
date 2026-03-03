import { ReactNode, useState } from 'react'
import { Edit3, Move, Copy, Trash2, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react'
import { useEditor, EditableComponent } from './EditorCore'

interface EditableWrapperProps {
  component: EditableComponent
  children: ReactNode
  className?: string
}

export const EditableWrapper = ({ component, children, className = '' }: EditableWrapperProps) => {
  const { 
    selectedComponent, 
    setSelectedComponent, 
    editMode, 
    previewDevice,
    updateComponent,
    deleteComponent,
    duplicateComponent,
    moveComponent
  } = useEditor()
  
  const [isHovered, setIsHovered] = useState(false)
  const isSelected = selectedComponent?.id === component.id

  const handleClick = (e: React.MouseEvent) => {
    if (!editMode) return
    e.stopPropagation()
    setSelectedComponent(component)
  }

  const getResponsiveStyles = () => {
    const baseStyles = component.style || {}
    const responsiveStyles = component.responsive?.[previewDevice] || {}
    const layoutStyles = component.layout || {}
    
    return {
      ...baseStyles,
      ...responsiveStyles,
      ...layoutStyles,
      position: layoutStyles.position || 'relative',
      ...(layoutStyles.position === 'absolute' && {
        top: layoutStyles.top,
        left: layoutStyles.left,
        zIndex: layoutStyles.zIndex
      })
    }
  }

  const toggleVisibility = () => {
    updateComponent(component.id, {
      style: {
        ...component.style,
        display: component.style?.display === 'none' ? 'block' : 'none'
      }
    })
  }

  if (!editMode) {
    return (
      <div style={getResponsiveStyles()} className={className}>
        {children}
      </div>
    )
  }

  return (
    <div
      className={`relative group ${className}`}
      style={getResponsiveStyles()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Selection Outline */}
      {(isSelected || isHovered) && (
        <div className={`absolute inset-0 pointer-events-none border-2 rounded-sm ${
          isSelected ? 'border-blue-500 bg-blue-500/5' : 'border-blue-300'
        }`} />
      )}

      {/* Component Label */}
      {(isSelected || isHovered) && (
        <div className="absolute -top-6 left-0 z-50">
          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-t-sm font-medium">
            {component.type}
          </div>
        </div>
      )}

      {/* Toolbar */}
      {isSelected && (
        <div className="absolute -top-10 right-0 z-50 flex items-center space-x-1 bg-white border border-gray-200 rounded-md shadow-lg p-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              moveComponent(component.id, 'up')
            }}
            className="p-1 hover:bg-gray-100 rounded text-gray-600"
            title="Move Up"
          >
            <ChevronUp className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              moveComponent(component.id, 'down')
            }}
            className="p-1 hover:bg-gray-100 rounded text-gray-600"
            title="Move Down"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              duplicateComponent(component.id)
            }}
            className="p-1 hover:bg-gray-100 rounded text-gray-600"
            title="Duplicate"
          >
            <Copy className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleVisibility()
            }}
            className="p-1 hover:bg-gray-100 rounded text-gray-600"
            title={component.style?.display === 'none' ? 'Show' : 'Hide'}
          >
            {component.style?.display === 'none' ? (
              <EyeOff className="h-3 w-3" />
            ) : (
              <Eye className="h-3 w-3" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              deleteComponent(component.id)
            }}
            className="p-1 hover:bg-red-100 rounded text-red-600"
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Drag Handle */}
      {isSelected && (
        <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 z-50">
          <div className="bg-blue-500 text-white p-1 rounded cursor-move">
            <Move className="h-3 w-3" />
          </div>
        </div>
      )}

      {children}
    </div>
  )
}