-- FIX: Signup Error Handler
-- Replaces the welcome trigger function with a robust version that catches errors
-- Run this if you are getting "Database error saving new user"

create or replace function public.handle_new_investor_welcome()
returns trigger as $$
declare
  system_admin_id uuid;
begin
  begin
    -- Try to find admin
    select id into system_admin_id from profiles where role = 'admin' limit 1;
    
    -- Insert message (Safe insert)
    insert into public.messages (sender_id, receiver_id, subject, content)
    values (
      system_admin_id, -- Can be null, messages table should allow specific sender configurations
      new.id, 
      'Welcome to The Utility Network Nexus',
      'Dear Partner,\n\nWelcome to the Nexus. This secure environment is your command center for managing your positions within The Utility Network.\n\nPlease navigate to the "Data Room" to review our latest consolidated financials and subsidiary breakdown.\n\nRegards,\nThe Utility Network Team'
    );
  exception when others then
    -- Log error but DO NOT block the signup profile creation
    raise warning 'Nexus Auto-Welcome Failed: %', SQLERRM;
  end;
  return new;
end;
$$ language plpgsql security definer;
