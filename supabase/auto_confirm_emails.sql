-- Supabase Email Auto-Confirmation Patch
-- Run this script in your Supabase SQL editor to solve the "Email not confirmed" error globally.

-- 1. Auto-confirm any existing registered users who completed registration but remain unconfirmed
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

-- 2. Create a secure trigger to automatically confirm all future signups/registrations
CREATE OR REPLACE FUNCTION public.auto_confirm_new_user_email()
RETURNS trigger AS $$
BEGIN
  NEW.email_confirmed_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_auto_confirm_new_user_email ON auth.users;
CREATE TRIGGER tr_auto_confirm_new_user_email
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_new_user_email();
