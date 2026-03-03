-- Create sites table
CREATE TABLE sites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'My Site',
    description TEXT DEFAULT 'Welcome to my site',
    subdomain TEXT NOT NULL,
    pages JSONB NOT NULL DEFAULT '[]',
    seo JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    page_views INTEGER DEFAULT 0,
    visitors INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_sites_organization_id ON sites(organization_id);
CREATE INDEX idx_sites_subdomain ON sites(subdomain);
CREATE INDEX idx_sites_status ON sites(status);
CREATE INDEX idx_sites_created_at ON sites(created_at);

-- Note: subdomain comes from organizations table, no unique constraint needed here

-- Enable RLS
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own sites" ON sites
    FOR SELECT USING (auth.uid() = organization_id);

CREATE POLICY "Users can insert their own sites" ON sites
    FOR INSERT WITH CHECK (auth.uid() = organization_id);

CREATE POLICY "Users can update their own sites" ON sites
    FOR UPDATE USING (auth.uid() = organization_id);

CREATE POLICY "Users can delete their own sites" ON sites
    FOR DELETE USING (auth.uid() = organization_id);

-- Create updated_at trigger
CREATE TRIGGER update_sites_updated_at 
    BEFORE UPDATE ON sites 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();