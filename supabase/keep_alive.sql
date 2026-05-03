-- This script prevents the Supabase free-tier project from pausing due to inactivity
-- by scheduling a daily pg_cron job that makes a simple HTTP GET request to the REST API using pg_net.
-- Supabase considers REST API requests as "active" project usage.

-- 1. Enable the pg_net and pg_cron extensions
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Schedule the keep-alive job
-- This runs every day at midnight UTC (0 0 * * *)
SELECT cron.schedule(
  'supabase-keep-alive',
  '0 0 * * *',
  $$
    SELECT net.http_get(
      url := 'https://qpjjndydhvybocqufefj.supabase.co/rest/v1/',
      headers := '{"apikey": "sb_publishable_JfceLTLc9elU4tAvpib9zA_JhK97QJ3"}'::jsonb
    );
  $$
);

-- Note: To check if the job was scheduled successfully, run:
-- SELECT * FROM cron.job;

-- To view job execution history (ensure cron.log_run is enabled, which is default):
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 5;

-- To unschedule the job if needed, run:
-- SELECT cron.unschedule('supabase-keep-alive');
