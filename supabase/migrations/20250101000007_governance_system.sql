-- ============================================================================
-- GOVERNANCE SYSTEM MIGRATION
-- Port of BasaltHQ Nexus governance MongoDB models to Supabase PostgreSQL
-- ============================================================================

-- 1. Board Members (Directors)
CREATE TABLE IF NOT EXISTS board_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    user_id UUID REFERENCES profiles(id),
    subsidiary_id TEXT REFERENCES subsidiaries(id) ON DELETE CASCADE,
    seat_type TEXT DEFAULT 'at_large' CHECK (seat_type IN ('founder', 'at_large', 'observer', 'independent')),
    seat_class TEXT,
    title TEXT,
    committees TEXT[] DEFAULT '{}',
    appointed_by TEXT,
    term_start TIMESTAMPTZ,
    term_end TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    voting_rights BOOLEAN DEFAULT true,
    equity_percentage NUMERIC,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board members viewable by authenticated users" ON board_members FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Board members editable by admins" ON board_members FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- 2. Officers (Corporate Officers)
CREATE TABLE IF NOT EXISTS officers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    user_id UUID REFERENCES profiles(id),
    subsidiary_id TEXT REFERENCES subsidiaries(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    department TEXT,
    appointed_by TEXT DEFAULT 'board',
    appointment_date TIMESTAMPTZ,
    term_end TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    responsibilities TEXT,
    compensation_reference TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE officers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Officers viewable by authenticated users" ON officers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Officers editable by admins" ON officers FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- 3. Board Meetings
CREATE TABLE IF NOT EXISTS board_meetings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    meeting_type TEXT DEFAULT 'regular' CHECK (meeting_type IN ('regular', 'special', 'annual', 'organizational', 'committee')),
    date TIMESTAMPTZ NOT NULL,
    time TEXT,
    location TEXT,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    agenda_items JSONB DEFAULT '[]',
    attendees JSONB DEFAULT '[]',
    quorum_required INTEGER DEFAULT 2,
    quorum_met BOOLEAN DEFAULT false,
    minutes TEXT,
    minutes_approved BOOLEAN DEFAULT false,
    minutes_approved_date TIMESTAMPTZ,
    action_items JSONB DEFAULT '[]',
    attachments JSONB DEFAULT '[]',
    notice_sent_at TIMESTAMPTZ,
    notice_waived BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE board_meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Meetings viewable by authenticated users" ON board_meetings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Meetings editable by admins" ON board_meetings FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- 4. Resolutions (Board & Shareholder)
CREATE TABLE IF NOT EXISTS resolutions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    resolution_number TEXT,
    resolution_type TEXT DEFAULT 'board' CHECK (resolution_type IN ('board', 'written_consent', 'shareholder', 'unanimous_consent')),
    category TEXT DEFAULT 'general',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_vote', 'voting', 'approved', 'rejected', 'withdrawn', 'archived')),
    description TEXT,
    resolved_text TEXT,
    supporting_documents JSONB DEFAULT '[]',
    attachments JSONB DEFAULT '[]',
    requires_unanimous_consent BOOLEAN DEFAULT false,
    requires_board_approval BOOLEAN DEFAULT true,
    requires_shareholder_approval BOOLEAN DEFAULT false,
    debt_amount NUMERIC,
    protected_action_type TEXT,
    votes JSONB DEFAULT '[]',
    approval_threshold NUMERIC DEFAULT 50,
    votes_for INTEGER DEFAULT 0,
    votes_against INTEGER DEFAULT 0,
    votes_abstain INTEGER DEFAULT 0,
    proposed_by TEXT,
    proposed_at TIMESTAMPTZ,
    voting_opens TIMESTAMPTZ,
    voting_closes TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    effective_date TIMESTAMPTZ,
    meeting_id UUID REFERENCES board_meetings(id),
    filed_with_state BOOLEAN DEFAULT false,
    filing_date TIMESTAMPTZ,
    filing_reference TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE resolutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Resolutions viewable by authenticated users" ON resolutions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Resolutions editable by admins" ON resolutions FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- 5. Bylaws (Corporate Charter & Bylaws)
CREATE TABLE IF NOT EXISTS bylaws (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_type TEXT DEFAULT 'bylaws' CHECK (document_type IN ('certificate_of_incorporation', 'bylaws', 'stockholder_agreement', 'voting_agreement', 'rofr_agreement', 'board_policy')),
    article_number TEXT,
    section_number TEXT,
    title TEXT NOT NULL,
    content TEXT,
    is_protected BOOLEAN DEFAULT false,
    protection_type TEXT,
    effective_date TIMESTAMPTZ,
    last_amended TIMESTAMPTZ,
    amendment_history JSONB DEFAULT '[]',
    filed_with_delaware BOOLEAN DEFAULT false,
    delaware_filing_date TIMESTAMPTZ,
    delaware_filing_number TEXT,
    version INTEGER DEFAULT 1,
    is_current BOOLEAN DEFAULT true,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bylaws ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bylaws viewable by authenticated users" ON bylaws FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Bylaws editable by admins" ON bylaws FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- 6. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    recipient_email TEXT NOT NULL,
    type TEXT DEFAULT 'system' CHECK (type IN ('resolution', 'meeting', 'document', 'memo', 'proposal', 'report', 'signature', 'system', 'investor_application', 'accreditation', 'investment', 'welcome', 'message')),
    title TEXT NOT NULL,
    body TEXT,
    link TEXT,
    read BOOLEAN DEFAULT false,
    source_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON notifications FOR SELECT USING (
    recipient_email = (SELECT email FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Users can mark own as read" ON notifications FOR UPDATE USING (
    recipient_email = (SELECT email FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- 7. Signature Requests (Adobe-grade Fill & Sign)
CREATE TABLE IF NOT EXISTS signature_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id TEXT NOT NULL,
    document_title TEXT,
    document_hash TEXT,
    requested_by JSONB NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'in_progress', 'completed', 'declined', 'voided')),
    message TEXT,
    fields JSONB DEFAULT '[]',
    signatories JSONB DEFAULT '[]',
    audit_trail JSONB DEFAULT '[]',
    completed_at TIMESTAMPTZ,
    voided_at TIMESTAMPTZ,
    voided_by TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE signature_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signature requests viewable by authenticated users" ON signature_requests FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Signature requests editable by admins" ON signature_requests FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- 8. Corporate Documents (PDF-based Corporate Filing System)
CREATE TABLE IF NOT EXISTS corporate_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'other' CHECK (category IN ('charter', 'bylaws', 'agreement', 'filing', 'policy', 'resolution', 'financial', 'other')),
    department TEXT,
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    file_type TEXT DEFAULT 'application/pdf',
    uploaded_by TEXT,
    notify_recipients TEXT[] DEFAULT '{}',
    comments JSONB DEFAULT '[]',
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'superseded', 'archived')),
    effective_date TIMESTAMPTZ,
    expiration_date TIMESTAMPTZ,
    version INTEGER DEFAULT 1,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE corporate_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Corporate docs viewable by authenticated users" ON corporate_documents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Corporate docs editable by admins" ON corporate_documents FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- 9. Governance Memos (Memos, Proposals, Reports)
CREATE TABLE IF NOT EXISTS governance_memos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('memo', 'proposal', 'report')),
    department TEXT NOT NULL,
    author_email TEXT,
    author_name TEXT,
    content TEXT,
    summary TEXT,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'published', 'approved', 'rejected', 'archived')),
    notify_recipients TEXT[] DEFAULT '{}',
    notify_all_directors BOOLEAN DEFAULT false,
    notify_all_officers BOOLEAN DEFAULT false,
    notify_departments TEXT[] DEFAULT '{}',
    attachments JSONB DEFAULT '[]',
    requires_response BOOLEAN DEFAULT false,
    response_deadline TIMESTAMPTZ,
    responses JSONB DEFAULT '[]',
    reference_number TEXT,
    related_resolution_id UUID REFERENCES resolutions(id),
    tags TEXT[] DEFAULT '{}',
    messages JSONB DEFAULT '[]',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE governance_memos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Memos viewable by authenticated users" ON governance_memos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Memos editable by admins" ON governance_memos FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- 10. Document Annotations (collaborative per-page highlights/comments on PDFs)
