-- Cap Table Governance & Transparency System
-- Run this migration after admin roles migration

-- ============================================
-- 0a. Helper Function Overloads for TEXT compatibility
-- ============================================
-- The admin roles migration defines these with UUID, but subsidiaries use TEXT
-- So we need overloaded versions

CREATE OR REPLACE FUNCTION is_subsidiary_admin(p_user_id UUID, p_subsidiary_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_roles
        WHERE user_id = p_user_id
        AND (
            (role_type = 'super_admin') OR
            (role_type = 'subsidiary_admin' AND subsidiary_id = p_subsidiary_id)
        )
        AND revoked_at IS NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 0b. Cap Table (if not exists)
-- ============================================
-- This table tracks ownership stakes in subsidiaries
CREATE TABLE IF NOT EXISTS cap_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subsidiary_id TEXT NOT NULL REFERENCES subsidiaries(id) ON DELETE CASCADE,
    
    -- Share details
    shares BIGINT NOT NULL DEFAULT 0,
    share_class TEXT DEFAULT 'common',
    ownership_percentage DECIMAL(10,4) DEFAULT 0,
    
    -- Vesting
    vesting_schedule JSONB,
    vested_shares BIGINT DEFAULT 0,
    
    -- Metadata
    acquired_date DATE,
    cost_basis DECIMAL(15,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, subsidiary_id, share_class)
);

CREATE INDEX idx_cap_table_user ON cap_table(user_id);
CREATE INDEX idx_cap_table_subsidiary ON cap_table(subsidiary_id);

-- Enable RLS
ALTER TABLE cap_table ENABLE ROW LEVEL SECURITY;

-- Users can view their own cap table entries
CREATE POLICY "Users can view their own ownership"
    ON cap_table FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can view all cap table entries for their subsidiaries
CREATE POLICY "Admins can view subsidiary cap table"
    ON cap_table FOR SELECT
    USING (
        is_super_admin() OR
        is_subsidiary_admin(auth.uid(), subsidiary_id)
    );

-- Admins can manage cap table
CREATE POLICY "Admins can manage cap table"
    ON cap_table FOR ALL
    USING (
        is_super_admin() OR
        is_subsidiary_admin(auth.uid(), subsidiary_id)
    );

CREATE TRIGGER update_cap_table_updated_at BEFORE UPDATE ON cap_table
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 1. Governance Rules Table (per subsidiary)
-- ============================================
CREATE TABLE IF NOT EXISTS governance_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subsidiary_id TEXT NOT NULL REFERENCES subsidiaries(id) ON DELETE CASCADE,
    rule_type TEXT NOT NULL CHECK (rule_type IN ('share_issuance', 'fundraising', 'equity_grant', 'buyback', 'transfer', 'amendment')),
    
    -- Rule metadata
    title TEXT NOT NULL,
    description TEXT,
    
    -- Voting configuration
    requires_approval BOOLEAN DEFAULT TRUE,
    approval_threshold DECIMAL(5,2) DEFAULT 50.00, -- e.g., 66.67 for 2/3 majority
    vote_weight_type TEXT DEFAULT 'ownership_percentage' CHECK (vote_weight_type IN ('equal', 'ownership_percentage', 'share_class_weighted')),
    
    -- Who can vote
    eligible_voters JSONB DEFAULT '{"all_stakeholders": true}', 
    -- Examples: {"classes": ["common", "preferred"], "min_ownership": 1.0}, {"board_only": true}
    
    -- Timeframes
    voting_period_days INTEGER DEFAULT 7,
    notice_period_days INTEGER DEFAULT 3,
    
    -- Special provisions
    founder_veto BOOLEAN DEFAULT FALSE,
    board_approval_required BOOLEAN DEFAULT FALSE,
    requires_unanimous BOOLEAN DEFAULT FALSE,
    
    -- Exemptions
    exemptions JSONB DEFAULT '{}',
    -- Example: {"esop_grants_under": 1.0, "angel_rounds_under": 100000}
    
    -- Active/inactive
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(subsidiary_id, rule_type)
);

CREATE INDEX idx_governance_rules_subsidiary ON governance_rules(subsidiary_id) WHERE is_active = TRUE;
CREATE INDEX idx_governance_rules_type ON governance_rules(rule_type) WHERE is_active = TRUE;

