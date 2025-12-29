-- Migration V9: Advanced Ventures Support
-- Adds capability for Equity/SAFE distinctions, share tracking, and pending transaction workflows.

-- 1. Update Campaigns for Round Structure
alter table campaigns
add column if not exists round_type text default 'SAFE', -- 'SAFE', 'Equity', 'Token', 'Note'
add column if not exists share_price numeric, -- For Equity rounds
add column if not exists authorized_shares bigint, -- Total shares authorized for this round/class
add column if not exists pre_money_valuation numeric, -- Precise pre-money
add column if not exists post_money_valuation numeric, -- Calculated or fixed post-money
add column if not exists terms_link text; -- URL to PDF/Doc

-- 2. Update Transactions for Workflow & Equity
alter table transactions
add column if not exists modification_timestamp timestamptz default now(),
add column if not exists share_count numeric, -- Number of shares/tokens purchased
add column if not exists notes text, -- Admin notes
add column if not exists transaction_hash text; -- For on-chain proof if needed

-- Make sure status is useful (already exists, but we standardize comments)
comment on column transactions.status is 'Workflow status: pending (User Committed), processing (Wire Sent), completed (Funds Received/Admin Approved), cancelled.';
comment on column campaigns.round_type is 'Type of fundraising instrument: SAFE, Equity, Token, Note.';

-- 3. Create a View or Function for Cap Table (Optional, but useful for quick stats)
-- We can stay with raw queries for now for flexibility.
