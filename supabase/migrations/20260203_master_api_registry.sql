-- ARCHITECTURAL MIGRATION: MASTER API REGISTRY & SYSTEM MONITORING
-- -------------------------------------------------------------

-- 1. Enable pgcrypto for AES-256 Symmetric Encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Master API Credentials Table
-- Stores sensitive keys for the "Sandwich Architecture" (Master App Layer)
CREATE TABLE IF NOT EXISTS master_api_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL CHECK (provider IN ('Meta', 'Google', 'Stripe', 'TikTok')),
    client_id TEXT NOT NULL,
    client_secret TEXT NOT NULL, -- To be encrypted via pgp_sym_encrypt in the Logic layer
    status TEXT NOT NULL DEFAULT 'Testing' CHECK (status IN ('Active', 'Revoked', 'Testing')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. System Logs Table (Real-time enabled)
-- For the "God Mode" Sidebar Signal Monitor
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('info', 'warning', 'error', 'critical')),
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Security (Row Level Security)
ALTER TABLE master_api_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only Admins can access Master Credentials
CREATE POLICY "Admins full access on master_api_credentials"
ON master_api_credentials FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy: Admins can see all logs, Vendors only see their own (if scoped)
-- For now, focused on System-wide Admin logs
CREATE POLICY "Admins can view all system logs"
ON system_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 5. Automations
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_master_api_credentials_modtime
    BEFORE UPDATE ON master_api_credentials
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Enable Realtime for Logs
ALTER PUBLICATION supabase_realtime ADD TABLE system_logs;
