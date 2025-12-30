-- Enterprise Fundraising Operations Platform
-- Fortune 500-grade system for campaign management and investor operations

-- ============================================
-- 1. Fundraising Campaigns
-- ============================================
CREATE TABLE IF NOT EXISTS fundraising_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subsidiary_id TEXT NOT NULL REFERENCES subsidiaries(id) ON DELETE CASCADE,
    
    -- Campaign identity
    name TEXT NOT NULL,
    round_type TEXT NOT NULL CHECK (round_type IN ('pre_seed', 'seed', 'series_a', 'series_b', 'series_c', 'bridge', 'convertible_note', 'safe')),
    tagline TEXT,
    
    -- Financial targets
    target_amount DECIMAL(15,2) NOT NULL,
    min_amount DECIMAL(15,2),
    max_amount DECIMAL(15,2),
    min_investment DECIMAL(15,2) DEFAULT 25000,
    
    -- Valuation & terms
    pre_money_valuation DECIMAL(15,2),
    post_money_valuation DECIMAL(15,2),
    share_price DECIMAL(10,4),
    discount_rate DECIMAL(5,2), -- for SAFEs/convertible notes
    valuation_cap DECIMAL(15,2), -- for SAFEs
    interest_rate DECIMAL(5,2), -- for convertible notes
    
    -- Security details
    security_type TEXT, -- 'common_stock', 'preferred_stock', 'safe', 'convertible_note'
    shares_offered BIGINT,
    
    -- Timeline
    launch_date DATE,
    target_close_date DATE,
    final_close_date DATE,
    extended_close_date DATE,
    
    -- Progress metrics
    total_committed DECIMAL(15,2) DEFAULT 0,
    total_wired DECIMAL(15,2) DEFAULT 0,
    total_closed DECIMAL(15,2) DEFAULT 0,
    number_of_investors INTEGER DEFAULT 0,
    number_of_accredited INTEGER DEFAULT 0,
    
    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closing', 'closed', 'oversubscribed', 'cancelled')),
    visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public', 'invite_only')),
    
    -- Marketing
    pitch_deck_url TEXT,
    video_url TEXT,
    highlights JSONB,
    use_of_funds JSONB,
    
    -- Terms
    terms_url TEXT,
    minimum_hold_period INTEGER, -- months
    liquidity_events JSONB,
    
    -- Team
    primary_contact UUID REFERENCES auth.users(id),
    team_members UUID[],
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campaigns_subsidiary ON fundraising_campaigns(subsidiary_id);
CREATE INDEX idx_campaigns_status ON fundraising_campaigns(status);
CREATE INDEX idx_campaigns_dates ON fundraising_campaigns(launch_date, target_close_date);

-- ============================================
-- 2. Campaign Commitments (Deal Flow)
-- ============================================
CREATE TABLE IF NOT EXISTS campaign_commitments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES fundraising_campaigns(id) ON DELETE CASCADE,
    investor_id UUID NOT NULL REFERENCES auth.users(id),
    
    -- Commitment details
    commitment_amount DECIMAL(15,2) NOT NULL,
    commitment_type TEXT CHECK (commitment_type IN ('soft', 'hard', 'binding')),
    commitment_date TIMESTAMPTZ DEFAULT NOW(),
    
    -- Investment structure
    security_type TEXT,
    number_of_shares BIGINT,
    share_price DECIMAL(10,4),
    
    -- Status tracking
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'documents_sent', 'documents_signed', 'wire_pending', 'wire_received', 'closed', 'cancelled')),
    
    -- Document tracking
    subscription_agreement_sent_at TIMESTAMPTZ,
    subscription_agreement_signed_at TIMESTAMPTZ,
    accreditation_verified_at TIMESTAMPTZ,
    
    -- Wire tracking
    wire_instructions_sent_at TIMESTAMPTZ,
    wire_expected_date DATE,
    wire_received_at TIMESTAMPTZ,
    wire_amount DECIMAL(15,2),
    wire_reference TEXT,
    
    -- Closing
    closed_at TIMESTAMPTZ,
    share_certificate_issued_at TIMESTAMPTZ,
    certificate_number TEXT,
    
    -- Notes
    notes TEXT,
    internal_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_commitments_campaign ON campaign_commitments(campaign_id);
CREATE INDEX idx_commitments_investor ON campaign_commitments(investor_id);
CREATE INDEX idx_commitments_status ON campaign_commitments(status);

