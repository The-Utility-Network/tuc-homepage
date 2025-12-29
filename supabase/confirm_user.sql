-- If you are not receiving emails, you can manually confirm the user:

-- 1. Find the user's ID (or update by email)
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'founders@theutilitycompany.co';

-- 2. Ensure their profile exists (if the trigger missed it due to unconfirmed state)
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, raw_user_meta_data->>'full_name', 'admin'
FROM auth.users
WHERE email = 'founders@theutilitycompany.co'
ON CONFLICT (id) DO UPDATE
SET role = 'admin'; -- Make sure they are admin while we are at it
