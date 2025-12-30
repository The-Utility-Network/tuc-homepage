-- Legal Documentation & Investor Onboarding Tables
-- Run this migration in your Supabase SQL editor

-- ============================================
-- 1. Generated Documents Table
-- ============================================
CREATE TABLE IF NOT EXISTS generated_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID,
    investor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    campaign_id UUID,
    document_type TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_signature', 'signed', 'executed')),
    pdf_url TEXT,
    html_content TEXT,
    variables_used JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    finalized_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_generated_documents_investor ON generated_documents(investor_id);
CREATE INDEX idx_generated_documents_campaign ON generated_documents(campaign_id);
CREATE INDEX idx_generated_documents_status ON generated_documents(status);

-- ============================================
-- 2. Document Signatures Table
-- ============================================
CREATE TABLE IF NOT EXISTS document_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES generated_documents(id) ON DELETE CASCADE,
    signer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    signer_role TEXT NOT NULL CHECK (signer_role IN ('investor', 'company_representative', 'witness')),
    signature_data TEXT NOT NULL,
    signed_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    consent_text TEXT,
    audit_trail JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_signatures_document ON document_signatures(document_id);
CREATE INDEX idx_signatures_signer ON document_signatures(signer_id);

-- ============================================
-- 3. Accreditation Responses Table
-- ============================================
CREATE TABLE IF NOT EXISTS accreditation_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    investor_type TEXT NOT NULL CHECK (investor_type IN ('individual', 'entity', 'trust')),
    
    -- Individual criteria
    annual_income BIGINT,
    joint_income BIGINT,
    net_worth BIGINT,
    has_series_7 BOOLEAN DEFAULT FALSE,
    has_series_65 BOOLEAN DEFAULT FALSE,
    has_series_82 BOOLEAN DEFAULT FALSE,
    license_type TEXT,
    
    -- Entity criteria
    entity_assets BIGINT,
    all_owners_accredited BOOLEAN DEFAULT FALSE,
    is_501c3 BOOLEAN DEFAULT FALSE,
    
    -- Trust criteria
    trust_assets BIGINT,
    trustor_accredited BOOLEAN DEFAULT FALSE,
    
    -- Full response data
    responses JSONB NOT NULL,
    
    -- Determination
    determination TEXT NOT NULL CHECK (determination IN ('non_accredited', 'accredited', 'qualified_purchaser')),
    determination_reasoning TEXT,
    
    -- Admin review
    admin_override BOOLEAN DEFAULT FALSE,
    admin_override_reason TEXT,
    verified_status TEXT DEFAULT 'pending' CHECK (verified_status IN ('pending', 'verified', 'rejected', 'needs_more_info')),
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_accreditation_investor ON accreditation_responses(investor_id);
CREATE INDEX idx_accreditation_status ON accreditation_responses(verified_status);
CREATE INDEX idx_accreditation_determination ON accreditation_responses(determination);

-- ============================================
-- 4. Verification Documents Table
-- ============================================
CREATE TABLE IF NOT EXISTS verification_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accreditation_id UUID REFERENCES accreditation_responses(id) ON DELETE CASCADE,
    investor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT,
    file_size BIGINT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewer_notes TEXT
);

CREATE INDEX idx_verification_docs_accreditation ON verification_documents(accreditation_id);
CREATE INDEX idx_verification_docs_investor ON verification_documents(investor_id);
CREATE INDEX idx_verification_docs_status ON verification_documents(status);

-- ============================================
-- 5. Update investor_profiles table
-- ============================================
-- Check if investor_profiles table exists, if not create it
CREATE TABLE IF NOT EXISTS investor_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add new columns if they don't exist
DO $$ 
BEGIN
    -- Accreditation fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='investor_profiles' AND column_name='accreditation_status') THEN
        ALTER TABLE investor_profiles ADD COLUMN accreditation_status TEXT DEFAULT 'unknown' CHECK (accreditation_status IN ('unknown', 'non_accredited', 'accredited', 'qualified_purchaser'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='investor_profiles' AND column_name='accreditation_verified_at') THEN
        ALTER TABLE investor_profiles ADD COLUMN accreditation_verified_at TIMESTAMPTZ;
    END IF;
    
    -- Onboarding fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='investor_profiles' AND column_name='onboarding_completed') THEN
        ALTER TABLE investor_profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='investor_profiles' AND column_name='onboarding_step') THEN
        ALTER TABLE investor_profiles ADD COLUMN onboarding_step TEXT DEFAULT 'welcome';
    END IF;
    
    -- Jurisdiction and limits
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='investor_profiles' AND column_name='residence_state') THEN
        ALTER TABLE investor_profiles ADD COLUMN residence_state TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='investor_profiles' AND column_name='residence_country') THEN
        ALTER TABLE investor_profiles ADD COLUMN residence_country TEXT DEFAULT 'United States';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='investor_profiles' AND column_name='is_us_person') THEN
        ALTER TABLE investor_profiles ADD COLUMN is_us_person BOOLEAN DEFAULT TRUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='investor_profiles' AND column_name='investment_limit') THEN
        ALTER TABLE investor_profiles ADD COLUMN investment_limit BIGINT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='investor_profiles' AND column_name='total_invested') THEN
        ALTER TABLE investor_profiles ADD COLUMN total_invested BIGINT DEFAULT 0;
    END IF;
