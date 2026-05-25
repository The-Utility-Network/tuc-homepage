-- Fix permission denied on auth.users for cap_table_invites
-- Run this in your Supabase SQL editor to resolve the "permission denied for table users" error

-- 1. Recreate the SELECT policy to use JWT metadata rather than querying auth.users directly
DROP POLICY IF EXISTS "Users can view their own invites" ON cap_table_invites;

CREATE POLICY "Users can view their own invites"
    ON cap_table_invites FOR SELECT
    USING (
        email = (auth.jwt() ->> 'email')
    );

-- 2. Recreate the accept_cap_table_invite helper function to avoid querying auth.users
CREATE OR REPLACE FUNCTION accept_cap_table_invite(p_token UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_invite RECORD;
    v_user_email TEXT;
    v_user_id UUID;
BEGIN
    -- Get current user ID
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    
    -- Get user email from secure JWT claims instead of direct SELECT
    v_user_email := auth.jwt() ->> 'email';
    
    -- Find active invite
    SELECT * INTO v_invite FROM cap_table_invites 
    WHERE token = p_token 
    AND status = 'pending'
    AND expires_at > NOW();
    
    IF v_invite IS NULL THEN
        RAISE EXCEPTION 'Invalid or expired invite';
    END IF;
    
    -- Create cap table entry
    INSERT INTO cap_table (user_id, subsidiary_id, shares, share_class, ownership_percentage)
    VALUES (
        v_user_id, 
        v_invite.subsidiary_id, 
        v_invite.shares, 
        v_invite.share_class,
        0
    );
    
    -- Update invite status to accepted
    UPDATE cap_table_invites 
    SET status = 'accepted',
        accepted_at = NOW()
    WHERE id = v_invite.id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
