'use server'

import { createClient } from '@/lib/supabase-server'

export async function getCurrentProfile() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
            
        if (!profile) return null
        return {
            ...profile,
            email: user.email
        }
    } catch (e) {
        console.error('Failed to get current profile:', e)
        return null
    }
}