END $$;

-- ============================================
-- 6. Investment Limits Table (State-specific)
-- ============================================
CREATE TABLE IF NOT EXISTS investment_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_code TEXT NOT NULL,
    investor_type TEXT NOT NULL CHECK (investor_type IN ('non_accredited', 'accredited', 'qualified_purchaser')),
    is_domestic BOOLEAN DEFAULT TRUE,
    
    -- Limit calculations
    limit_type TEXT CHECK (limit_type IN ('fixed', 'percentage_income', 'percentage_net_worth', 'unlimited')),
    fixed_amount BIGINT,
    percentage_value DECIMAL(5,2),
    
    -- Description
    description TEXT,
    legal_reference TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(state_code, investor_type, is_domestic)
);

-- Insert New Mexico investment limits
INSERT INTO investment_limits (state_code, investor_type, is_domestic, limit_type, fixed_amount, percentage_value, description, legal_reference)
VALUES
    -- New Mexico Non-Accredited Domestic
    ('NM', 'non_accredited', TRUE, 'percentage_income', NULL, 10.00, 
     'Greater of $5,000 or 10% of annual income or net worth', 
     'New Mexico Securities Act - Intrastate Crowdfunding'),
    
    -- New Mexico Non-Accredited International
    ('NM', 'non_accredited', FALSE, 'percentage_income', NULL, 5.00, 
     'Limited to 5% of annual income or net worth for international non-accredited investors', 
     'New Mexico Securities Act - Regulation D / Regulation S'),
    
    -- New Mexico Accredited Domestic
    ('NM', 'accredited', TRUE, 'unlimited', NULL, NULL, 
     'No investment limit for accredited investors', 
     'SEC Regulation D Rule 506(c)'),
    
    -- New Mexico Accredited International
    ('NM', 'accredited', FALSE, 'unlimited', NULL, NULL, 
     'No investment limit for accredited international investors', 
     'SEC Regulation S / Regulation D Rule 506(c)'),
    
    -- Qualified Purchaser (any jurisdiction)
    ('NM', 'qualified_purchaser', TRUE, 'unlimited', NULL, NULL, 
     'No investment limit for qualified purchasers', 
     'Investment Company Act Section 3(c)(7)'),
    
    ('NM', 'qualified_purchaser', FALSE, 'unlimited', NULL, NULL, 
     'No investment limit for qualified purchasers', 
     'Investment Company Act Section 3(c)(7)')
ON CONFLICT (state_code, investor_type, is_domestic) DO UPDATE SET
    limit_type = EXCLUDED.limit_type,
    fixed_amount = EXCLUDED.fixed_amount,
    percentage_value = EXCLUDED.percentage_value,
    description = EXCLUDED.description,
    legal_reference = EXCLUDED.legal_reference,
    updated_at = NOW();

-- ============================================
-- 7. Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE accreditation_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_limits ENABLE ROW LEVEL SECURITY;

-- Generated Documents Policies
CREATE POLICY "Users can view their own documents"
    ON generated_documents FOR SELECT
    USING (auth.uid() = investor_id);

CREATE POLICY "Users can create their own documents"
    ON generated_documents FOR INSERT
    WITH CHECK (auth.uid() = investor_id);

CREATE POLICY "Users can update their own draft documents"
    ON generated_documents FOR UPDATE
    USING (auth.uid() = investor_id AND status = 'draft');

-- Document Signatures Policies
CREATE POLICY "Users can view signatures on their documents"
    ON document_signatures FOR SELECT
    USING (
        auth.uid() = signer_id OR
        EXISTS (SELECT 1 FROM generated_documents WHERE id = document_id AND investor_id = auth.uid())
    );

CREATE POLICY "Users can create their own signatures"
    ON document_signatures FOR INSERT
    WITH CHECK (auth.uid() = signer_id);

-- Accreditation Responses Policies
CREATE POLICY "Users can view their own accreditation"
    ON accreditation_responses FOR SELECT
    USING (auth.uid() = investor_id);

CREATE POLICY "Users can create their own accreditation"
    ON accreditation_responses FOR INSERT
    WITH CHECK (auth.uid() = investor_id);

CREATE POLICY "Users can update their pending accreditation"
    ON accreditation_responses FOR UPDATE
    USING (auth.uid() = investor_id AND verified_status = 'pending');

