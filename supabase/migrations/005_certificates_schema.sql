-- Create certificates table
CREATE TABLE certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    schedule TIMESTAMP WITH TIME ZONE,
    template JSONB NOT NULL DEFAULT '{}',
    recipients JSONB NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
    issued_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_certificates_organization_id ON certificates(organization_id);
CREATE INDEX idx_certificates_status ON certificates(status);
CREATE INDEX idx_certificates_created_at ON certificates(created_at);

-- Enable RLS
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own certificates" ON certificates
    FOR SELECT USING (auth.uid() = organization_id);

CREATE POLICY "Users can insert their own certificates" ON certificates
    FOR INSERT WITH CHECK (auth.uid() = organization_id);

CREATE POLICY "Users can update their own certificates" ON certificates
    FOR UPDATE USING (auth.uid() = organization_id);

CREATE POLICY "Users can delete their own certificates" ON certificates
    FOR DELETE USING (auth.uid() = organization_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON certificates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();