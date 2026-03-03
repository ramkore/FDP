-- Create campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('email', 'sms', 'whatsapp')) NOT NULL,
  schedule TIMESTAMP WITH TIME ZONE,
  template JSONB NOT NULL DEFAULT '{}',
  contacts JSONB NOT NULL DEFAULT '[]',
  status TEXT CHECK (status IN ('draft', 'scheduled', 'sent', 'failed')) DEFAULT 'draft',
  sent_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaign logs table for tracking
CREATE TABLE campaign_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_email TEXT NOT NULL,
  status TEXT CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'failed')) NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_campaigns_organization ON campaigns(organization_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_schedule ON campaigns(schedule);
CREATE INDEX idx_campaign_logs_campaign ON campaign_logs(campaign_id);
CREATE INDEX idx_campaign_logs_email ON campaign_logs(contact_email);

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for campaigns
CREATE POLICY "Organization owners can manage their campaigns" ON campaigns
  FOR ALL USING (organization_id = auth.uid());

-- RLS policies for campaign logs
CREATE POLICY "Organization owners can view their campaign logs" ON campaign_logs
  FOR SELECT USING (campaign_id IN (
    SELECT id FROM campaigns WHERE organization_id = auth.uid()
  ));