-- ============================================
-- 2. Proposed Cap Table Changes
-- ============================================
CREATE TABLE IF NOT EXISTS cap_table_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subsidiary_id TEXT NOT NULL REFERENCES subsidiaries(id) ON DELETE CASCADE,
    proposal_type TEXT NOT NULL CHECK (proposal_type IN ('share_issuance', 'fundraising', 'equity_grant', 'buyback', 'transfer', 'amendment', 'conversion')),
    
    -- Proposal details
    title TEXT NOT NULL,
    description TEXT,
    rationale TEXT,
    
    -- Change details (structure varies by type)
    proposed_changes JSONB NOT NULL,
    /* Example for fundraising:
    {
        "round_name": "Series A",
        "amount": 2000000,
        "valuation_pre": 8000000,
        "valuation_post": 10000000,
        "new_shares": 500000,
        "price_per_share": 4.00,
        "investors": [
            {"name": "VC Fund", "investment": 1500000, "shares": 375000}
        ]
    }
    */
    
    -- Impact analysis
    dilution_impact JSONB,
    /* Example:
    {
        "stakeholders": [
            {
                "user_id": "xxx",
                "name": "John Founder",
                "current_shares": 1000000,
                "current_ownership": 40.0,
                "new_ownership": 32.0,
                "dilution_pct": 8.0,
                "dilution_percent_of_original": 20.0
            }
        ]
    }
    */
    
    ownership_before JSONB,
    ownership_after JSONB,
    valuation_impact JSONB,
    
    -- Attachments
    supporting_documents JSONB DEFAULT '[]',
    
    -- Status workflow
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_vote', 'voting', 'approved', 'rejected', 'executed', 'cancelled', 'expired')),
    
    -- Voting period
    vote_start_at TIMESTAMPTZ,
    vote_end_at TIMESTAMPTZ,
    
    -- Vote tallies (percentages or counts based on vote_weight_type)
    votes_for DECIMAL(12,4) DEFAULT 0,
    votes_against DECIMAL(12,4) DEFAULT 0,
    votes_abstain DECIMAL(12,4) DEFAULT 0,
    total_voting_power DECIMAL(12,4),
    
    -- Governance
    governance_rule_id UUID REFERENCES governance_rules(id),
    approval_threshold_used DECIMAL(5,2), -- Snapshot of threshold when proposal created
    requires_unanimous BOOLEAN DEFAULT FALSE,
    
    -- Execution
    executed_at TIMESTAMPTZ,
    executed_by UUID REFERENCES auth.users(id),
    execution_transaction_id TEXT, -- Reference to actual cap table transaction
    execution_notes TEXT,
    
    -- Rejection/cancellation
    rejection_reason TEXT,
    cancelled_reason TEXT,
    
    -- Audit
    proposed_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_proposals_subsidiary ON cap_table_proposals(subsidiary_id);
CREATE INDEX idx_proposals_status ON cap_table_proposals(status);
CREATE INDEX idx_proposals_vote_end ON cap_table_proposals(vote_end_at) WHERE status = 'voting';
CREATE INDEX idx_proposals_proposer ON cap_table_proposals(proposed_by);

-- ============================================
-- 3. Votes on Proposals
-- ============================================
CREATE TABLE IF NOT EXISTS proposal_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID NOT NULL REFERENCES cap_table_proposals(id) ON DELETE CASCADE,
    voter_id UUID NOT NULL REFERENCES auth.users(id),
    
    -- Vote details
    vote_choice TEXT NOT NULL CHECK (vote_choice IN ('for', 'against', 'abstain')),
    vote_weight DECIMAL(12,4) NOT NULL, -- Calculated based on governance rules
    
    -- Voter's ownership at time of vote
    ownership_snapshot JSONB,
    
    -- Required acknowledgments
    understands_dilution BOOLEAN DEFAULT FALSE,
    acknowledged_terms BOOLEAN DEFAULT FALSE,
    reviewed_financials BOOLEAN DEFAULT FALSE,
    signature_data TEXT,
    
    -- Comments/rationale
    rationale TEXT,
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    voted_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(proposal_id, voter_id)
);

CREATE INDEX idx_votes_proposal ON proposal_votes(proposal_id);
CREATE INDEX idx_votes_voter ON proposal_votes(voter_id);
CREATE INDEX idx_votes_choice ON proposal_votes(vote_choice);

-- ============================================
-- 4. Terms & Conditions for Cap Table
-- ============================================
CREATE TABLE IF NOT EXISTS cap_table_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subsidiary_id TEXT REFERENCES subsidiaries(id) ON DELETE CASCADE,
    term_type TEXT NOT NULL CHECK (term_type IN ('general_governance', 'dilution_disclosure', 'voting_rights', 'information_rights', 'transfer_restrictions', 'drag_along', 'tag_along', 'preemptive_rights')),
    
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    version INTEGER DEFAULT 1,
    
    -- Versioning
    effective_date DATE NOT NULL,
    expiration_date DATE,
    supersedes_id UUID REFERENCES cap_table_terms(id),
    
    -- Applicability
    applies_to JSONB DEFAULT '{"all": true}',
    -- Example: {"share_classes": ["common", "preferred"], "min_ownership": 5.0}
    
    requires_acknowledgment BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_terms_subsidiary ON cap_table_terms(subsidiary_id) WHERE is_active = TRUE;
