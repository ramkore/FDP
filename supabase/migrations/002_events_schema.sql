-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT CHECK (event_type IN ('online', 'offline', 'hybrid')) DEFAULT 'offline',
  participation_type TEXT CHECK (participation_type IN ('individual', 'team')) DEFAULT 'individual',
  pricing_type TEXT CHECK (pricing_type IN ('free', 'paid')) DEFAULT 'free',
  price DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  registration_start TIMESTAMP WITH TIME ZONE,
  registration_end TIMESTAMP WITH TIME ZONE,
  location TEXT,
  online_link TEXT,
  capacity INTEGER,
  min_team_size INTEGER DEFAULT 1,
  max_team_size INTEGER DEFAULT 1,
  banner_image TEXT,
  status TEXT CHECK (status IN ('draft', 'published', 'cancelled', 'completed')) DEFAULT 'draft',
  registration_form JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event registrations table
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  team_name TEXT,
  form_data JSONB DEFAULT '{}',
  payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT CHECK (status IN ('registered', 'cancelled', 'attended')) DEFAULT 'registered'
);

-- Create indexes
CREATE INDEX idx_events_organization ON events(organization_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_registrations_email ON event_registrations(user_email);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS policies for events
CREATE POLICY "Users can view published events" ON events
  FOR SELECT USING (status = 'published');

CREATE POLICY "Organization owners can manage their events" ON events
  FOR ALL USING (organization_id IN (
    SELECT id FROM organizations WHERE id = auth.uid()
  ));

-- RLS policies for registrations
CREATE POLICY "Users can view their own registrations" ON event_registrations
  FOR SELECT USING (user_email = auth.email());

CREATE POLICY "Organization owners can view their event registrations" ON event_registrations
  FOR SELECT USING (event_id IN (
    SELECT id FROM events WHERE organization_id = auth.uid()
  ));

CREATE POLICY "Anyone can register for events" ON event_registrations
  FOR INSERT WITH CHECK (true);