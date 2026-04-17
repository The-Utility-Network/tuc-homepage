-- ============================================
-- Add Corporate Structure Fields to Subsidiaries
-- ============================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subsidiaries' AND column_name='ein') THEN
        ALTER TABLE subsidiaries ADD COLUMN ein TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subsidiaries' AND column_name='entity_type') THEN
        ALTER TABLE subsidiaries ADD COLUMN entity_type TEXT DEFAULT 'C-Corp' CHECK (entity_type IN ('LLC', 'C-Corp', 'S-Corp'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subsidiaries' AND column_name='incorporation_state') THEN
        ALTER TABLE subsidiaries ADD COLUMN incorporation_state TEXT DEFAULT 'Delaware';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subsidiaries' AND column_name='incorporation_date') THEN
        ALTER TABLE subsidiaries ADD COLUMN incorporation_date DATE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subsidiaries' AND column_name='legal_address') THEN
        ALTER TABLE subsidiaries ADD COLUMN legal_address TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subsidiaries' AND column_name='total_authorized_shares') THEN
        ALTER TABLE subsidiaries ADD COLUMN total_authorized_shares BIGINT DEFAULT 10000000;
    END IF;
END $$;
