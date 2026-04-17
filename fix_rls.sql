-- 1. Create a security definer function to check commitments
CREATE OR REPLACE FUNCTION user_has_committed_to_campaign(check_campaign_id UUID, check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM campaign_commitments 
        WHERE campaign_id = check_campaign_id 
        AND investor_id = check_user_id
    );
$$;

-- 2. Drop the old recursive policy on fundraising_campaigns
DROP POLICY IF EXISTS "Investors can view their campaigns" ON fundraising_campaigns;

-- 3. Recreate it using the new bypass function
CREATE POLICY "Investors can view their campaigns"
    ON fundraising_campaigns FOR SELECT
    USING (
        user_has_committed_to_campaign(id, auth.uid())
        OR is_subsidiary_admin(auth.uid(), subsidiary_id)
    );