-- ============================================
-- 3. Financial Metrics & KPIs
-- ============================================
CREATE TABLE IF NOT EXISTS financial_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subsidiary_id TEXT NOT NULL REFERENCES subsidiaries(id),
    
    -- Period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    period_type TEXT CHECK (period_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'annual')),
    
    -- Revenue metrics
    total_revenue DECIMAL(15,2),
    recurring_revenue DECIMAL(15,2),
    mrr DECIMAL(15,2),
    arr DECIMAL(15,2),
    
    -- Growth metrics
    revenue_growth_rate DECIMAL(5,2), -- %
    user_growth_rate DECIMAL(5,2),
    mrr_growth_rate DECIMAL(5,2),
    
    -- Customer metrics
    total_users INTEGER,
    active_users INTEGER,
    paying_customers INTEGER,
    churned_customers INTEGER,
    churn_rate DECIMAL(5,2),
    
    -- Expense metrics
    total_expenses DECIMAL(15,2),
    operating_expenses DECIMAL(15,2),
    marketing_expenses DECIMAL(15,2),
    rd_expenses DECIMAL(15,2),
    salary_expenses DECIMAL(15,2),
    
    -- Cash metrics
    cash_balance DECIMAL(15,2),
    monthly_burn_rate DECIMAL(15,2),
    runway_months DECIMAL(5,2),
    
    -- Unit economics
    cac DECIMAL(10,2), -- Customer Acquisition Cost
    ltv DECIMAL(10,2), -- Lifetime Value
    ltv_cac_ratio DECIMAL(5,2),
    gross_margin DECIMAL(5,2),
    
    -- Efficiency metrics
    magic_number DECIMAL(5,2), -- (Net New ARR) / (Sales & Marketing Spend)
    rule_of_40 DECIMAL(5,2), -- Growth Rate + Profit Margin
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(subsidiary_id, period_start, period_end)
);

CREATE INDEX idx_financial_snapshots_subsidiary ON financial_snapshots(subsidiary_id);
CREATE INDEX idx_financial_snapshots_period ON financial_snapshots(period_start, period_end);

-- ============================================
-- 4. Custom KPIs
-- ============================================
CREATE TABLE IF NOT EXISTS custom_kpis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subsidiary_id TEXT NOT NULL REFERENCES subsidiaries(id),
    
    name TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('revenue', 'growth', 'efficiency', 'engagement', 'product', 'custom')),
    
    -- Value tracking
    current_value DECIMAL(15,4),
    target_value DECIMAL(15,4),
    previous_value DECIMAL(15,4),
    
    unit TEXT, -- '$', '%', '#', 'days', 'ratio'
    format TEXT DEFAULT 'number', -- 'number', 'currency', 'percentage', 'duration'
    
    -- Display
    display_order INTEGER,
    is_public BOOLEAN DEFAULT FALSE, -- Show to investors?
    is_headline BOOLEAN DEFAULT FALSE, -- Feature prominently?
    
    -- Trend analysis
    trend TEXT CHECK (trend IN ('up', 'down', 'flat')),
    change_percent DECIMAL(5,2),
    
    -- Update frequency
    update_frequency TEXT CHECK (update_frequency IN ('realtime', 'daily', 'weekly', 'monthly', 'quarterly')),
    last_updated_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_custom_kpis_subsidiary ON custom_kpis(subsidiary_id);

