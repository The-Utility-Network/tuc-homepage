-- Activity Tracking System for Complete Visibility
-- Tracks all user and system activities for admin oversight

CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Who
    user_id UUID REFERENCES auth.users(id),
    actor_email TEXT,
    actor_role TEXT, -- 'investor', 'admin', 'super_admin', 'system'
    
    -- What
    activity_type TEXT NOT NULL, -- 'login', 'document_view', 'investment', 'vote', 'upload', etc.
    activity_category TEXT, -- 'authentication', 'investment', 'compliance', 'governance', 'data_room'
    action TEXT NOT NULL, -- 'created', 'viewed', 'updated', 'deleted', 'downloaded', 'signed'
    
    -- Where
    resource_type TEXT, -- 'campaign', 'document', 'proposal', 'data_room_file', etc.
    resource_id UUID,
    resource_name TEXT,
    
    -- Context
    subsidiary_id TEXT REFERENCES subsidiaries(id),
    campaign_id UUID REFERENCES fundraising_campaigns(id),
    
    -- Details
    description TEXT,
    metadata JSONB, -- Flexible field for additional context
    
    -- Technical
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    
    -- Status
    status TEXT DEFAULT 'success', -- 'success', 'failed', 'pending'
    error_message TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_activity_user ON activity_log(user_id);
CREATE INDEX idx_activity_subsidiary ON activity_log(subsidiary_id);
CREATE INDEX idx_activity_campaign ON activity_log(campaign_id);
CREATE INDEX idx_activity_type ON activity_log(activity_type);
CREATE INDEX idx_activity_category ON activity_log(activity_category);
CREATE INDEX idx_activity_created ON activity_log(created_at DESC);
CREATE INDEX idx_activity_resource ON activity_log(resource_type, resource_id);

-- Composite index for admin queries
CREATE INDEX idx_activity_admin_view ON activity_log(subsidiary_id, created_at DESC) 
    WHERE subsidiary_id IS NOT NULL;

-- RLS Policies
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Super admins see everything
CREATE POLICY "Super admins view all activities"
    ON activity_log FOR SELECT
    USING (is_super_admin());

-- Subsidiary admins see their subsidiary's activities
CREATE POLICY "Subsidiary admins view their activities"
    ON activity_log FOR SELECT
    USING (
        subsidiary_id IS NOT NULL 
        AND is_subsidiary_admin(auth.uid(), subsidiary_id)
    );

-- Users see their own activities
CREATE POLICY "Users view own activities"
    ON activity_log FOR SELECT
    USING (user_id = auth.uid());

-- System can insert activities
CREATE POLICY "System can log activities"
    ON activity_log FOR INSERT
    WITH CHECK (true);

-- Helper function to log activity
CREATE OR REPLACE FUNCTION log_activity(
    p_user_id UUID,
    p_activity_type TEXT,
    p_action TEXT,
    p_resource_type TEXT DEFAULT NULL,
    p_resource_id UUID DEFAULT NULL,
    p_resource_name TEXT DEFAULT NULL,
    p_subsidiary_id TEXT DEFAULT NULL,
    p_campaign_id UUID DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_activity_id UUID;
    v_user_email TEXT;
    v_user_role TEXT;
    v_category TEXT;
BEGIN
    -- Get user info
    SELECT email INTO v_user_email
    FROM auth.users
    WHERE id = p_user_id;
    
    -- Determine role
    IF is_super_admin() THEN
        v_user_role := 'super_admin';
    ELSIF p_subsidiary_id IS NOT NULL AND is_subsidiary_admin(p_user_id, p_subsidiary_id) THEN
        v_user_role := 'admin';
    ELSE
        v_user_role := 'investor';
    END IF;
    
    -- Determine category from activity type
    v_category := CASE 
        WHEN p_activity_type IN ('login', 'logout', 'password_reset') THEN 'authentication'
        WHEN p_activity_type IN ('commitment_created', 'investment_completed', 'wire_received') THEN 'investment'
        WHEN p_activity_type IN ('form_d_filed', 'compliance_task_completed') THEN 'compliance'
        WHEN p_activity_type IN ('proposal_created', 'vote_cast', 'proposal_executed') THEN 'governance'
        WHEN p_activity_type IN ('document_viewed', 'document_downloaded', 'data_room_access') THEN 'data_room'
        WHEN p_activity_type IN ('update_sent', 'email_opened', 'email_clicked') THEN 'communications'
        ELSE 'other'
    END;
    
    INSERT INTO activity_log (
        user_id,
        actor_email,
        actor_role,
        activity_type,
        activity_category,
        action,
        resource_type,
        resource_id,
        resource_name,
        subsidiary_id,
        campaign_id,
        description,
        metadata
    ) VALUES (
        p_user_id,
        v_user_email,
        v_user_role,
        p_activity_type,
        v_category,
        p_action,
        p_resource_type,
        p_resource_id,
        p_resource_name,
        p_subsidiary_id,
        p_campaign_id,
        p_description,
        p_metadata
    ) RETURNING id INTO v_activity_id;
    
    RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Activity summary view for admins
CREATE OR REPLACE VIEW activity_summary AS
SELECT 
    DATE(created_at) as activity_date,
    subsidiary_id,
    activity_category,
    activity_type,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT CASE WHEN status = 'failed' THEN id END) as failed_count
FROM activity_log
GROUP BY DATE(created_at), subsidiary_id, activity_category, activity_type;

-- Investor activity summary for admin view
CREATE OR REPLACE VIEW investor_activity_summary AS
SELECT 
    user_id,
    actor_email,
    subsidiary_id,
    COUNT(*) as total_activities,
    COUNT(DISTINCT activity_category) as categories_active,
    MAX(created_at) as last_activity,
    COUNT(DISTINCT DATE(created_at)) as active_days,
    SUM(CASE WHEN activity_category = 'investment' THEN 1 ELSE 0 END) as investment_activities,
    SUM(CASE WHEN activity_category = 'data_room' THEN 1 ELSE 0 END) as data_room_activities,
    SUM(CASE WHEN activity_category = 'governance' THEN 1 ELSE 0 END) as governance_activities
FROM activity_log
WHERE user_id IS NOT NULL
GROUP BY user_id, actor_email, subsidiary_id;

COMMENT ON TABLE activity_log IS 'Comprehensive activity tracking for all user and system actions';
COMMENT ON FUNCTION log_activity IS 'Helper function to log user activities with automatic categorization';
COMMENT ON VIEW activity_summary IS 'Daily activity summary grouped by category and type';
COMMENT ON VIEW investor_activity_summary IS 'Per-investor activity summary for admin oversight';
