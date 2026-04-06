import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(),
}))

describe('isAdminAllowed', () => {
    const originalSuperAdmins = process.env.SUPER_ADMIN_EMAILS

    beforeEach(() => {
        vi.resetModules()
        delete process.env.SUPER_ADMIN_EMAILS
    })

    afterEach(() => {
        if (typeof originalSuperAdmins === 'string') {
            process.env.SUPER_ADMIN_EMAILS = originalSuperAdmins
        } else {
            delete process.env.SUPER_ADMIN_EMAILS
        }
    })

    it('returns true for protected super admin email from env', async () => {
        process.env.SUPER_ADMIN_EMAILS = 'owner@example.com'

        const { isAdminAllowed } = await import('@/lib/admin-whitelist')
        const result = await isAdminAllowed('owner@example.com')
        expect(result).toBe(true)
    })

    it('matches protected super admin email case-insensitively', async () => {
        process.env.SUPER_ADMIN_EMAILS = 'owner@example.com'

        const { isAdminAllowed } = await import('@/lib/admin-whitelist')
        const result = await isAdminAllowed('Owner@Example.com')
        expect(result).toBe(true)
    })

    it('supports rotation list with multiple protected super admins', async () => {
        process.env.SUPER_ADMIN_EMAILS = 'old@example.com,new@example.com'

        const { isAdminAllowed } = await import('@/lib/admin-whitelist')
        const result = await isAdminAllowed('new@example.com')
        expect(result).toBe(true)
    })

    it('returns true when email exists in admin_users table', async () => {
        const mockClient = {
            from: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: { id: '123' }, error: null }),
        }

        const { isAdminAllowed } = await import('@/lib/admin-whitelist')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await isAdminAllowed('other-admin@example.com', mockClient as any)
        expect(result).toBe(true)
    })

    it('returns false when email is NOT in admin_users table', async () => {
        const mockClient = {
            from: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        }

        const { isAdminAllowed } = await import('@/lib/admin-whitelist')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await isAdminAllowed('random@example.com', mockClient as any)
        expect(result).toBe(false)
    })

    it('returns false when database query fails', async () => {
        const mockClient = {
            from: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockRejectedValue(new Error('DB error')),
        }

        const { isAdminAllowed } = await import('@/lib/admin-whitelist')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await isAdminAllowed('test@example.com', mockClient as any)
        expect(result).toBe(false)
    })

    it('returns false for empty email string', async () => {
        const mockClient = {
            from: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        }

        const { isAdminAllowed } = await import('@/lib/admin-whitelist')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await isAdminAllowed('', mockClient as any)
        expect(result).toBe(false)
    })
})
