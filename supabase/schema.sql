-- Create a table for public profiles (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  role text default 'investor', -- 'investor' or 'admin'
  company_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- INVESTOR PORTAL TABLES

-- Table for Investments/Holdings
create table investments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  asset_name text not null, -- e.g., "Seed Round A", "Utility Token"
  amount_invested numeric,
  current_value numeric,
  status text default 'active', -- 'active', 'pending', 'exited'
  invested_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table investments enable row level security;

-- Investors can see their own investments
create policy "Investors can view own investments" on investments
  for select using (auth.uid() = user_id);

-- Admins can view all (requires admin check logic, simplified here for now)
-- ideally: OR exists (select 1 from profiles where id = auth.uid() and role = 'admin')


-- Table for Documents (Reports, K-1s, etc.)
create table documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id), -- User this document belongs to (null if public/general)
  title text not null,
  file_url text not null,
  doc_type text, -- 'report', 'contract', 'tax'
  uploaded_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table documents enable row level security;

create policy "Users can view assigned documents" on documents
  for select using (auth.uid() = user_id or user_id is null);

-- MANAGEMENT PORTAL TABLES

-- Table for Fundraising Campaigns
create table campaigns (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  target_amount numeric,
  min_investment numeric default 0,
  raised_amount numeric default 0,
  status text default 'draft', -- 'draft', 'active', 'closed'
  description text,
  terms_url text, -- Link to deal terms/memo
  start_date date,
  end_date date,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table campaigns enable row level security;
-- Policies would restrict modification to admins only

-- FINANCIAL INFRASTRUCTURE

-- Table for Transactions (Wires, Crypto)
create table transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  campaign_id uuid references campaigns(id), -- Optional: Link to specific campaign
  amount numeric not null,
  currency text not null default 'USD', -- 'USD', 'ETH', 'USDC'
  status text default 'pending', -- 'pending', 'completed', 'failed', 'cancelled'
  type text not null, -- 'investment', 'deposit', 'withdrawal'
  provider text, -- 'thirdweb', 'mercury', 'wire'
  provider_ref text, -- Transaction Hash or Wire Reference ID
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table transactions enable row level security;
create policy "Users can view own transactions" on transactions
  for select using (auth.uid() = user_id);

-- Table for Company Bank Accounts (Wire Instructions)
create table bank_accounts (
  id uuid default uuid_generate_v4() primary key,
  bank_name text not null,
  account_number text not null, -- Encrypted or partial in real prod, simplified here
  routing_number text,
  swift_code text,
  beneficiary_name text not null,
  beneficiary_address text,
  currency text default 'USD',
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table bank_accounts enable row level security;
create policy "Everyone can view active bank accounts" on bank_accounts
  for select using (is_active = true);
