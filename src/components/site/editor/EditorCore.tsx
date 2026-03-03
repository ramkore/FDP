import { createContext, useContext, useState, ReactNode } from 'react'

export interface EditableComponent {
  id: string
  type: string
  content: Record<string, any>
  style: Record<string, any>
  layout: {
    width?: string
    height?: string
    position?: 'static' | 'relative' | 'absolute' | 'fixed'
    top?: string
    left?: string
    zIndex?: number
  }
  responsive: {
    desktop: Record<string, any>
    tablet: Record<string, any>
    mobile: Record<string, any>
  }
  animation?: {
    type?: string
    duration?: string
    delay?: string
    trigger?: 'scroll' | 'hover' | 'click'
  }
  conditions?: {
    showIf?: string
    hideIf?: string
  }
}

interface EditorContextType {
  selectedComponent: EditableComponent | null
  setSelectedComponent: (component: EditableComponent | null) => void
  editMode: boolean
  setEditMode: (mode: boolean) => void
  previewDevice: 'desktop' | 'tablet' | 'mobile'
  setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => void
  updateComponent: (id: string, updates: Partial<EditableComponent>) => void
  deleteComponent: (id: string) => void
  duplicateComponent: (id: string) => void
  moveComponent: (id: string, direction: 'up' | 'down') => void
}

const EditorContext = createContext<EditorContextType | null>(null)

export const useEditor = () => {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider')
  }
  return context
}

interface EditorProviderProps {
  children: ReactNode
  onUpdateComponent: (id: string, updates: Partial<EditableComponent>) => void
  onDeleteComponent: (id: string) => void
  onDuplicateComponent: (id: string) => void
  onMoveComponent: (id: string, direction: 'up' | 'down') => void
}

export const EditorProvider = ({ 
  children, 
  onUpdateComponent,
  onDeleteComponent,
  onDuplicateComponent,
  onMoveComponent
}: EditorProviderProps) => {
  const [selectedComponent, setSelectedComponent] = useState<EditableComponent | null>(null)
  const [editMode, setEditMode] = useState(true)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  const updateComponent = (id: string, updates: Partial<EditableComponent>) => {
    onUpdateComponent(id, updates)
    if (selectedComponent?.id === id) {
      setSelectedComponent({ ...selectedComponent, ...updates })
    }
  }

  const deleteComponent = (id: string) => {
    onDeleteComponent(id)
    if (selectedComponent?.id === id) {
      setSelectedComponent(null)
    }
  }

  const duplicateComponent = (id: string) => {
    onDuplicateComponent(id)
  }

  const moveComponent = (id: string, direction: 'up' | 'down') => {
    onMoveComponent(id, direction)
  }

  return (
    <EditorContext.Provider value={{
      selectedComponent,
      setSelectedComponent,
      editMode,
      setEditMode,
      previewDevice,
      setPreviewDevice,
      updateComponent,
      deleteComponent,
      duplicateComponent,
      moveComponent
    }}>
      {children}
    </EditorContext.Provider>
  )
}