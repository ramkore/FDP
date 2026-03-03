import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import CTA from './components/CTA'
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

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="events" element={<Events />} />
          <Route path="campaign" element={<Campaign />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="site" element={<Site />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/dashboard/events/create" element={<CreateEvent />} />
        <Route path="/dashboard/events/edit/:eventId" element={<EditEvent />} />
        <Route path="/dashboard/manage/:eventId" element={<ManageEvent />} />
        <Route path="/dashboard/campaign/create" element={<CreateCampaign />} />
        <Route path="/dashboard/certificates/create" element={<CreateCertificate />} />
        <Route path="/dashboard/site/builder" element={<SiteBuilder />} />
        <Route path="/dashboard/settings/profile" element={<Profile />} />
        <Route path="/dashboard/settings/help" element={<Help />} />
        <Route path="/dashboard/settings/terms" element={<Terms />} />
        <Route path="/dashboard/settings/pricing" element={<PricingSettings />} />

        <Route path="/events" element={<MainEvents />} />
        <Route path="/:subdomain" element={<SubdomainPage />} />
      </Routes>
    </Router>
  )
}

export default App