-- Verification Documents Policies
CREATE POLICY "Users can view their own verification documents"
    ON verification_documents FOR SELECT
    USING (auth.uid() = investor_id);

CREATE POLICY "Users can upload their own verification documents"
    ON verification_documents FOR INSERT
    WITH CHECK (auth.uid() = investor_id);

-- Investor Profiles Policies
CREATE POLICY "Users can view their own profile"
    ON investor_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON investor_profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON investor_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Investment Limits Policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view investment limits"
    ON investment_limits FOR SELECT
    TO authenticated
    USING (true);

-- ============================================
-- 8. Functions for Investment Limit Calculation
-- ============================================

CREATE OR REPLACE FUNCTION calculate_investment_limit(
    p_investor_id UUID,
    p_annual_income BIGINT DEFAULT NULL,
    p_net_worth BIGINT DEFAULT NULL
)
RETURNS TABLE (
    max_investment BIGINT,
    limit_description TEXT,
    legal_reference TEXT
) AS $$
DECLARE
    v_accreditation_status TEXT;
    v_residence_state TEXT;
    v_is_us_person BOOLEAN;
    v_limit_record RECORD;
    v_calculated_limit BIGINT;
BEGIN
    -- Get investor profile
    SELECT 
        COALESCE(accreditation_status, 'unknown'),
        COALESCE(residence_state, 'NM'),
        COALESCE(is_us_person, TRUE)
    INTO 
        v_accreditation_status,
        v_residence_state,
        v_is_us_person
    FROM investor_profiles
    WHERE id = p_investor_id;
    
    -- If unknown accreditation, treat as non-accredited
    IF v_accreditation_status = 'unknown' THEN
        v_accreditation_status := 'non_accredited';
    END IF;
    
    -- Get applicable limit
    SELECT *
    INTO v_limit_record
    FROM investment_limits
    WHERE state_code = v_residence_state
      AND investor_type = v_accreditation_status
      AND is_domestic = v_is_us_person
    LIMIT 1;
    
    -- Calculate limit based on type
    IF v_limit_record.limit_type = 'unlimited' THEN
        v_calculated_limit := 999999999999; -- Effectively unlimited
    ELSIF v_limit_record.limit_type = 'fixed' THEN
        v_calculated_limit := v_limit_record.fixed_amount;
    ELSIF v_limit_record.limit_type = 'percentage_income' THEN
        -- Use the greater of income or net worth for percentage calculation
        v_calculated_limit := GREATEST(
            5000, -- Minimum $5,000
            COALESCE(p_annual_income, 0) * v_limit_record.percentage_value / 100,
            COALESCE(p_net_worth, 0) * v_limit_record.percentage_value / 100
        );
    ELSIF v_limit_record.limit_type = 'percentage_net_worth' THEN
        v_calculated_limit := GREATEST(
            5000,
            COALESCE(p_net_worth, 0) * v_limit_record.percentage_value / 100
        );
    ELSE
        v_calculated_limit := 5000; -- Default minimum
    END IF;
    
    RETURN QUERY SELECT 
        v_calculated_limit,
        v_limit_record.description,
        v_limit_record.legal_reference;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 9. Triggers for updated_at timestamps
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_generated_documents_updated_at BEFORE UPDATE ON generated_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accreditation_responses_updated_at BEFORE UPDATE ON accreditation_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investor_profiles_updated_at BEFORE UPDATE ON investor_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investment_limits_updated_at BEFORE UPDATE ON investment_limits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. Storage Buckets (Run these in Supabase Storage UI or via SQL)
-- ============================================

-- Note: Storage buckets are typically created via Supabase Dashboard
-- Go to Storage > Create New Bucket and create:
-- 1. 'verification-documents' (private)
-- 2. 'signed-documents' (private)

-- Alternatively, you can create them via SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('verification-documents', 'verification-documents', FALSE),
    ('signed-documents', 'signed-documents', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for verification-documents
CREATE POLICY "Users can upload their own verification documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'verification-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own verification documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'verification-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage policies for signed-documents
CREATE POLICY "Users can view their own signed documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'signed-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "System can create signed documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'signed-documents');

-- ============================================
-- Complete!
-- ============================================

COMMENT ON TABLE generated_documents IS 'Stores generated legal documents for investors';
COMMENT ON TABLE document_signatures IS 'Stores electronic signatures with audit trails';
COMMENT ON TABLE accreditation_responses IS 'Stores investor accreditation questionnaire responses';
COMMENT ON TABLE verification_documents IS 'Stores uploaded verification documents for accreditation';
COMMENT ON TABLE investment_limits IS 'State-specific investment limits based on accreditation status';
COMMENT ON FUNCTION calculate_investment_limit IS 'Calculates maximum investment amount for an investor based on their accreditation and jurisdiction';
