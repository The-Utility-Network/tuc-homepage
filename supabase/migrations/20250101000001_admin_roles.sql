-- Admin Roles & Subsidiary Management
-- Run this migration after the main legal documents migration

-- ============================================
-- 1. Admin Roles Table
-- ============================================
CREATE TABLE IF NOT EXISTS admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_type TEXT NOT NULL CHECK (role_type IN ('super_admin', 'subsidiary_admin')),
    subsidiary_id TEXT REFERENCES subsidiaries(id) ON DELETE CASCADE,
    permissions JSONB DEFAULT '{"data_room": true, "subsidiary_edit": true}',
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Super admin has NULL subsidiary_id (access to all subsidiaries)
-- Subsidiary admin must have specific subsidiary_id
CREATE INDEX idx_admin_roles_user ON admin_roles(user_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_admin_roles_subsidiary ON admin_roles(subsidiary_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_admin_roles_type ON admin_roles(role_type) WHERE revoked_at IS NULL;

-- Add unique constraint (allows multiple roles)
-- Allow user to have super_admin role (subsidiary_id = NULL)
-- AND subsidiary_admin roles for specific subsidiaries
-- But not duplicate roles for same subsidiary
CREATE UNIQUE INDEX idx_admin_roles_unique ON admin_roles(user_id, COALESCE(subsidiary_id, ''::TEXT))
WHERE revoked_at IS NULL;

-- ============================================
-- 2. Update Subsidiaries Table for Data Room
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subsidiaries' AND column_name='data_room_config') THEN
        ALTER TABLE subsidiaries ADD COLUMN data_room_config JSONB DEFAULT '{"enabled": true, "public": false}';
    END IF;
END $$;

-- ============================================
-- 3. Admin Action Audit Log
-- ============================================
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES auth.users(id),
    action_type TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_audit_admin ON admin_audit_log(admin_id);
CREATE INDEX idx_admin_audit_resource ON admin_audit_log(resource_type, resource_id);
CREATE INDEX idx_admin_audit_created ON admin_audit_log(created_at DESC);

-- ============================================
-- 4. Row Level Security for Admin Roles
-- ============================================
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Super admins can view all admin roles
CREATE POLICY "Super admins can view all roles"
    ON admin_roles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_roles ar 
            WHERE ar.user_id = auth.uid() 
            AND ar.role_type = 'super_admin' 
            AND ar.revoked_at IS NULL
        )
    );

-- Super admins can manage all roles
CREATE POLICY "Super admins can manage roles"
    ON admin_roles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_roles ar 
            WHERE ar.user_id = auth.uid() 
            AND ar.role_type = 'super_admin' 
            AND ar.revoked_at IS NULL
        )
    );

-- Users can view their own admin role
CREATE POLICY "Users can view their own role"
    ON admin_roles FOR SELECT
    USING (auth.uid() = user_id);

-- Audit log policies
CREATE POLICY "Super admins can view all audit logs"
    ON admin_audit_log FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_roles ar 
            WHERE ar.user_id = auth.uid() 
            AND ar.role_type = 'super_admin' 
            AND ar.revoked_at IS NULL
        )
    );

CREATE POLICY "Admins can insert audit logs"
    ON admin_audit_log FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_roles ar 
            WHERE ar.user_id = auth.uid() 
            AND ar.revoked_at IS NULL
        )
    );

-- ============================================
-- 5. Helper Functions
-- ============================================

-- Check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_roles
        WHERE user_id = p_user_id
        AND role_type = 'super_admin'
        AND revoked_at IS NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is admin for specific subsidiary
CREATE OR REPLACE FUNCTION is_subsidiary_admin(p_user_id UUID, p_subsidiary_id UUID)
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

-- Get user's managed subsidiaries
CREATE OR REPLACE FUNCTION get_managed_subsidiaries(p_user_id UUID DEFAULT auth.uid())
RETURNS TABLE (subsidiary_id UUID) AS $$
BEGIN
    -- Super admins can manage all subsidiaries
    IF is_super_admin(p_user_id) THEN
        RETURN QUERY SELECT id FROM subsidiaries;
    ELSE
        -- Subsidiary admins only see their assigned subsidiaries
        RETURN QUERY 
        SELECT ar.subsidiary_id 
        FROM admin_roles ar
        WHERE ar.user_id = p_user_id
        AND ar.role_type = 'subsidiary_admin'
        AND ar.revoked_at IS NULL
        AND ar.subsidiary_id IS NOT NULL;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Log admin action
