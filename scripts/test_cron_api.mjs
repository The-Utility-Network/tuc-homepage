import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qpjjndydhvybocqufefj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwampuZHlkaHZ5Ym9jcXVmZWZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk3Nzk3OCwiZXhwIjoyMDgyNTUzOTc4fQ.i5HLvhajniJuoAQG40PkmD12y7FYkVrlczHb1v9NsMw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.rpc('exec', { sql: 'SELECT 1;' });
    
  console.log('Data:', data);
  console.log('Error:', error);
}

test();
