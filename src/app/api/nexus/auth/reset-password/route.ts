import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function createAdminClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function POST(req: NextRequest) {
    try {
        // In Supabase, if the user clicked the recovery link, their browser session is now authenticated
        // So the client should update the password using `supabase.auth.updateUser({ password })`.
        // This endpoint might just be a fallback if we were manually resetting.
        // If we are passing standard NextAuth tokens, this is where we'd verify them.
        // But since we are using Supabase Auth, we should rely on the client-side `supabase.auth.updateUser`.
        // We'll keep this route as a placeholder returning an instruction to use the client.

        return NextResponse.json({ 
            success: false, 
            error: 'Password reset should be handled client-side using supabase.auth.updateUser after following the recovery link.' 
        }, { status: 400 })

    } catch (error: any) {
        console.error('Reset password POST error:', error)
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
    }
}
