-- Cap Table Invites System
-- Tracks invitations for external users to join a subsidiary's cap table

CREATE TABLE IF NOT EXISTS cap_table_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subsidiary_id TEXT NOT NULL REFERENCES subsidiaries(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    
    -- Share details
    shares BIGINT NOT NULL,
    role TEXT DEFAULT 'Investor', -- Investor, Advisor, Employee, etc.
    share_class TEXT DEFAULT 'common',
    
    -- Invitation status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
    token UUID DEFAULT gen_random_uuid(), -- For secure invite links
    
    -- Audit
    invited_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    accepted_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    
    -- Prevent duplicate pending invites for same email/subsidiary
    UNIQUE(subsidiary_id, email, status)
);

CREATE INDEX idx_invites_email ON cap_table_invites(email);
CREATE INDEX idx_invites_subsidiary ON cap_table_invites(subsidiary_id);
CREATE INDEX idx_invites_token ON cap_table_invites(token);

-- RLS Policies
ALTER TABLE cap_table_invites ENABLE ROW LEVEL SECURITY;

-- Admins can view and manage invites for their subsidiaries
CREATE POLICY "Admins can manage invites"
    ON cap_table_invites FOR ALL
    USING (
        is_super_admin() OR
        is_subsidiary_admin(auth.uid(), subsidiary_id)
    );

-- Users can view invites sent to their email (if they are logged in)
-- Note: This relies on the user's email matching.
CREATE POLICY "Users can view their own invites"
    ON cap_table_invites FOR SELECT
    USING (
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

-- Helper function to accept invite
CREATE OR REPLACE FUNCTION accept_cap_table_invite(p_token UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_invite RECORD;
    v_user_email TEXT;
    v_user_id UUID;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    
    -- Get user email
    SELECT email INTO v_user_email FROM auth.users WHERE id = v_user_id;
    
    -- Find invite
    SELECT * INTO v_invite FROM cap_table_invites 
    WHERE token = p_token 
    AND status = 'pending'
    AND expires_at > NOW();
    
    IF v_invite IS NULL THEN
        RAISE EXCEPTION 'Invalid or expired invite';
    END IF;
    
    -- Verify email matches (optional, but good security)
    -- IF v_invite.email <> v_user_email THEN
    --    RAISE EXCEPTION 'This invite is for a different email address';
    -- END IF;
    
    -- Create cap table entry
    INSERT INTO cap_table (user_id, subsidiary_id, shares, share_class, ownership_percentage)
    VALUES (
        v_user_id, 
        v_invite.subsidiary_id, 
        v_invite.shares, 
        v_invite.share_class,
        0 -- Will be recalculated by trigger/job or manual
    )
    ON CONFLICT (user_id, subsidiary_id, share_class) 
    DO UPDATE SET shares = cap_table.shares + excluded.shares;
    
    -- Update invite status
    UPDATE cap_table_invites 
    SET status = 'accepted', accepted_at = NOW()
    WHERE id = v_invite.id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