CREATE INDEX idx_terms_type ON cap_table_terms(term_type) WHERE is_active = TRUE;
CREATE INDEX idx_terms_effective ON cap_table_terms(effective_date) WHERE is_active = TRUE;

-- ============================================
-- 5. Acknowledgments of T&Cs
-- ============================================
CREATE TABLE IF NOT EXISTS cap_table_term_acknowledgments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    term_id UUID NOT NULL REFERENCES cap_table_terms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    
    acknowledged_at TIMESTAMPTZ DEFAULT NOW(),
    signature_data TEXT,
    ip_address INET,
    user_agent TEXT,
    
    UNIQUE(term_id, user_id)
);

CREATE INDEX idx_term_acks_term ON cap_table_term_acknowledgments(term_id);
CREATE INDEX idx_term_acks_user ON cap_table_term_acknowledgments(user_id);

-- ============================================
-- 6. Proposal Activity Log
-- ============================================
CREATE TABLE IF NOT EXISTS proposal_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID NOT NULL REFERENCES cap_table_proposals(id) ON DELETE CASCADE,
    
    action_type TEXT NOT NULL CHECK (action_type IN ('created', 'updated', 'vote_started', 'vote_cast', 'approved', 'rejected', 'executed', 'cancelled', 'commented')),
    actor_id UUID REFERENCES auth.users(id),
    
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_proposal_activity_proposal ON proposal_activity_log(proposal_id);
CREATE INDEX idx_proposal_activity_created ON proposal_activity_log(created_at DESC);

-- ============================================
-- 7. Row Level Security
-- ============================================

ALTER TABLE governance_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE cap_table_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cap_table_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE cap_table_term_acknowledgments ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_activity_log ENABLE ROW LEVEL SECURITY;

-- Governance Rules Policies
CREATE POLICY "Stakeholders can view governance rules for their subsidiaries"
    ON governance_rules FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM cap_table
            WHERE subsidiary_id = governance_rules.subsidiary_id
            AND user_id = auth.uid()
        )
        OR
        is_super_admin()
    );

CREATE POLICY "Super admins and subsidiary admins can manage governance rules"
    ON governance_rules FOR ALL
    USING (
        is_super_admin() OR
        is_subsidiary_admin(auth.uid(), subsidiary_id)
    );

-- Proposals Policies
CREATE POLICY "Stakeholders can view proposals for their subsidiaries"
    ON cap_table_proposals FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM cap_table
            WHERE subsidiary_id = cap_table_proposals.subsidiary_id
            AND user_id = auth.uid()
        )
        OR
        is_super_admin()
    );

CREATE POLICY "Admins can create proposals"
    ON cap_table_proposals FOR INSERT
    WITH CHECK (
        is_super_admin() OR
        is_subsidiary_admin(auth.uid(), subsidiary_id)
    );

CREATE POLICY "Proposers and admins can update proposals"
    ON cap_table_proposals FOR UPDATE
    USING (
        proposed_by = auth.uid() OR
        is_super_admin() OR
        is_subsidiary_admin(auth.uid(), subsidiary_id)
    );

-- Votes Policies
CREATE POLICY "Users can view their own votes"
    ON proposal_votes FOR SELECT
    USING (voter_id = auth.uid());

CREATE POLICY "Admins can view all votes"
    ON proposal_votes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM cap_table_proposals p
            WHERE p.id = proposal_votes.proposal_id
            AND (is_super_admin() OR is_subsidiary_admin(auth.uid(), p.subsidiary_id))
        )
    );

CREATE POLICY "Eligible voters can cast votes"
    ON proposal_votes FOR INSERT
    WITH CHECK (voter_id = auth.uid());

-- Terms Policies
CREATE POLICY "Stakeholders can view applicable terms"
    ON cap_table_terms FOR SELECT
    USING (
        (subsidiary_id IS NULL OR
        EXISTS (
            SELECT 1 FROM cap_table
            WHERE subsidiary_id = cap_table_terms.subsidiary_id
            AND user_id = auth.uid()
        ))
        AND is_active = TRUE
    );

CREATE POLICY "Admins can manage terms"
    ON cap_table_terms FOR ALL
    USING (
        is_super_admin() OR
        (subsidiary_id IS NOT NULL AND is_subsidiary_admin(auth.uid(), subsidiary_id))
    );

-- Acknowledgments Policies
CREATE POLICY "Users can view their own acknowledgments"
    ON cap_table_term_acknowledgments FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own acknowledgments"
    ON cap_table_term_acknowledgments FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Activity Log Policies
