import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import CTA from './components/CTA'
import Auth from './auth/Auth'
import VerifyOTP from './auth/VerifyOTP'
import ChooseSubdomain from './auth/ChooseSubdomain'
import SubdomainSuccess from './auth/SubdomainSuccess'
import SubdomainPage from './pages/SubdomainPage'
import DashboardLayout from './components/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import Campaign from './pages/Campaign'
import Certificates from './pages/Certificates'
import Site from './pages/Site'
import Tickets from './pages/Tickets'
import CreateEvent from './components/event/CreateEvent'
import EditEvent from './components/event/EditEvent'
import ManageEvent from './pages/ManageEvent'
import CreateCampaign from './components/campaign/CreateCampaign'
import CreateCertificate from './components/certificate/CreateCertificate'
import SiteBuilder from './components/site/SiteBuilder'
import MainEvents from './pages/MainEvents'
import Settings from './pages/Settings'
import Profile from './pages/settings/Profile'
import Help from './pages/settings/Help'
import Terms from './pages/settings/Terms'
import PricingSettings from './pages/settings/Pricing'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-[#d6d6d6]">
            <Navbar />
            <Hero />
            <Features />
            <CTA />
          </div>
        } />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/choose-subdomain" element={<ChooseSubdomain />} />
        <Route path="/subdomain-success" element={<SubdomainSuccess />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="events" element={<Events />} />
          <Route path="campaign" element={<Campaign />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="site" element={<Site />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/dashboard/events/create" element={
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/events/edit/:eventId" element={
          <ProtectedRoute>
            <EditEvent />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/manage/:eventId" element={
          <ProtectedRoute>
            <ManageEvent />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/campaign/create" element={
          <ProtectedRoute>
            <CreateCampaign />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/certificates/create" element={
          <ProtectedRoute>
            <CreateCertificate />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/site/builder" element={
          <ProtectedRoute>
            <SiteBuilder />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/settings/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/settings/help" element={
          <ProtectedRoute>
            <Help />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/settings/terms" element={
          <ProtectedRoute>
            <Terms />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/settings/pricing" element={
          <ProtectedRoute>
            <PricingSettings />
          </ProtectedRoute>
        } />
        <Route path="/events" element={<MainEvents />} />
        <Route path="/:subdomain" element={<SubdomainPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App