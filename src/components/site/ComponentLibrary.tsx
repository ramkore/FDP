import { Type, Image, Calendar, Users, Mail, MapPin, Star, Play, Grid, Layout, Palette } from 'lucide-react'

const ComponentLibrary = ({ onAddComponent }) => {
  const componentTypes = [
    {
      category: 'Layout',
      components: [
        {
          type: 'hero',
          label: 'Hero Section',
          icon: Layout,
          description: 'Large banner with title and call-to-action',
          defaultContent: {
            title: 'Welcome to Our Events',
            subtitle: 'Discover amazing events and experiences',
            buttonText: 'Get Started',
            buttonLink: '#events'
          },
          defaultStyle: {
            backgroundColor: '#1e40af',
            textColor: '#ffffff',
            padding: '80px 20px',
            textAlign: 'center'
          }
        },
        {
          type: 'section',
          label: 'Content Section',
          icon: Grid,
          description: 'Flexible content container',
          defaultContent: {
            title: 'Section Title',
            content: 'Your content goes here...'
          },
          defaultStyle: {
            backgroundColor: '#ffffff',
            padding: '60px 20px',
            textAlign: 'center'
          }
        }
      ]
    },
    {
      category: 'Content',
      components: [
        {
          type: 'text',
          label: 'Text Block',
          icon: Type,
          description: 'Rich text content',
          defaultContent: {
            content: 'Your text content goes here. You can format this text and add multiple paragraphs.'
          },
          defaultStyle: {
            fontSize: '16px',
            color: '#374151',
            padding: '20px',
            textAlign: 'left'
          }
        },
        {
          type: 'heading',
          label: 'Heading',
          icon: Type,
          description: 'Large heading text',
          defaultContent: {
            text: 'Your Heading Here',
            level: 'h2'
          },
          defaultStyle: {
            fontSize: '32px',
            color: '#1f2937',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px'
          }
        },
        {
          type: 'image',
          label: 'Image',
          icon: Image,
          description: 'Single image with caption',
          defaultContent: {
            src: 'https://via.placeholder.com/600x400',
            alt: 'Image description',
            caption: 'Image caption'
          },
          defaultStyle: {
            width: '100%',
            maxWidth: '600px',
            borderRadius: '8px',
            margin: '20px auto'
          }
        }
      ]
    },
    {
      category: 'Events',
      components: [
        {
          type: 'events',
          label: 'Events List',
          icon: Calendar,
          description: 'Display upcoming events',
          defaultContent: {
            title: 'Upcoming Events',
            showCount: 6,
            layout: 'grid'
          },
          defaultStyle: {
            backgroundColor: '#ffffff',
            padding: '40px 20px'
          }
        },
        {
          type: 'event-card',
          label: 'Event Card',
          icon: Calendar,
          description: 'Single event highlight',
          defaultContent: {
            title: 'Featured Event',
            date: '2024-04-15',
            location: 'Event Venue',
            description: 'Event description goes here...',
            buttonText: 'Register Now'
          },
          defaultStyle: {
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px'
          }
        }
      ]
    },
    {
      category: 'Interactive',
      components: [
        {
          type: 'contact-form',
          label: 'Contact Form',
          icon: Mail,
          description: 'Contact form with fields',
          defaultContent: {
            title: 'Get In Touch',
            fields: ['name', 'email', 'message'],
            buttonText: 'Send Message'
          },
          defaultStyle: {
            backgroundColor: '#f9fafb',
            padding: '40px 20px',
            borderRadius: '8px'
          }
        },
        {
          type: 'newsletter',
          label: 'Newsletter Signup',
          icon: Mail,
          description: 'Email subscription form',
          defaultContent: {
            title: 'Stay Updated',
            subtitle: 'Subscribe to our newsletter for latest updates',
            buttonText: 'Subscribe'
          },
          defaultStyle: {
            backgroundColor: '#1e40af',
            color: '#ffffff',
            padding: '40px 20px',
            textAlign: 'center'
          }
        }
      ]
    },
    {
      category: 'Media',
      components: [
        {
          type: 'gallery',
          label: 'Image Gallery',
          icon: Image,
          description: 'Photo gallery grid',
          defaultContent: {
            title: 'Photo Gallery',
            images: [
              'https://via.placeholder.com/300x200',
              'https://via.placeholder.com/300x200',
              'https://via.placeholder.com/300x200'
            ]
          },
          defaultStyle: {
            padding: '40px 20px',
            backgroundColor: '#ffffff'
          }
        },
        {
          type: 'video',
          label: 'Video Player',
          icon: Play,
          description: 'Embedded video player',
          defaultContent: {
            title: 'Watch Our Video',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnail: 'https://via.placeholder.com/600x400'
          },
          defaultStyle: {
            padding: '40px 20px',
            textAlign: 'center'
          }
        }
      ]
    },
    {
      category: 'Social',
      components: [
        {
          type: 'testimonials',
          label: 'Testimonials',
          icon: Star,
          description: 'Customer testimonials',
          defaultContent: {
            title: 'What People Say',
            testimonials: [
              {
                text: 'Great experience with amazing events!',
                author: 'John Doe',
                role: 'Event Attendee'
              }
            ]
          },
          defaultStyle: {
            backgroundColor: '#f9fafb',
            padding: '60px 20px'
          }
        },
        {
          type: 'team',
          label: 'Team Section',
          icon: Users,
          description: 'Team member profiles',
          defaultContent: {
            title: 'Our Team',
            members: [
              {
                name: 'Team Member',
                role: 'Position',
                image: 'https://via.placeholder.com/200x200',
                bio: 'Brief bio...'
              }
            ]
          },
          defaultStyle: {
            padding: '60px 20px',
            backgroundColor: '#ffffff'
          }
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
            <h3 className="font-semibold text-gray-900">Components</h3>
            <p className="text-sm text-gray-500">Drag & drop to build</p>
          </div>
        </div>

        <div className="space-y-6">
          {componentTypes.map((category) => (
            <div key={category.category}>
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                {category.category}
              </h4>
              <div className="space-y-2">
                {category.components.map((component) => {
                  const Icon = component.icon
                  return (
                    <button
                      key={component.type}
                      onClick={() => onAddComponent(component)}
                      className="w-full flex items-start p-3 text-left border border-gray-200 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-blue-50 hover:border-primary/30 transition-all duration-200 group"
                    >
                      <div className="p-2 bg-gray-100 group-hover:bg-primary/20 rounded-lg mr-3 transition-colors flex-shrink-0">
                        <Icon className="h-4 w-4 text-gray-500 group-hover:text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm">{component.label}</div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {component.description}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center mb-3">
            <div className="p-1 bg-blue-100 rounded mr-2">
              <Type className="h-3 w-3 text-blue-600" />
            </div>
            <h4 className="text-sm font-semibold text-blue-900">Pro Tips</h4>
          </div>
          <div className="text-xs text-blue-800 space-y-2">
            <p>• Click components to add them to your page</p>
            <p>• Select components to edit their properties</p>
            <p>• Use different device views to check responsiveness</p>
            <p>• Save frequently to preserve your changes</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComponentLibrary