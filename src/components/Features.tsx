const Features = () => {
  const features = [
    {
      title: 'Lightning Fast',
      description: 'Deploy in seconds with our optimized infrastructure',
      icon: '⚡'
    },
    {
      title: 'Secure by Default',
      description: 'Enterprise-grade security built into every layer',
      icon: '🔒'
    },
    {
      title: 'Global Scale',
      description: 'Reach users worldwide with our edge network',
      icon: '🌍'
    },
    {
      title: 'Developer First',
      description: 'Built by developers, for developers',
      icon: '👨‍💻'
    }
  ]

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to help you build, deploy, and scale your applications with confidence.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-primary mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features