-- ============================================
-- 5. Data Room Structure
-- ============================================
CREATE TABLE IF NOT EXISTS data_room_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subsidiary_id TEXT NOT NULL REFERENCES subsidiaries(id),
    parent_id UUID REFERENCES data_room_folders(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    
    -- Access control
    access_level TEXT DEFAULT 'all_investors' CHECK (access_level IN ('public', 'all_investors', 'accredited_only', 'tier1', 'tier2', 'custom')),
    requires_nda BOOLEAN DEFAULT TRUE,
    
    display_order INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS data_room_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folder_id UUID NOT NULL REFERENCES data_room_folders(id) ON DELETE CASCADE,
    subsidiary_id TEXT NOT NULL REFERENCES subsidiaries(id),
    
    name TEXT NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    file_type TEXT,
    
    -- Versioning
    version INTEGER DEFAULT 1,
    supersedes_id UUID REFERENCES data_room_files(id),
    
    -- Access control
    access_level TEXT DEFAULT 'all_investors',
    requires_nda BOOLEAN DEFAULT TRUE,
    watermark BOOLEAN DEFAULT FALSE,
    
    -- Analytics
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMPTZ,
    
    -- Metadata
    uploaded_by UUID REFERENCES auth.users(id),
    tags TEXT[],
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dataroom_folders_subsidiary ON data_room_folders(subsidiary_id);
CREATE INDEX idx_dataroom_files_folder ON data_room_files(folder_id);

-- ============================================
-- 6. Data Room Access Logs
-- ============================================
CREATE TABLE IF NOT EXISTS data_room_access_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID REFERENCES data_room_files(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    
    action TEXT CHECK (action IN ('view', 'download', 'share')),
    ip_address INET,
    user_agent TEXT,
    
    accessed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dataroom_access_file ON data_room_access_log(file_id);
CREATE INDEX idx_dataroom_access_user ON data_room_access_log(user_id);

-- ============================================
-- 7. Investor Updates
-- ============================================
CREATE TABLE IF NOT EXISTS investor_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subsidiary_id TEXT NOT NULL REFERENCES subsidiaries(id),
    
    update_type TEXT CHECK (update_type IN ('monthly', 'quarterly', 'annual', 'milestone', 'urgent', 'custom')),
    
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    
    -- Highlights
    key_metrics JSONB,
    achievements JSONB,
    challenges JSONB,
    next_steps JSONB,
    
    -- Attachments
    attachments JSONB,
    
    -- Distribution
    recipient_type TEXT CHECK (recipient_type IN ('all_investors', 'accredited_only', 'campaign_specific', 'custom_list')),
    campaign_id UUID REFERENCES fundraising_campaigns(id),
    
    -- Scheduling
    scheduled_send_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    
    -- Analytics
    total_recipients INTEGER,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_investor_updates_subsidiary ON investor_updates(subsidiary_id);

-- ============================================
-- 8. Compliance Tasks
-- ============================================
CREATE TABLE IF NOT EXISTS compliance_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subsidiary_id TEXT NOT NULL REFERENCES subsidiaries(id),
    campaign_id UUID REFERENCES fundraising_campaigns(id),
    
    task_type TEXT CHECK (task_type IN ('form_d', 'blue_sky', 'annual_report', 'tax_filing', 'board_resolution', 'shareholder_notice', 'custom')),
    
    title TEXT NOT NULL,
    description TEXT,
    jurisdiction TEXT, -- 'federal', 'state:NM', 'state:CA'
    
    -- Timeline
    due_date DATE NOT NULL,
    reminder_days_before INTEGER DEFAULT 7,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'filed', 'completed', 'overdue')),
    completed_at TIMESTAMPTZ,
    filed_date DATE,
    
    -- Assignment
    assigned_to UUID REFERENCES auth.users(id),
    priority TEXT CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    
    -- Documentation
    filing_reference TEXT,
    confirmation_number TEXT,
    attachments JSONB,
    
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_compliance_tasks_subsidiary ON compliance_tasks(subsidiary_id);
CREATE INDEX idx_compliance_tasks_due ON compliance_tasks(due_date) WHERE status IN ('pending', 'in_progress');

-- ============================================
-- 9. Row Level Security
-- ============================================

ALTER TABLE fundraising_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_room_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_room_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_room_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_tasks ENABLE ROW LEVEL SECURITY;

-- Campaigns: Public or investor access
CREATE POLICY "Public campaigns visible to all"
    ON fundraising_campaigns FOR SELECT
    USING (visibility = 'public' OR is_super_admin());

CREATE POLICY "Investors can view their campaigns"
    ON fundraising_campaigns FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM campaign_commitments
            WHERE campaign_id = fundraising_campaigns.id
            AND investor_id = auth.uid()
        )
        OR is_subsidiary_admin(auth.uid(), subsidiary_id)
    );

-- Admins can manage campaigns
CREATE POLICY "Admins can manage campaigns"
    ON fundraising_campaigns FOR ALL
    USING (
        is_super_admin() OR
        is_subsidiary_admin(auth.uid(), subsidiary_id)
    );

-- Commitments: Investors see their own
CREATE POLICY "Investors view own commitments"
    ON campaign_commitments FOR SELECT
    USING (investor_id = auth.uid());