CREATE POLICY "Stakeholders can view proposal activity"
    ON proposal_activity_log FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM cap_table_proposals p
            JOIN cap_table ct ON ct.subsidiary_id = p.subsidiary_id
            WHERE p.id = proposal_activity_log.proposal_id
            AND ct.user_id = auth.uid()
        )
        OR
        is_super_admin()
    );

CREATE POLICY "System can insert activity logs"
    ON proposal_activity_log FOR INSERT
    WITH CHECK (true);

-- ============================================
-- 8. Helper Functions
-- ============================================

-- Calculate vote weight for a user on a proposal
CREATE OR REPLACE FUNCTION calculate_vote_weight(
    p_proposal_id UUID,
    p_voter_id UUID
)
RETURNS DECIMAL(12,4) AS $$
DECLARE
    v_rule RECORD;
    v_ownership DECIMAL(10,2);
    v_weight DECIMAL(12,4);
BEGIN
    -- Get the governance rule for this proposal
    SELECT gr.* INTO v_rule
    FROM cap_table_proposals p
    JOIN governance_rules gr ON gr.id = p.governance_rule_id
    WHERE p.id = p_proposal_id;
    
    -- Calculate weight based on rule type
    IF v_rule.vote_weight_type = 'equal' THEN
        v_weight := 1.0;
    ELSIF v_rule.vote_weight_type = 'ownership_percentage' THEN
        -- Get user's ownership percentage
        SELECT COALESCE(ownership_percentage, 0) INTO v_ownership
        FROM cap_table
        WHERE user_id = p_voter_id
        AND subsidiary_id = (SELECT subsidiary_id FROM cap_table_proposals WHERE id = p_proposal_id);
        
        v_weight := v_ownership;
    ELSIF v_rule.vote_weight_type = 'share_class_weighted' THEN
        -- For now, use ownership percentage - can be enhanced for class weighting
        SELECT COALESCE(ownership_percentage, 0) INTO v_ownership
        FROM cap_table
        WHERE user_id = p_voter_id
        AND subsidiary_id = (SELECT subsidiary_id FROM cap_table_proposals WHERE id = p_proposal_id);
        
        v_weight := v_ownership;
    ELSE
        v_weight := 1.0;
    END IF;
    
    RETURN v_weight;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if proposal has reached approval threshold
CREATE OR REPLACE FUNCTION is_proposal_approved(p_proposal_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_proposal RECORD;
    v_for_percentage DECIMAL(10,2);
BEGIN
    SELECT * INTO v_proposal
    FROM cap_table_proposals
    WHERE id = p_proposal_id;
    
    -- Check if unanimous required
    IF v_proposal.requires_unanimous AND v_proposal.votes_against > 0 THEN
        RETURN FALSE;
    END IF;
    
    -- Calculate percentage for
    IF v_proposal.total_voting_power > 0 THEN
        v_for_percentage := (v_proposal.votes_for / v_proposal.total_voting_power) * 100;
    ELSE
        RETURN FALSE;
    END IF;
    
    RETURN v_for_percentage >= v_proposal.approval_threshold_used;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Log proposal activity
CREATE OR REPLACE FUNCTION log_proposal_activity(
    p_proposal_id UUID,
    p_action_type TEXT,
    p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO proposal_activity_log (
        proposal_id,
        action_type,
        actor_id,
        details
    ) VALUES (
        p_proposal_id,
        p_action_type,
        auth.uid(),
        p_details
    ) RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 9. Update Triggers
-- ============================================

CREATE TRIGGER update_governance_rules_updated_at BEFORE UPDATE ON governance_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cap_table_proposals_updated_at BEFORE UPDATE ON cap_table_proposals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cap_table_terms_updated_at BEFORE UPDATE ON cap_table_terms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. Default Governance Rules Templates
-- ============================================

-- This will be populated via application code or manual insert
-- Example templates: VC-Standard, Founder-Friendly, Democratic, Board-Controlled

-- ============================================
-- Complete!
-- ============================================

COMMENT ON TABLE governance_rules IS 'Governance rules for cap table changes per subsidiary';
COMMENT ON TABLE cap_table_proposals IS 'Proposed changes to cap table with voting and approval workflow';
COMMENT ON TABLE proposal_votes IS 'Votes cast on cap table proposals with acknowledgments';
COMMENT ON TABLE cap_table_terms IS 'Terms and conditions related to cap table governance';
COMMENT ON TABLE cap_table_term_acknowledgments IS 'User acknowledgments of T&Cs';
COMMENT ON FUNCTION calculate_vote_weight IS 'Calculate voting weight for a user based on governance rules';
COMMENT ON FUNCTION is_proposal_approved IS 'Check if proposal has reached approval threshold';
COMMENT ON FUNCTION log_proposal_activity IS 'Log activity on a proposal for audit trail';