CREATE OR REPLACE FUNCTION log_admin_action(
    p_action_type TEXT,
    p_resource_type TEXT,
    p_resource_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO admin_audit_log (
        admin_id,
        action_type,
        resource_type,
        resource_id,
        details
    ) VALUES (
        auth.uid(),
        p_action_type,
        p_resource_type,
        p_resource_id,
        p_details
    ) RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. Grant Super Admin to Founders Email
-- ============================================

-- This function will grant super admin role to founders@theutilitycompany.co
-- Run after user signs up with this email
CREATE OR REPLACE FUNCTION grant_founder_super_admin()
RETURNS void AS $$
DECLARE
    v_founder_id UUID;
    v_exists BOOLEAN;
BEGIN
    -- Find the founder user by email
    SELECT id INTO v_founder_id
    FROM auth.users
    WHERE email = 'founders@theutilitycompany.co'
    LIMIT 1;
    
    -- If found, grant super admin role (if not already granted)
    IF v_founder_id IS NOT NULL THEN
        -- Check if role already exists
        SELECT EXISTS (
            SELECT 1 FROM admin_roles 
            WHERE user_id = v_founder_id 
            AND role_type = 'super_admin' 
            AND subsidiary_id IS NULL
            AND revoked_at IS NULL
        ) INTO v_exists;
        
        -- Only insert if doesn't exist
        IF NOT v_exists THEN
            INSERT INTO admin_roles (
                user_id,
                role_type,
                subsidiary_id,
                granted_by,
                notes
            ) VALUES (
                v_founder_id,
                'super_admin',
                NULL,
                v_founder_id,
                'Automatic grant for founder account'
            );
            
            RAISE NOTICE 'Super admin role granted to founders@theutilitycompany.co';
        ELSE
            RAISE NOTICE 'Super admin role already exists for founders@theutilitycompany.co';
        END IF;
    ELSE
        RAISE NOTICE 'Founder account not found. Super admin role will be granted on signup.';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Attempt to grant super admin now
SELECT grant_founder_super_admin();

-- ============================================
-- 7. Trigger to Auto-Grant Super Admin on Signup
-- ============================================

-- Create trigger function to auto-grant super admin to founder email
CREATE OR REPLACE FUNCTION auto_grant_founder_admin()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email = 'founders@theutilitycompany.co' THEN
        INSERT INTO admin_roles (
            user_id,
            role_type,
            subsidiary_id,
            granted_by,
            notes
        ) VALUES (
            NEW.id,
            'super_admin',
            NULL,
            NEW.id,
            'Automatic grant for founder account on signup'
        );
        
        RAISE NOTICE 'Super admin role auto-granted to %', NEW.email;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users insert
-- Note: This may need to be created via Supabase Dashboard as auth.users triggers can be restricted
-- DROP TRIGGER IF EXISTS on_auth_user_created_grant_founder_admin ON auth.users;
-- CREATE TRIGGER on_auth_user_created_grant_founder_admin
--     AFTER INSERT ON auth.users
--     FOR EACH ROW
--     EXECUTE FUNCTION auto_grant_founder_admin();

-- ============================================
-- 8. Update Triggers
-- ============================================

CREATE TRIGGER update_admin_roles_updated_at BEFORE UPDATE ON admin_roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Complete!
-- ============================================

COMMENT ON TABLE admin_roles IS 'Admin role assignments for super admins and subsidiary admins';
COMMENT ON TABLE admin_audit_log IS 'Audit trail of all admin actions';
COMMENT ON FUNCTION is_super_admin IS 'Check if user is a super admin';
COMMENT ON FUNCTION is_subsidiary_admin IS 'Check if user is admin for a specific subsidiary';
COMMENT ON FUNCTION get_managed_subsidiaries IS 'Get list of subsidiaries user can manage';
COMMENT ON FUNCTION log_admin_action IS 'Log an admin action to the audit trail';
