-- Migration V5: Banking & Wire Instructions
-- Enable storage of fiat bank account details (e.g. Mercury) for wire transfers

create table if not exists bank_accounts (
  id uuid default uuid_generate_v4() primary key,
  bank_name text not null, -- e.g. 'Mercury / Evolve Bank & Trust'
  account_name text not null, -- e.g. 'The Utility Company LLC'
  account_number text, -- stored as text, potentially masked in UI
  routing_number text,
  swift_code text,
  address text, -- Bank Address
  beneficiary_address text, -- Company Address
  currency text default 'USD',
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table bank_accounts enable row level security;

-- Policy: Everyone (authenticated) can view active bank accounts (for wire instructions)
create policy "Everyone can view active bank accounts" on bank_accounts
  for select using (is_active = true);

-- Policy: Only admins can manage
create policy "Admins can manage bank accounts" on bank_accounts
  for all using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

-- Seed a default Mercury placeholder (User can edit this in Settings)
insert into bank_accounts (bank_name, account_name, routing_number, swift_code, address, beneficiary_address)
values 
  ('Mercury / Evolve Bank & Trust', 'The Utility Company LLC', '021...', 'EVOLUS33', '123 Innovation Dr, Austin', 'San Francisco, CA');
