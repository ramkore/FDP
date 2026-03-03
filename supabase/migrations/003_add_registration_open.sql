-- Add registration_open column to events table
ALTER TABLE events ADD COLUMN registration_open BOOLEAN DEFAULT true;

-- Add index for registration_open
CREATE INDEX idx_events_registration_open ON events(registration_open);