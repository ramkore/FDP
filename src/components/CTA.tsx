const CTA = () => {
  return (
    <section className="py-20 px-6 bg-primary">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to get started?
        </h2>
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Join thousands of developers who trust Ezent to power their applications.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-3 bg-white text-primary font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg">
            Start Free Trial
          </button>
          <button className="px-8 py-3 border border-white/30 text-white font-medium rounded-lg hover:border-white transition-colors duration-200">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  )
}

export default CTA