CREATE TABLE IF NOT EXISTS document_annotations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_key TEXT NOT NULL,
    page INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('highlight', 'comment', 'text-highlight')),
    x NUMERIC NOT NULL,
    y NUMERIC NOT NULL,
    width NUMERIC DEFAULT 0,
    height NUMERIC DEFAULT 0,
    rects JSONB DEFAULT '[]',
    text TEXT DEFAULT '',
    user_email TEXT NOT NULL,
    user_name TEXT,
    user_color TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_annotations_document_key ON document_annotations(document_key);

ALTER TABLE document_annotations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Annotations viewable by authenticated users" ON document_annotations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can create annotations" ON document_annotations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can delete own annotations" ON document_annotations FOR DELETE USING (
    user_email = (SELECT email FROM profiles WHERE id = auth.uid())
);

-- 11. User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_email TEXT NOT NULL UNIQUE,
    annotation_color TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_preferences_email ON user_preferences(user_email);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (
    user_email = (SELECT email FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Users can upsert own preferences" ON user_preferences FOR ALL USING (
    user_email = (SELECT email FROM profiles WHERE id = auth.uid())
);

-- 12. Governance Rules
CREATE TABLE IF NOT EXISTS governance_rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    subsidiary_id TEXT,
    rule_type TEXT,
    title TEXT,
    description TEXT,
    requires_approval BOOLEAN,
    approval_threshold NUMERIC,
    vote_weight_type TEXT,
    eligible_voters TEXT[] DEFAULT '{}',
    voting_period_days INTEGER,
    notice_period_days INTEGER,
    founder_veto BOOLEAN,
    board_approval_required BOOLEAN,
    requires_unanimous BOOLEAN,
    exemptions TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE governance_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Rules viewable by authenticated users" ON governance_rules FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Rules editable by admins" ON governance_rules FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- 13. Compliance Tasks
CREATE TABLE IF NOT EXISTS compliance_tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    subsidiary_id TEXT,
    title TEXT,
    description TEXT,
    task_type TEXT,
    jurisdiction TEXT,
    due_date TEXT,
    status TEXT DEFAULT 'pending',
    priority TEXT,
    filing_reference TEXT,
    assigned_to TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE compliance_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Compliance viewable by authenticated users" ON compliance_tasks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Compliance editable by admins" ON compliance_tasks FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- 14. Add status & requested_role columns to profiles (for approval gating)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'status') THEN
        ALTER TABLE profiles ADD COLUMN status TEXT DEFAULT 'approved';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'requested_role') THEN
        ALTER TABLE profiles ADD COLUMN requested_role TEXT;
    END IF;
END $$;

-- 15. Financial Snapshots (may already exist, use IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS financial_snapshots (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    subsidiary_id TEXT,
    period_start TEXT,
    period_end TEXT,
    total_revenue NUMERIC,
    mrr NUMERIC,
    arr NUMERIC,
    revenue_growth_rate NUMERIC,
    total_expenses NUMERIC,
    cash_balance NUMERIC,
    monthly_burn_rate NUMERIC,
    runway_months NUMERIC,
    total_users INTEGER,
    paying_customers INTEGER,
    cac NUMERIC,
    ltv NUMERIC,
    ltv_cac_ratio NUMERIC,
    rule_of_40 NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE financial_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Financials viewable by authenticated users" ON financial_snapshots FOR SELECT USING (auth.role() = 'authenticated');
