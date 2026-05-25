-- Update the signup trigger function to copy role, status, and requested_role from auth metadata
-- Run this in your Supabase SQL editor to ensure invited directors and officers get the correct platform roles

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role TEXT;
  v_status TEXT;
  v_requested_role TEXT;
BEGIN
  -- Extract platform role and status from raw_user_meta_data, fallback to defaults
  v_role := COALESCE(new.raw_user_meta_data->>'role', 'investor');
  v_status := COALESCE(new.raw_user_meta_data->>'status', 'pending_approval');
  v_requested_role := new.raw_user_meta_data->>'requested_role';

  -- If it's a team/governance invite (role is director/officer/team), bypass pending_approval and approve directly, or let them start as approved
  IF v_role IN ('admin', 'superadmin', 'director', 'officer', 'team') THEN
    v_status := 'approved';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, status, requested_role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    v_role,
    v_status,
    v_requested_role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
