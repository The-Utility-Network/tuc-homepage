import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

function createAdminClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

// GET: Check if Nexus has been initialized (any admin exists)
export async function GET() {
    try {
        const adminClient = createAdminClient()
        const { count, error } = await adminClient.from('profiles').select('*', { count: 'exact', head: true }).in('role', ['admin', 'superadmin'])
        
        if (error) {
            console.error("Init check error fetching profiles:", error)
            return NextResponse.json({ initialized: false })
        }
        
        return NextResponse.json({ initialized: (count || 0) > 0 })
    } catch (error: any) {
        console.error("Init check error:", error)
        return NextResponse.json({ initialized: false }) // Show button if DB unreachable
    }
}

// POST: Create the initial admin account
export async function POST(req: Request) {
    try {
        const { email, password, full_name, position_title } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required." }, { status: 400 })
        }

        const adminClient = createAdminClient()

        // Safety check: if an admin already exists, reject
        const { count } = await adminClient.from('profiles').select('*', { count: 'exact', head: true }).in('role', ['admin', 'superadmin'])
        if ((count || 0) > 0) {
            return NextResponse.json({ message: "Nexus has already been initialized." }, { status: 403 })
        }

        // TUC Authentication via Supabase Auth
        // 1. Create User in Auth
        const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name }
        })

        if (authError) throw authError
        if (!authUser.user) throw new Error("User creation failed")

        // 2. We use Supabase profiles instead of bcrypt for password since Supabase handles auth.
        // Wait, TUC may be using `profiles` table along with a custom login if it was a direct port of Mongoose? 
        // No, TUC uses standard Supabase Auth. But wait, what if they ported the exact NextAuth flow?
        // Let's check TUC's profile schema. We'll upsert the profile.

        const { error: profileError } = await adminClient.from('profiles').upsert([{
            id: authUser.user.id,
            email,
            full_name: full_name || 'Nexus Administrator',
            position_title: position_title || '',
            role: 'superadmin',
            status: 'approved',
            updated_at: new Date()
        }])

        if (profileError) throw profileError

        return NextResponse.json({
            message: "Nexus initialized successfully. You can now log in.",
            user: { email, id: authUser.user.id }
        }, { status: 201 })
    } catch (error: any) {
        console.error("Nexus init error:", error)
        return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 })
    }
}
