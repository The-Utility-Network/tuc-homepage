-- Personnel subsidiary_id scoping migration patch
-- Run this script in your Supabase SQL editor to update existing board_members and officers tables

ALTER TABLE board_members 
ADD COLUMN IF NOT EXISTS subsidiary_id TEXT REFERENCES subsidiaries(id) ON DELETE CASCADE;

ALTER TABLE officers 
ADD COLUMN IF NOT EXISTS subsidiary_id TEXT REFERENCES subsidiaries(id) ON DELETE CASCADE;

-- Add pertinent user details columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone default timezone('utc'::text, now());
