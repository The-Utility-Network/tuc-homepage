-- Migration V6: Ventures & Ecosystem Powerhouse
-- Upgrading the campaigns table to support multi-subsidiary management and valuation tracking

-- 1. Add fields to campaigns
alter table campaigns 
add column if not exists subsidiary text default 'network', -- Link to specific entities
add column if not exists valuation numeric, -- Post-money valuation in USD
add column if not exists equity_pct numeric, -- Equity percentage offered (optional)
add column if not exists round_type text default 'equity'; -- 'equity', 'safe', 'token'

-- 2. Ensure RLS allows admins to DELETE
create policy "Admins can delete campaigns" on campaigns
  for delete using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

-- 3. Ensure RLS allows admins to DELETE transactions (Remove Investor)
create policy "Admins can delete transactions" on transactions
  for delete using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

-- 4. Seed some sample real data if empty
do $$
begin
  if not exists (select 1 from campaigns where subsidiary = 'basalt') then
    insert into campaigns (name, subsidiary, target_amount, valuation, status, start_date)
    values ('BasaltHQ Seed Round', 'basalt', 3000000, 45000000, 'active', now());
  end if;
end $$;
