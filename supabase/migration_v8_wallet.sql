-- Migration V8: Add Wallet Address to Profiles
-- Allows users to link their web3 wallet for investment purposes.

alter table profiles 
add column if not exists wallet_address text;

-- Add a policy to allow users to update their own wallet address (covered by existing update policy usually, but explicit check)
-- Existing policy: "Users can update own profile" on profiles for update using ( auth.uid() = id );
-- So no new policy needed if that exists.

comment on column profiles.wallet_address is 'The connected Web3 wallet address (e.g. 0x...) for the user.';
