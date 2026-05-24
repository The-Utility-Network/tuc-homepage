-- Personnel subsidiary_id scoping migration patch
-- Run this script in your Supabase SQL editor to update existing board_members and officers tables

ALTER TABLE board_members 
ADD COLUMN IF NOT EXISTS subsidiary_id TEXT REFERENCES subsidiaries(id) ON DELETE CASCADE;

ALTER TABLE officers 
ADD COLUMN IF NOT EXISTS subsidiary_id TEXT REFERENCES subsidiaries(id) ON DELETE CASCADE;
