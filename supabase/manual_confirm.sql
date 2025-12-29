-- Manual User Confirmation Script
-- Use this if "Error sending confirmation email" prevents login.

-- 1. Update the user to be confirmed immediately
-- Replace 'founders@theutilitycompany.co' with the actual email you signed up with
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'founders@theutilitycompany.co';

-- 2. Ensure their profile is created properly as an Admin
INSERT INTO public.profiles (id, email, full_name, role, status)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', 'System Admin'), 
  'admin',
  'approved'
FROM auth.users
WHERE email = 'founders@theutilitycompany.co'
ON CONFLICT (id) DO UPDATE
SET role = 'admin', status = 'approved';
