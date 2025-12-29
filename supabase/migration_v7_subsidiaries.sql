-- Migration V7: Subsidiaries Table
-- Centralized configuration for all ecosystem entities to support dynamic branding.
-- Colors updated significantly to match the true brand palettes (e.g., Osiris Purple, Graine Gold, Cornucopia Pink).

create table if not exists subsidiaries (
  id text primary key, -- e.g. 'basalt', 'network'
  name text not null,
  description text,
  hex_color text not null, -- e.g. '#F54029'
  logo_url text, -- e.g. '/Medallions/BasaltM.png'
  created_at timestamptz default now()
);

-- RLS
alter table subsidiaries enable row level security;
create policy "Public Read Subsidiaries" on subsidiaries for select using (true);
create policy "Admins Manage Subsidiaries" on subsidiaries using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Seed Data (Corrected Colors)
insert into subsidiaries (id, name, description, hex_color, logo_url) values
('network', 'The Utility Network', 'Parent Entity & Core Infrastructure', '#F54029', '/Medallions/TheUtilityNetwork.png'),
('basalt', 'BasaltHQ', 'Advanced AI & Compute Logistics', '#4B5563', '/Medallions/BasaltM.png'), -- Dark Grey
('osiris', 'Osiris Protocol', 'Decentralized Identity & Security', '#7C3AED', '/Medallions/OP.png'), -- Purple
('requiem', 'Requiem Electric', 'Next-Gen Energy Systems', '#EAB308', '/Medallions/RE.png'), -- Gold/Yellow
('graine', 'The Graine Ledger', 'Financial Technology Stack', '#D97706', '/Medallions/TGL.png'), -- Amber/Orange
('digi', 'DigiBazaar', 'Digital Marketplace Ecosystem', '#9333EA', '/Medallions/DigiBazaarMedallion.png'), -- Deep Purple
('cornucopia', 'Cornucopia Robotics', 'Automated Agriculture', '#DB2777', '/Medallions/CornucopiaRobotics.png'), -- Pink/Magenta
('arthaneeti', 'Arthaneeti', 'Economic Policy & Governance', '#06B6D4', '/Medallions/AR.png'), -- Cyan
('elysium', 'Elysium Athletica', 'Human Performance & Wellness', '#0D9488', '/Medallions/Elysium.png') -- Teal
on conflict (id) do update set 
    name = excluded.name,
    description = excluded.description,
    hex_color = excluded.hex_color,
    logo_url = excluded.logo_url;
