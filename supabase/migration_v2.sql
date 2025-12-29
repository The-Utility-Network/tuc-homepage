-- Migration V2: Management Features
-- Run this in Supabase SQL Editor to update your existing tables

-- 1. Update Profiles for Approval Logic
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

-- Auto-approve the first admin (you)
UPDATE profiles SET status = 'approved' WHERE role = 'admin';

-- 2. Update Campaigns for detailed terms
ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS min_investment numeric DEFAULT 0;

ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS terms_url text;

-- 3. (Optional) Create Storage Bucket for Documents if not exists
-- insert into storage.buckets (id, name, public) values ('nexus-docs', 'nexus-docs', false);
