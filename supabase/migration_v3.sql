-- Migration V3: Production Systems (Messages, Integrations, Data Room)

-- 1. MESSAGING SYSTEM
create table messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references profiles(id), -- Null if system message
  receiver_id uuid references profiles(id), -- Null if broadcast (optional, or handle logic elsewhere)
  subject text,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table messages enable row level security;

-- Policy: Users can see messages sent to them or sent by them
create policy "Users can view their own messages" on messages
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- Policy: Users can insert messages (send)
create policy "Users can send messages" on messages
  for insert with check (auth.uid() = sender_id);


-- 2. INTEGRATIONS & SETTINGS (Wallet, Keys, etc.)
create table integrations (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique, -- e.g., 'wallet_eth_primary', 'mercury_api'
  display_name text,
  value text, -- The actual address or key
  category text, -- 'wallet', 'bank', 'api', 'other'
  is_active boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table integrations enable row level security;
-- Only admins should view/edit this (handled by app logic + RLS in prod)
create policy "Admins can manage integrations" on integrations
  for all using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );


-- 3. DATA ROOM ENHANCEMENTS (Subsidiaries)
alter table documents 
add column if not exists subsidiary text default 'network'; 
-- Values: 'network', 'basalt', 'osiris', 'requiem', 'graine', 'digi', 'cornucopia', 'arthaneeti', 'elysium'


-- 4. AUTOMATION: Welcome Message Trigger
create or replace function public.handle_new_investor_welcome()
returns trigger as $$
declare
  system_admin_id uuid;
begin
  -- Find an admin to be the 'sender' (or leave null for generic system)
  select id into system_admin_id from profiles where role = 'admin' limit 1;

  insert into public.messages (sender_id, receiver_id, subject, content)
  values (
    system_admin_id, 
    new.id, 
    'Welcome to The Utility Network Nexus',
    'Dear Partner,\n\nWelcome to the Nexus. This secure environment is your command center for managing your positions within The Utility Network.\n\nPlease navigate to the "Data Room" to review our latest consolidated financials and subsidiary breakdown.\n\nRegards,\nThe Utility Network Team'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on Profile creation (if role is investor)
create trigger on_investor_profile_created
  after insert on profiles
  for each row
  when (new.role = 'investor')
  execute procedure public.handle_new_investor_welcome();


-- 5. PRODUCTION SEEDING (Integrations)
insert into integrations (name, display_name, value, category) values
  ('wallet_eth_primary', 'Primary ETH Receiving Wallet', '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 'wallet'),
  ('wallet_usdc_solana', 'USDC (Solana) Treasury', 'Bbv5H6...', 'wallet'),
  ('mercury_api_token', 'Mercury Banking API', 'sk_live_...', 'api');

-- 6. PRODUCTION SEEDING (Documents)
-- Seeding some initial "real" looking docs for the Data Room
insert into documents (title, file_url, doc_type, subsidiary) values
  ('TUC Consolidated Financials Q3 2025', 'https://example.com/TUC_Q3_2025.pdf', 'report', 'network'),
  ('BasaltHQ Technical Roadmap 2026', 'https://example.com/Basalt_Map.pdf', 'technical', 'basalt'),
  ('Osiris Protocol Whitepaper v2.1', 'https://example.com/Osiris_Whitepaper.pdf', 'whitepaper', 'osiris'),
  ('Requiem Grid Impact Study', 'https://example.com/Requiem_Study.pdf', 'report', 'requiem');
