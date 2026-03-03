import { useState } from 'react'
import { GripVertical, Trash2, Edit, Eye } from 'lucide-react'

const PageBuilder = ({ 
  page, 
  previewDevice, 
  selectedComponent, 
  onSelectComponent, 
  onUpdateComponent, 
  onDeleteComponent 
}) => {
  const [draggedId, setDraggedId] = useState(null)

  const handleDragStart = (e, componentId) => {
    setDraggedId(componentId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetId) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) return

    const components = page.components
    const draggedIndex = components.findIndex(c => c.id === draggedId)
    const targetIndex = components.findIndex(c => c.id === targetId)
    
    const newComponents = [...components]
    const [draggedComponent] = newComponents.splice(draggedIndex, 1)
    newComponents.splice(targetIndex, 0, draggedComponent)
    
    // Update page with new component order
    const updatedPage = { ...page, components: newComponents }
    onUpdateComponent(page.id, updatedPage)
    setDraggedId(null)
  }

  const getDeviceClass = () => {
    switch (previewDevice) {
      case 'tablet':
        return 'max-w-3xl'
      case 'mobile':
        return 'max-w-sm'
      default:
        return 'max-w-full'
    }
  }

  const renderComponent = (component) => {
    const isSelected = selectedComponent?.id === component.id
    
    return (
      <div
        key={component.id}
        draggable
        onDragStart={(e) => handleDragStart(e, component.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, component.id)}
        onClick={() => onSelectComponent(component)}
        className={`relative group cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2 ring-primary ring-opacity-50' : 'hover:ring-1 hover:ring-gray-300'
        }`}
        style={component.style}
      >
        {/* Component Controls */}
        <div className={`absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 ${
          isSelected ? 'opacity-100' : ''
        }`}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSelectComponent(component)
            }}
            className="p-1 bg-white rounded shadow-sm border border-gray-200 hover:bg-gray-50"
            title="Edit Component"
          >
            <Edit className="h-3 w-3 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDeleteComponent(component.id)
            }}
            className="p-1 bg-white rounded shadow-sm border border-gray-200 hover:bg-red-50 hover:text-red-600"
            title="Delete Component"
          >
            <Trash2 className="h-3 w-3 text-gray-600" />
          </button>
          <div className="p-1 bg-white rounded shadow-sm border border-gray-200 cursor-move">
            <GripVertical className="h-3 w-3 text-gray-400" />
          </div>
        </div>

        {/* Component Content */}
        <div className="relative">
          {renderComponentContent(component)}
        </div>
      </div>
    )
  }

  const renderComponentContent = (component) => {
    switch (component.type) {
      case 'hero':
        return (
          <div className="text-center py-20" style={{ backgroundColor: component.style.backgroundColor, color: component.style.textColor }}>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{component.content.title}</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">{component.content.subtitle}</p>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {component.content.buttonText}
            </button>
          </div>
        )

      case 'section':
        return (
          <div className="py-16" style={component.style}>
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">{component.content.title}</h2>
              <div className="text-lg text-gray-600 text-center">{component.content.content}</div>
            </div>
          </div>
        )

      case 'text':
        return (
          <div className="prose max-w-none" style={component.style}>
            <div dangerouslySetInnerHTML={{ __html: component.content.content.replace(/\n/g, '<br>') }} />
          </div>
        )

      case 'heading':
        const HeadingTag = component.content.level || 'h2'
        return (
          <HeadingTag style={component.style}>
            {component.content.text}
          </HeadingTag>
        )

      case 'image':
        return (
          <div className="text-center" style={{ margin: component.style.margin }}>
            <img
              src={component.content.src}
              alt={component.content.alt}
              style={component.style}
              className="rounded-lg shadow-lg"
            />
            {component.content.caption && (
              <p className="mt-2 text-sm text-gray-600">{component.content.caption}</p>
            )}
          </div>
        )

      case 'events':
        return (
          <div className="py-16" style={component.style}>
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">{component.content.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].slice(0, component.content.showCount).map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2">Sample Event {i}</h3>
                      <p className="text-gray-600 text-sm mb-4">Event description goes here...</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Mar 15, 2024</span>
                        <button className="bg-primary text-white px-4 py-2 rounded text-sm">Register</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'event-card':
        return (
          <div className="max-w-md mx-auto" style={component.style}>
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{component.content.title}</h3>
              <div className="text-sm text-gray-600 mb-2">📅 {component.content.date}</div>
              <div className="text-sm text-gray-600 mb-4">📍 {component.content.location}</div>
              <p className="text-gray-700 mb-4">{component.content.description}</p>
              <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-light transition-colors">
                {component.content.buttonText}
              </button>
            </div>
          </div>
        )

      case 'contact-form':
        return (
          <div className="py-16" style={component.style}>
            <div className="max-w-2xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">{component.content.title}</h2>
              <form className="space-y-6">
                {component.content.fields.includes('name') && (
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                )}
                {component.content.fields.includes('email') && (
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                )}
                {component.content.fields.includes('message') && (
                  <textarea
                    rows={4}
                    placeholder="Your Message"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                )}
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-light transition-colors"
                >
                  {component.content.buttonText}
                </button>
              </form>
            </div>
          </div>
        )

      case 'newsletter':
        return (
          <div className="py-16 text-center" style={component.style}>
            <div className="max-w-2xl mx-auto px-4">
              <h2 className="text-3xl font-bold mb-4">{component.content.title}</h2>
              <p className="text-lg mb-8 opacity-90">{component.content.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  {component.content.buttonText}
                </button>
              </div>
            </div>
          </div>
        )

      case 'gallery':
        return (
          <div className="py-16" style={component.style}>
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">{component.content.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {component.content.images.map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img src={image} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'video':
        return (
          <div className="py-16" style={component.style}>
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">{component.content.title}</h2>
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src={component.content.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title="Video Player"
                />
              </div>
            </div>
          </div>
        )

      case 'testimonials':
        return (
          <div className="py-16" style={component.style}>
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">{component.content.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {component.content.testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                      <div>
                        <div className="font-semibold">{testimonial.author}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'team':
        return (
          <div className="py-16" style={component.style}>
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">{component.content.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {component.content.members.map((member, index) => (
                  <div key={index} className="text-center">
                    <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 overflow-hidden">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-2">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="p-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <p className="text-gray-500">Unknown component type: {component.type}</p>
          </div>
        )
    }
  }

  if (!page) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No page selected</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gray-100 overflow-auto">
      <div className="min-h-full py-8">
        <div className={`mx-auto transition-all duration-300 ${getDeviceClass()}`}>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {page.components.length === 0 ? (
              <div className="py-32 text-center">
                <div className="text-gray-400 mb-4">
                  <Eye className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No components yet</h3>
                <p className="text-gray-500">Add components from the library to start building your page</p>
              </div>
            ) : (
              page.components.map(renderComponent)
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageBuilder