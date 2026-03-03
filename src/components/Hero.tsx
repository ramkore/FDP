const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
          Build the future with
          <span className="block text-primary">modern solutions</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Streamline your workflow with our cutting-edge platform. Deploy faster, scale effortlessly, and focus on what matters most.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-light transition-colors duration-200 shadow-lg">
            Get Started
          </button>
          <button className="px-8 py-3 border border-gray-300 text-primary font-medium rounded-lg hover:border-primary transition-colors duration-200">
            View Demo
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero