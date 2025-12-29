-- Seed a default fundraising bank account (Mercury style)
INSERT INTO bank_accounts (bank_name, account_number, routing_number, swift_code, beneficiary_name, beneficiary_address)
VALUES 
('Mercury / Evolve Bank & Trust', '9876543210', '021000021', 'EVOLUS33', 'The Utility Company LLC', '123 Innovation Dr, Austin, TX 78701');

-- Seed a sample Campaign
INSERT INTO campaigns (name, target_amount, status, description, start_date)
VALUES 
('Seed Round A', 5000000, 'active', 'Series Seed funding for core infrastructure layout.', now());
