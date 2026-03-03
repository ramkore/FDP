import { useState } from 'react'
import { EditableWrapper } from '../editor/EditableWrapper'
import { EditableComponent } from '../editor/EditorCore'
import { ChevronDown, Star, Play, Calendar, MapPin, Users, Mail, Phone } from 'lucide-react'

interface ComponentProps {
  component: EditableComponent
}

// Accordion Component
export const AccordionComponent = ({ component }: ComponentProps) => {
  const { items = [], allowMultiple = false } = component.content
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenItems(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      )
    } else {
      setOpenItems(prev => prev.includes(index) ? [] : [index])
    }
  }

  return (
    <EditableWrapper component={component}>
      <div className="space-y-2">
        {items.map((item: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
            >
              <span className="font-medium">{item.title}</span>
              <ChevronDown 
                className={`h-5 w-5 transition-transform ${
                  openItems.includes(index) ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openItems.includes(index) && (
              <div className="px-6 pb-4 text-gray-600">
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </EditableWrapper>
  )
}

// Tabs Component
export const TabsComponent = ({ component }: ComponentProps) => {
  const { tabs = [] } = component.content
  const [activeTab, setActiveTab] = useState(0)

  return (
    <EditableWrapper component={component}>
      <div>
        <div className="border-b border-gray-200">
          <div className="flex space-x-8">
            {tabs.map((tab: any, index: number) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === index
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </div>
        <div className="py-6">
          {tabs[activeTab] && (
            <div dangerouslySetInnerHTML={{ __html: tabs[activeTab].content }} />
          )}
        </div>
      </div>
    </EditableWrapper>
  )
}

// Testimonial Card Component
export const TestimonialComponent = ({ component }: ComponentProps) => {
  const { 
    testimonial = 'Great service!',
    author = 'John Doe',
    role = 'Customer',
    avatar,
    rating = 5
  } = component.content

  return (
    <EditableWrapper component={component}>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <blockquote className="text-gray-700 mb-4">
          "{testimonial}"
        </blockquote>
        <div className="flex items-center">
          {avatar && (
            <img
              src={avatar}
              alt={author}
              className="h-12 w-12 rounded-full mr-4"
            />
          )}
          <div>
            <div className="font-semibold text-gray-900">{author}</div>
            <div className="text-sm text-gray-600">{role}</div>
          </div>
        </div>
      </div>
    </EditableWrapper>
  )
}

// Pricing Card Component
export const PricingCardComponent = ({ component }: ComponentProps) => {
  const {
    title = 'Basic Plan',
    price = '$9.99',
    period = 'month',
    features = [],
    buttonText = 'Get Started',
    buttonLink = '#',
    popular = false
  } = component.content

  return (
    <EditableWrapper component={component}>
      <div className={`relative bg-white rounded-lg shadow-lg p-6 ${
        popular ? 'ring-2 ring-blue-500' : ''
      }`}>
        {popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>
        )}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <div className="mb-4">
            <span className="text-4xl font-bold text-gray-900">{price}</span>
            <span className="text-gray-600">/{period}</span>
          </div>
          <ul className="space-y-3 mb-6">
            {features.map((feature: string, index: number) => (
              <li key={index} className="flex items-center text-gray-600">
                <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <a
            href={buttonLink}
            className={`w-full inline-flex justify-center items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              popular
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            {buttonText}
          </a>
        </div>
      </div>
    </EditableWrapper>
  )
}

// Team Member Component
export const TeamMemberComponent = ({ component }: ComponentProps) => {
  const {
    name = 'Team Member',
    role = 'Position',
    bio = 'Brief bio about the team member.',
    image,
    social = {}
  } = component.content

  return (
    <EditableWrapper component={component}>
      <div className="text-center">
        {image && (
          <img
            src={image}
            alt={name}
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          />
        )}
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{name}</h3>
        <p className="text-blue-600 font-medium mb-3">{role}</p>
        <p className="text-gray-600 mb-4">{bio}</p>
        {Object.keys(social).length > 0 && (
          <div className="flex justify-center space-x-3">
            {Object.entries(social).map(([platform, url]: [string, any]) => (
              <a
                key={platform}
                href={url}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">{platform}</span>
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
              </a>
            ))}
          </div>
        )}
      </div>
    </EditableWrapper>
  )
}

// Event Card Component
export const EventCardComponent = ({ component }: ComponentProps) => {
  const {
    title = 'Event Title',
    date = '2024-04-15',
    time = '10:00 AM',
    location = 'Event Venue',
    description = 'Event description...',
    image,
    price,
    buttonText = 'Register',
    buttonLink = '#'
  } = component.content

  return (
    <EditableWrapper component={component}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {image && (
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(date).toLocaleDateString()} at {time}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{location}</span>
          </div>
          <p className="text-gray-700 mb-4">{description}</p>
          <div className="flex items-center justify-between">
            {price && (
              <span className="text-2xl font-bold text-blue-600">{price}</span>
            )}
            <a
              href={buttonLink}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {buttonText}
            </a>
          </div>
        </div>
      </div>
    </EditableWrapper>
  )
}

// Contact Info Component
export const ContactInfoComponent = ({ component }: ComponentProps) => {
  const {
    title = 'Contact Us',
    email,
    phone,
    address,
    hours
  } = component.content

  return (
    <EditableWrapper component={component}>
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h3>
        <div className="space-y-4">
          {email && (
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                {email}
              </a>
            </div>
          )}
          {phone && (
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-3" />
              <a href={`tel:${phone}`} className="text-blue-600 hover:underline">
                {phone}
              </a>
            </div>
          )}
          {address && (
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
              <span className="text-gray-700">{address}</span>
            </div>
          )}
          {hours && (
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-1" />
              <div>
                <div className="font-medium text-gray-900 mb-1">Hours</div>
                <div className="text-gray-700">{hours}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </EditableWrapper>
  )
}

// Stats Component
export const StatsComponent = ({ component }: ComponentProps) => {
  const { stats = [] } = component.content

  return (
    <EditableWrapper component={component}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat: any, index: number) => (
          <div key={index} className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {stat.value}
            </div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </EditableWrapper>
  )
}

// Newsletter Component
export const NewsletterComponent = ({ component }: ComponentProps) => {
  const {
    title = 'Stay Updated',
    description = 'Subscribe to our newsletter for the latest updates.',
    placeholder = 'Enter your email',
    buttonText = 'Subscribe'
  } = component.content

  return (
    <EditableWrapper component={component}>
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <form className="max-w-md mx-auto flex">
          <input
            type="email"
            placeholder={placeholder}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </EditableWrapper>
  )
}

// Export all advanced components
export const advancedComponentMap = {
  accordion: AccordionComponent,
  tabs: TabsComponent,
  testimonial: TestimonialComponent,
  pricingCard: PricingCardComponent,
  teamMember: TeamMemberComponent,
  eventCard: EventCardComponent,
  contactInfo: ContactInfoComponent,
  stats: StatsComponent,
  newsletter: NewsletterComponent
}