-- Migration v10: Advanced Ventures & Cap Table
-- 1. Add total_authorized_shares to subsidiaries
ALTER TABLE subsidiaries 
ADD COLUMN IF NOT EXISTS total_authorized_shares bigint DEFAULT 10000000;

-- 2. Add 'type' to transactions to support 'initial_grant'
-- (If type exists, alter check constraint or enum)
-- Checking existing transaction structure... assuming simple text or check.
DO $$ 
BEGIN
    ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_type_check;
    ALTER TABLE transactions ADD CONSTRAINT transactions_type_check 
    CHECK (type IN ('investment', 'payout', 'fee', 'initial_grant', 'employee_pool'));
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- 3. Enhance campaigns for "Pro" rounds
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS closing_date timestamptz,
ADD COLUMN IF NOT EXISTS min_ticket numeric,
ADD COLUMN IF NOT EXISTS max_ticket numeric,
ADD COLUMN IF NOT EXISTS accredited_only boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS terms_link text,
ADD COLUMN IF NOT EXISTS description text;

-- 4. Initial Cap Table Helper
-- We don't need a specific table if we use transactions with 'initial_grant' status/type.
-- But we might want a 'shareholders' view later.
