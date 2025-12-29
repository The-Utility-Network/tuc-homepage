-- 1. Sign up a new user via the Nexus Login/Signup page (e.g. admin@theutilitycompany.com)
-- 2. Run this query in the Supabase SQL Editor to promote them to admin

UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@theutilitycompany.com'; -- Replace with your actual email

-- Verify the change
SELECT * FROM profiles WHERE role = 'admin';
