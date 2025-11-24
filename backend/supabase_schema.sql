-- SAGE Optimizer Database Schema for Supabase
-- Run this in the Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced with Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audits table
CREATE TABLE IF NOT EXISTS audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Reports table (stores high-level scores)
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id UUID UNIQUE REFERENCES audits(id) ON DELETE CASCADE,
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    seo_score INTEGER CHECK (seo_score >= 0 AND seo_score <= 100),
    aeo_score INTEGER CHECK (aeo_score >= 0 AND aeo_score <= 100),
    geo_score INTEGER CHECK (geo_score >= 0 AND geo_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Report items table (stores detailed findings)
CREATE TABLE IF NOT EXISTS report_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('seo', 'aeo', 'geo')),
    check_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pass', 'fail', 'warning')),
    description TEXT,
    recommendation TEXT,
    score_impact INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table (for custom session management)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audits_user_id ON audits(user_id);
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_audit_id ON reports(audit_id);
CREATE INDEX IF NOT EXISTS idx_report_items_report_id ON report_items(report_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
    ON users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Service role can manage all users"
    ON users FOR ALL
    USING (auth.role() = 'service_role');

-- RLS Policies for audits table
CREATE POLICY "Users can view their own audits"
    ON audits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own audits"
    ON audits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all audits"
    ON audits FOR ALL
    USING (auth.role() = 'service_role');

-- RLS Policies for reports table
CREATE POLICY "Users can view reports for their audits"
    ON reports FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM audits
            WHERE audits.id = reports.audit_id
            AND audits.user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage all reports"
    ON reports FOR ALL
    USING (auth.role() = 'service_role');

-- RLS Policies for report_items table
CREATE POLICY "Users can view report items for their audits"
    ON report_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM reports
            JOIN audits ON audits.id = reports.audit_id
            WHERE reports.id = report_items.report_id
            AND audits.user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage all report items"
    ON report_items FOR ALL
    USING (auth.role() = 'service_role');

-- RLS Policies for user_sessions table
CREATE POLICY "Users can view their own sessions"
    ON user_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all sessions"
    ON user_sessions FOR ALL
    USING (auth.role() = 'service_role');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE users IS 'User profiles synced with Supabase Auth';
COMMENT ON TABLE audits IS 'Audit requests and their status';
COMMENT ON TABLE reports IS 'High-level audit scores and results';
COMMENT ON TABLE report_items IS 'Detailed findings for each audit category';
COMMENT ON TABLE user_sessions IS 'Custom session tokens for authentication';
