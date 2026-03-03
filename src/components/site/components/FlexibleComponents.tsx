import { ReactNode } from 'react'
import { EditableWrapper } from '../editor/EditableWrapper'
import { EditableComponent } from '../editor/EditorCore'

interface ComponentProps {
  component: EditableComponent
  children?: ReactNode
}

// Text Component
export const TextComponent = ({ component }: ComponentProps) => {
  const content = component.content.content || 'Your text here...'
  
  return (
    <EditableWrapper component={component}>
      <div 
        dangerouslySetInnerHTML={{ __html: content }}
        className="prose max-w-none"
      />
    </EditableWrapper>
  )
}

// Heading Component
export const HeadingComponent = ({ component }: ComponentProps) => {
  const { text = 'Heading', level = 'h2' } = component.content
  const Tag = level as keyof JSX.IntrinsicElements
  
  return (
    <EditableWrapper component={component}>
      <Tag>{text}</Tag>
    </EditableWrapper>
  )
}

// Image Component
export const ImageComponent = ({ component }: ComponentProps) => {
  const { src, alt = '', caption } = component.content
  
  return (
    <EditableWrapper component={component}>
      <figure>
        <img src={src} alt={alt} className="w-full h-auto" />
        {caption && <figcaption className="text-sm text-gray-600 mt-2">{caption}</figcaption>}
      </figure>
    </EditableWrapper>
  )
}

// Button Component
export const ButtonComponent = ({ component }: ComponentProps) => {
  const { text = 'Button', link = '#', variant = 'primary' } = component.content
  
  const baseClasses = 'inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors'
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
  }
  
  return (
    <EditableWrapper component={component}>
      <a 
        href={link} 
        className={`${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]}`}
      >
        {text}
      </a>
    </EditableWrapper>
  )
}

// Hero Section Component
export const HeroComponent = ({ component }: ComponentProps) => {
  const { 
    title = 'Hero Title', 
    subtitle = 'Hero subtitle', 
    buttonText = 'Get Started',
    buttonLink = '#',
    backgroundImage,
    overlay = true
  } = component.content
  
  return (
    <EditableWrapper component={component}>
      <div 
        className="relative min-h-[500px] flex items-center justify-center text-center"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {overlay && backgroundImage && (
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        )}
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{title}</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">{subtitle}</p>
          {buttonText && (
            <a 
              href={buttonLink}
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {buttonText}
            </a>
          )}
        </div>
      </div>
    </EditableWrapper>
  )
}

// Container Component
export const ContainerComponent = ({ component }: ComponentProps) => {
  const { maxWidth = '1200px', centerContent = true } = component.content
  
  return (
    <EditableWrapper component={component}>
      <div 
        className={centerContent ? 'mx-auto' : ''}
        style={{ maxWidth }}
      >
        <div className="px-6">
          {/* Child components would be rendered here */}
          <div className="min-h-[100px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
            Drop components here
          </div>
        </div>
      </div>
    </EditableWrapper>
  )
}

// Grid Component
export const GridComponent = ({ component }: ComponentProps) => {
  const { columns = 3, gap = '1rem', items = [] } = component.content
  
  return (
    <EditableWrapper component={component}>
      <div 
        className="grid"
        style={{ 
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap 
        }}
      >
        {items.map((item: any, index: number) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg">
            {item.title && <h3 className="font-semibold mb-2">{item.title}</h3>}
            {item.content && <p className="text-gray-600">{item.content}</p>}
            {item.image && <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded mb-2" />}
          </div>
        ))}
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 min-h-[100px]">
          + Add Item
        </div>
      </div>
    </EditableWrapper>
  )
}

// Form Component
export const FormComponent = ({ component }: ComponentProps) => {
  const { 
    title = 'Contact Form',
    fields = [
      { type: 'text', name: 'name', label: 'Name', required: true },
      { type: 'email', name: 'email', label: 'Email', required: true },
      { type: 'textarea', name: 'message', label: 'Message', required: true }
    ],
    submitText = 'Submit',
    action = '#'
  } = component.content
  
  return (
    <EditableWrapper component={component}>
      <form action={action} method="POST" className="max-w-lg">
        {title && <h3 className="text-2xl font-semibold mb-6">{title}</h3>}
        <div className="space-y-4">
          {fields.map((field: any, index: number) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  required={field.required}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            {submitText}
          </button>
        </div>
      </form>
    </EditableWrapper>
  )
}

// Video Component
export const VideoComponent = ({ component }: ComponentProps) => {
  const { 
    url, 
    title = 'Video',
    autoplay = false,
    controls = true,
    muted = false,
    poster
  } = component.content
  
  const isYouTube = url?.includes('youtube.com') || url?.includes('youtu.be')
  const isVimeo = url?.includes('vimeo.com')
  
  return (
    <EditableWrapper component={component}>
      <div className="aspect-video">
        {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
        {isYouTube || isVimeo ? (
          <iframe
            src={url}
            className="w-full h-full rounded-lg"
            allowFullScreen
            title={title}
          />
        ) : (
          <video
            src={url}
            poster={poster}
            controls={controls}
            autoPlay={autoplay}
            muted={muted}
            className="w-full h-full rounded-lg"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </EditableWrapper>
  )
}

// Spacer Component
export const SpacerComponent = ({ component }: ComponentProps) => {
  const { height = '50px' } = component.content
  
  return (
    <EditableWrapper component={component}>
      <div style={{ height }} />
    </EditableWrapper>
  )
}

// Divider Component
export const DividerComponent = ({ component }: ComponentProps) => {
  const { 
    style = 'solid',
    color = '#e5e7eb',
    thickness = '1px',
    width = '100%'
  } = component.content
  
  return (
    <EditableWrapper component={component}>
      <hr 
        style={{
          borderStyle: style,
          borderColor: color,
          borderWidth: thickness,
          width
        }}
        className="my-4"
      />
    </EditableWrapper>
  )
}

// Icon Component
export const IconComponent = ({ component }: ComponentProps) => {
  const { 
    icon = '★',
    size = '24px',
    color = '#000000'
  } = component.content
  
  return (
    <EditableWrapper component={component}>
      <span 
        style={{ 
          fontSize: size,
          color,
          display: 'inline-block'
        }}
      >
        {icon}
      </span>
    </EditableWrapper>
  )
}

// Import advanced components
import { advancedComponentMap } from './AdvancedComponents'

// Map all components
export const componentMap = {
  text: TextComponent,
  heading: HeadingComponent,
  image: ImageComponent,
  button: ButtonComponent,
  hero: HeroComponent,
  container: ContainerComponent,
  grid: GridComponent,
  form: FormComponent,
  video: VideoComponent,
  spacer: SpacerComponent,
  divider: DividerComponent,
  icon: IconComponent,
  ...advancedComponentMap
}