CREATE POLICY "Admins manage all commitments"
    ON campaign_commitments FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM fundraising_campaigns
            WHERE id = campaign_commitments.campaign_id
            AND (is_super_admin() OR is_subsidiary_admin(auth.uid(), subsidiary_id))
        )
    );

-- Financial data: Admins and investors with proper access
CREATE POLICY "Admins view financial data"
    ON financial_snapshots FOR SELECT
    USING (
        is_super_admin() OR
        is_subsidiary_admin(auth.uid(), subsidiary_id)
    );

CREATE POLICY "Investors view published metrics"
    ON custom_kpis FOR SELECT
    USING (
        is_public = TRUE OR
        is_super_admin() OR
        is_subsidiary_admin(auth.uid(), subsidiary_id)
    );

-- Data room: NDA-gated access
CREATE POLICY "Accredited investors access data room"
    ON data_room_files FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM investor_profiles ip
            JOIN accreditation_responses ar ON ar.investor_id = ip.id
            WHERE ip.id = auth.uid()
            AND ar.determination IN ('accredited', 'qualified_purchaser')
            AND ar.verified_status = 'verified'
        )
        OR is_super_admin()
        OR is_subsidiary_admin(auth.uid(), subsidiary_id)
    );

-- Admins can manage data room
CREATE POLICY "Admins manage data room"
    ON data_room_files FOR ALL
    USING (
        is_super_admin() OR
        is_subsidiary_admin(auth.uid(), subsidiary_id)
    );

-- Access logs - users can only see their own
CREATE POLICY "Users view own access logs"
    ON data_room_access_log FOR SELECT
    USING (user_id = auth.uid() OR is_super_admin());

CREATE POLICY "System can insert access logs"
    ON data_room_access_log FOR INSERT
    WITH CHECK (true);

-- Updates: Investors receive updates
CREATE POLICY "Investors view updates"
    ON investor_updates FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM campaign_commitments
            WHERE investor_id = auth.uid()
        )
        OR is_super_admin()
    );

-- ============================================
-- 10. Helper Functions
-- ============================================

-- Calculate campaign progress percentage
CREATE OR REPLACE FUNCTION calculate_campaign_progress(p_campaign_id UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    v_campaign RECORD;
    v_progress DECIMAL(5,2);
BEGIN
    SELECT * INTO v_campaign
    FROM fundraising_campaigns
    WHERE id = p_campaign_id;
    
    IF v_campaign.target_amount > 0 THEN
        v_progress := (v_campaign.total_committed / v_campaign.target_amount) * 100;
        RETURN LEAST(v_progress, 100);
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Log data room access
CREATE OR REPLACE FUNCTION log_dataroom_access(
    p_file_id UUID,
    p_action TEXT
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO data_room_access_log (
        file_id,
        user_id,
        action
    ) VALUES (
        p_file_id,
        auth.uid(),
        p_action
    ) RETURNING id INTO v_log_id;
    
    -- Update file analytics
    IF p_action = 'view' THEN
        UPDATE data_room_files
        SET view_count = view_count + 1,
            last_accessed_at = NOW()
        WHERE id = p_file_id;
    ELSIF p_action = 'download' THEN
        UPDATE data_room_files
        SET download_count = download_count + 1
        WHERE id = p_file_id;
    END IF;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 11. Update Triggers
-- ============================================

CREATE TRIGGER update_fundraising_campaigns_updated_at BEFORE UPDATE ON fundraising_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_commitments_updated_at BEFORE UPDATE ON campaign_commitments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_room_files_updated_at BEFORE UPDATE ON data_room_files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_tasks_updated_at BEFORE UPDATE ON compliance_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Complete!
-- ============================================

COMMENT ON TABLE fundraising_campaigns IS 'Enterprise fundraising campaign management';
COMMENT ON TABLE campaign_commitments IS 'Investor commitments and deal flow tracking';
COMMENT ON TABLE financial_snapshots IS 'Time-series financial performance data';
COMMENT ON TABLE custom_kpis IS 'User-defined key performance indicators';
COMMENT ON TABLE data_room_folders IS 'Organized document structure for due diligence';
COMMENT ON TABLE data_room_files IS 'Secure file storage with access analytics';
COMMENT ON TABLE investor_updates IS 'Periodic communications to investor base';
COMMENT ON TABLE compliance_tasks IS 'Regulatory and legal compliance tracking';
