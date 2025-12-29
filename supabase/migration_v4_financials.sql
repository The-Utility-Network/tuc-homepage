-- Migration V4: Financial Infrastructure
-- Adds the transactions table which was missing from the live instance

create table if not exists transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  campaign_id uuid references campaigns(id),
  amount numeric not null,
  currency text not null default 'USD', -- 'USD', 'ETH', 'USDC'
  status text default 'pending', -- 'pending', 'completed', 'failed'
  type text not null, -- 'investment', 'deposit', 'withdrawal'
  provider text, -- 'thirdweb', 'mercury', 'wire'
  hash text, -- Transaction Hash
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table transactions enable row level security;

-- Policy: Users can view their own transactions
create policy "Users can view own transactions" on transactions
  for select using (auth.uid() = user_id);

-- Policy: Admins can view all transactions
create policy "Admins can view all transactions" on transactions
  for select using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

-- Seed a sample transaction for the Seed Round
insert into transactions (user_id, campaign_id, amount, currency, status, type, provider, hash)
select 
  id as user_id, 
  (select id from campaigns limit 1) as campaign_id,
  25000, 
  'USDC', 
  'completed', 
  'investment', 
  'thirdweb', 
  '0x123...abc' 
from profiles 
where role = 'investor' 
limit 1;
