import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize a standard supabase client bypassing SSR cookies since this is a cron job
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  // Optional: Secure the cron endpoint by checking the Vercel cron secret
  const authHeader = req.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Perform a very lightweight query to register activity and keep the project alive
    // Querying the profiles table with limit(1) requires minimal compute.
    const { data, error } = await supabase.from('profiles').select('id').limit(1);

    if (error) {
      console.error('Supabase keep-alive ping failed:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'ok', message: 'Supabase ping successful', timestamp: new Date().toISOString() });
  } catch (err: any) {
    console.error('Server error during Supabase ping:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
