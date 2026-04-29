import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendPasswordResetEmail } from '@/lib/aws/ses'

function createAdminClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()
        if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

        const adminClient = createAdminClient()
        
        // Use Supabase Admin Auth to generate a recovery link
        const { data, error } = await adminClient.auth.admin.generateLink({
            type: 'recovery',
            email: email,
        })

        if (error) {
            console.error('Generate link error:', error)
            // Still return success to prevent email enumeration
            return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' })
        }

        if (data && data.properties && data.properties.action_link) {
            // Send the SES email with the action link
            // The action link will handle the Supabase session and redirect to whatever we configure
            await sendPasswordResetEmail(email, data.properties.action_link)
        }

        return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' })
    } catch (error: any) {
        console.error('Forgot password POST error:', error)
        // Never reveal if an email failed or exists
        return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' })
    }
}
