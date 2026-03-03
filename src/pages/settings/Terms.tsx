import { Link } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'

const Terms = () => {
  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center mb-8">
          <Link to="/dashboard/settings" className="mr-4 text-gray-400 hover:text-gray-600">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Terms & Conditions</h1>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Terms of Service</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">Last updated: March 2024</p>
          </div>
          
          <div className="p-6 space-y-6">
            <section>
              <h3 className="text-md font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                By accessing and using Ezent's services, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h3 className="text-md font-semibold text-gray-900 mb-3">2. Service Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ezent provides an event management platform that allows organizations to create, manage, and promote events. 
                Our services include event creation tools, registration management, and subdomain hosting for event pages.
              </p>
            </section>

            <section>
              <h3 className="text-md font-semibold text-gray-900 mb-3">3. User Responsibilities</h3>
              <ul className="text-sm text-gray-600 leading-relaxed space-y-2">
                <li>• You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>• You agree to provide accurate and complete information when creating events</li>
                <li>• You will not use the service for any unlawful or prohibited activities</li>
                <li>• You are responsible for all content posted through your account</li>
              </ul>
            </section>

            <section>
              <h3 className="text-md font-semibold text-gray-900 mb-3">4. Privacy Policy</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We are committed to protecting your privacy. Our Privacy Policy explains how we collect, use, and protect 
                your information when you use our services. By using Ezent, you consent to the collection and use of 
                information in accordance with our Privacy Policy.
              </p>
            </section>

            <section>
              <h3 className="text-md font-semibold text-gray-900 mb-3">5. Payment Terms</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable except 
                as required by law. We reserve the right to change our pricing with 30 days notice.
              </p>
            </section>

            <section>
              <h3 className="text-md font-semibold text-gray-900 mb-3">6. Limitation of Liability</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ezent shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h3 className="text-md font-semibold text-gray-900 mb-3">7. Termination</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason 
                whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section>
              <h3 className="text-md font-semibold text-gray-900 mb-3">8. Contact Information</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                If you have any questions about these Terms & Conditions, please contact us at:
                <br />
                Email: legal@ezent.me
                <br />
                Address: 123 Business St, Suite 100, City, State 12345
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Terms