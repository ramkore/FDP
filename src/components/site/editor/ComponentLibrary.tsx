import { 
  Type, Image, Calendar, Users, Mail, MapPin, Star, Play, Grid, Layout, 
  Palette, Layers, Zap, Settings, BarChart3, MessageSquare, CreditCard,
  ChevronDown, FileText, Phone, Clock, Award, TrendingUp
} from 'lucide-react'

const ComponentLibrary = ({ onAddComponent }: { onAddComponent: (type: string) => void }) => {
  const componentCategories = [
    {
      category: 'Layout & Structure',
      icon: Layout,
      components: [
        {
          type: 'hero',
          label: 'Hero Section',
          icon: Layout,
          description: 'Large banner with title, subtitle, and call-to-action'
        },
        {
          type: 'container',
          label: 'Container',
          icon: Grid,
          description: 'Flexible content container with max-width control'
        },
        {
          type: 'grid',
          label: 'Grid Layout',
          icon: Grid,
          description: 'Responsive grid system for organizing content'
        },
        {
          type: 'spacer',
          label: 'Spacer',
          icon: Layers,
          description: 'Add vertical spacing between sections'
        },
        {
          type: 'divider',
          label: 'Divider',
          icon: Layers,
          description: 'Horizontal line to separate content sections'
        }
      ]
    },
    {
      category: 'Content & Media',
      icon: Type,
      components: [
        {
          type: 'text',
          label: 'Text Block',
          icon: Type,
          description: 'Rich text content with formatting options'
        },
        {
          type: 'heading',
          label: 'Heading',
          icon: Type,
          description: 'Customizable headings (H1-H6)'
        },
        {
          type: 'image',
          label: 'Image',
          icon: Image,
          description: 'Single image with caption and alt text'
        },
        {
          type: 'video',
          label: 'Video Player',
          icon: Play,
          description: 'Embedded video player for YouTube, Vimeo, or direct links'
        },
        {
          type: 'icon',
          label: 'Icon',
          icon: Star,
          description: 'Customizable icons with size and color options'
        }
      ]
    },
    {
      category: 'Interactive Elements',
      icon: Zap,
      components: [
        {
          type: 'button',
          label: 'Button',
          icon: Settings,
          description: 'Clickable button with multiple style variants'
        },
        {
          type: 'form',
          label: 'Contact Form',
          icon: Mail,
          description: 'Customizable form with various field types'
        },
        {
          type: 'accordion',
          label: 'Accordion',
          icon: ChevronDown,
          description: 'Collapsible content sections'
        },
        {
          type: 'tabs',
          label: 'Tabs',
          icon: FileText,
          description: 'Tabbed content interface'
        },
        {
          type: 'newsletter',
          label: 'Newsletter Signup',
          icon: Mail,
          description: 'Email subscription form'
        }
      ]
    },
    {
      category: 'Business & Marketing',
      icon: TrendingUp,
      components: [
        {
          type: 'testimonial',
          label: 'Testimonial',
          icon: MessageSquare,
          description: 'Customer testimonial with rating and author info'
        },
        {
          type: 'pricingCard',
          label: 'Pricing Card',
          icon: CreditCard,
          description: 'Pricing plan card with features and CTA'
        },
        {
          type: 'stats',
          label: 'Statistics',
          icon: BarChart3,
          description: 'Display key metrics and numbers'
        },
        {
          type: 'teamMember',
          label: 'Team Member',
          icon: Users,
          description: 'Team member profile with photo and bio'
        },
        {
          type: 'contactInfo',
          label: 'Contact Info',
          icon: Phone,
          description: 'Contact details with icons'
        }
      ]
    },
    {
      category: 'Events & Calendar',
      icon: Calendar,
      components: [
        {
          type: 'eventCard',
          label: 'Event Card',
          icon: Calendar,
          description: 'Event listing with date, location, and registration'
        }
      ]
    }
  ]

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-primary/10 rounded-lg mr-3">
            <Palette className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Component Library</h3>
            <p className="text-sm text-gray-500">Drag & drop to build</p>
          </div>
        </div>

        <div className="space-y-8">
          {componentCategories.map((category) => {
            const CategoryIcon = category.icon
            return (
              <div key={category.category}>
                <div className="flex items-center mb-4">
                  <CategoryIcon className="h-4 w-4 text-gray-500 mr-2" />
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    {category.category}
                  </h4>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {category.components.map((component) => {
                    const Icon = component.icon
                    return (
                      <button
                        key={component.type}
                        onClick={() => onAddComponent(component.type)}
                        className="w-full flex items-start p-4 text-left border border-gray-200 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-blue-50 hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="p-2 bg-gray-100 group-hover:bg-primary/20 rounded-lg mr-3 transition-colors flex-shrink-0">
                          <Icon className="h-4 w-4 text-gray-500 group-hover:text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm mb-1">
                            {component.label}
                          </div>
                          <div className="text-xs text-gray-500 line-clamp-2">
                            {component.description}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Pro Tips Section */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center mb-3">
            <div className="p-1 bg-blue-100 rounded mr-2">
              <Award className="h-4 w-4 text-blue-600" />
            </div>
            <h4 className="text-sm font-semibold text-blue-900">Pro Tips</h4>
          </div>
          <div className="text-xs text-blue-800 space-y-2">
            <p>• Click any component to add it to your page</p>
            <p>• Select components to edit all properties</p>
            <p>• Use responsive settings for mobile optimization</p>
            <p>• Combine components to create unique layouts</p>
            <p>• Save frequently to preserve your changes</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <button
              onClick={() => onAddComponent('hero')}
              className="w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              🚀 Add Hero Section
            </button>
            <button
              onClick={() => onAddComponent('form')}
              className="w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              📝 Add Contact Form
            </button>
            <button
              onClick={() => onAddComponent('testimonial')}
              className="w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              ⭐ Add Testimonial
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComponentLibrary