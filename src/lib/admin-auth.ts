/**
 * Admin Authorization Utilities
 * Handles admin role checking and permissions
 */

import { createClient } from './supabase'

export interface AdminRole {
    id: string
    userId: string
    roleType: 'super_admin' | 'subsidiary_admin'
    subsidiaryId?: string
    permissions: {
        data_room?: boolean
        subsidiary_edit?: boolean
        [key: string]: any
    }
    grantedBy?: string
    grantedAt: string
    revokedAt?: string
    notes?: string
}

export interface AdminAuditLog {
    id: string
    adminId: string
    actionType: string
    resourceType: string
    resourceId?: string
    details?: any
    ipAddress?: string
    userAgent?: string
    createdAt: string
}

/**
 * Check if user is a super admin
 */
export async function isSuperAdmin(userId?: string): Promise<boolean> {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    const checkUserId = userId || user?.id

    if (!checkUserId) return false

    const { data } = await supabase.rpc('is_super_admin', {
        p_user_id: checkUserId
    })

    return data === true
}

/**
 * Check if user is admin for specific subsidiary
 */
export async function isSubsidiaryAdmin(subsidiaryId: string, userId?: string): Promise<boolean> {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    const checkUserId = userId || user?.id

    if (!checkUserId) return false

    const { data } = await supabase.rpc('is_subsidiary_admin', {
        p_user_id: checkUserId,
        p_subsidiary_id: subsidiaryId
    })

    return data === true
}

/**
 * Get user's admin role (if any)
 */
export async function getAdminRole(userId?: string): Promise<AdminRole | null> {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    const checkUserId = userId || user?.id

    if (!checkUserId) return null

    const { data, error } = await supabase
        .from('admin_roles')
        .select('*')
        .eq('user_id', checkUserId)
        .is('revoked_at', null)
        .order('role_type') // super_admin comes before subsidiary_admin
        .limit(1)
        .single()

    if (error || !data) return null

    return {
        id: data.id,
        userId: data.user_id,
        roleType: data.role_type,
        subsidiaryId: data.subsidiary_id,
        permissions: data.permissions || {},
        grantedBy: data.granted_by,
        grantedAt: data.granted_at,
        revokedAt: data.revoked_at,
        notes: data.notes,
    }
}

/**
 * Get all admin roles for a user
 */
export async function getAllAdminRoles(userId?: string): Promise<AdminRole[]> {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    const checkUserId = userId || user?.id

    if (!checkUserId) return []

    const { data, error } = await supabase
        .from('admin_roles')
        .select('*')
        .eq('user_id', checkUserId)
        .is('revoked_at', null)
        .order('role_type')

    if (error || !data) return []

    return data.map(role => ({
        id: role.id,
        userId: role.user_id,
        roleType: role.role_type,
        subsidiaryId: role.subsidiary_id,
        permissions: role.permissions || {},
        grantedBy: role.granted_by,
        grantedAt: role.granted_at,
        revokedAt: role.revoked_at,
        notes: role.notes,
    }))
}

/**
 * Get subsidiaries user can manage
 */
export async function getManagedSubsidiaries(userId?: string): Promise<string[]> {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    const checkUserId = userId || user?.id

    if (!checkUserId) return []

    const { data } = await supabase.rpc('get_managed_subsidiaries', {
        p_user_id: checkUserId
    })

    return (data || []).map((row: any) => row.subsidiary_id)
}

/**
 * Grant admin role (super admin only)
 */
export async function grantAdminRole(params: {
    userId: string
    roleType: 'super_admin' | 'subsidiary_admin'
    subsidiaryId?: string
    permissions?: any
    notes?: string
}): Promise<{ success: boolean; error?: string; roleId?: string }> {
    const supabase = createClient()

    // Check if current user is super admin
    const isAdmin = await isSuperAdmin()
    if (!isAdmin) {
        return { success: false, error: 'Unauthorized: Only super admins can grant roles' }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { success: false, error: 'Not authenticated' }
    }

    // Validate: subsidiary_admin must have subsidiaryId
    if (params.roleType === 'subsidiary_admin' && !params.subsidiaryId) {
        return { success: false, error: 'Subsidiary admin must have a subsidiary ID' }
    }

    const { data, error } = await supabase
        .from('admin_roles')
        .insert({
            user_id: params.userId,
            role_type: params.roleType,
            subsidiary_id: params.subsidiaryId || null,
            permissions: params.permissions || { data_room: true, subsidiary_edit: true },
            granted_by: user.id,
            notes: params.notes,
        })
        .select()
        .single()

    if (error) {
        return { success: false, error: error.message }
    }

    // Log the action
    await logAdminAction(
        'grant_role',
        'admin_role',
        data.id,
        {
            targetUserId: params.userId,
            roleType: params.roleType,
            subsidiaryId: params.subsidiaryId,
        }
    )

    return { success: true, roleId: data.id }
}

/**
 * Revoke admin role (super admin only)
 */
export async function revokeAdminRole(roleId: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient()

    // Check if current user is super admin
    const isAdmin = await isSuperAdmin()
    if (!isAdmin) {
        return { success: false, error: 'Unauthorized: Only super admins can revoke roles' }
    }

    const { error } = await supabase
        .from('admin_roles')
        .update({ revoked_at: new Date().toISOString() })
        .eq('id', roleId)

    if (error) {
        return { success: false, error: error.message }
    }

    // Log the action
    await logAdminAction('revoke_role', 'admin_role', roleId)

    return { success: true }
}

/**
 * Log an admin action
 */
export async function logAdminAction(
    actionType: string,
    resourceType: string,
    resourceId?: string,
    details?: any
): Promise<void> {
    const supabase = createClient()

    await supabase.rpc('log_admin_action', {
        p_action_type: actionType,
        p_resource_type: resourceType,
        p_resource_id: resourceId || null,
        p_details: details || null,
    })
}

/**
 * Get admin audit logs (super admin only)
 */
export async function getAdminAuditLogs(params?: {
    adminId?: string
    resourceType?: string
    limit?: number
    offset?: number
}): Promise<AdminAuditLog[]> {
    const supabase = createClient()

    // Check if current user is super admin
    const isAdmin = await isSuperAdmin()
    if (!isAdmin) {
        return []
    }

    let query = supabase
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false })

    if (params?.adminId) {
        query = query.eq('admin_id', params.adminId)
    }

    if (params?.resourceType) {
        query = query.eq('resource_type', params.resourceType)
    }

    if (params?.limit) {
        query = query.limit(params.limit)
    }

    if (params?.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 50) - 1)
    }

    const { data } = await query

    return (data || []).map(log => ({
        id: log.id,
        adminId: log.admin_id,
        actionType: log.action_type,
        resourceType: log.resource_type,
        resourceId: log.resource_id,
        details: log.details,
        ipAddress: log.ip_address,
        userAgent: log.user_agent,
        createdAt: log.created_at,
    }))
}

/**
 * Check if email is the founder superadmin
 */
export function isFounderEmail(email: string): boolean {
    return email.toLowerCase() === 'founders@theutilitycompany.co'
}

/**
 * Require super admin (for use in API routes)
 */
export async function requireSuperAdmin(): Promise<{ authorized: boolean; userId?: string; error?: string }> {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { authorized: false, error: 'Not authenticated' }
    }

    const isAdmin = await isSuperAdmin(user.id)

    if (!isAdmin) {
        return { authorized: false, userId: user.id, error: 'Unauthorized: Super admin required' }
    }

    return { authorized: true, userId: user.id }
}

/**
 * Require subsidiary admin (for use in API routes)
 */
export async function requireSubsidiaryAdmin(subsidiaryId: string): Promise<{ authorized: boolean; userId?: string; error?: string }> {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { authorized: false, error: 'Not authenticated' }
    }

    const isAdmin = await isSubsidiaryAdmin(subsidiaryId, user.id)

    if (!isAdmin) {
        return { authorized: false, userId: user.id, error: 'Unauthorized: Subsidiary admin required' }
    }

    return { authorized: true, userId: user.id }
}
