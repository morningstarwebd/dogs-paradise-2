'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { Loader2, ShieldCheck, ShieldOff, CheckCircle2 } from 'lucide-react'
import { useAdminDataStore } from '@/store/admin-data-store'

interface UserEntry {
    id: string
    email: string
    name: string
    avatar: string
    role: string | null
    last_sign_in: string | null
    created_at: string | null
}

export default function AdminUsersPage() {
    const { adminUsers: cachedUsers, setAdminUsers: setCachedUsers } = useAdminDataStore()
    const [users, setUsers] = useState<UserEntry[]>(cachedUsers || [])
    const [loading, setLoading] = useState(!cachedUsers)
    const [togglingId, setTogglingId] = useState<string | null>(null)
    const [toast, setToast] = useState<string | null>(null)

    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(null), 3000)
    }

    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/users')
            if (!res.ok) throw new Error('Failed to fetch users')
            const { users: data } = await res.json()
            if (data) {
                setUsers(data)
                setCachedUsers(data)
            }
        } catch (err) {
            console.error(err)
        }
        setLoading(false)
    }, [setCachedUsers])

    useEffect(() => { fetchUsers() }, [fetchUsers])

    const toggleRole = async (user: UserEntry) => {
        const action = user.role ? 'revoke' : 'grant'
        setTogglingId(user.id)
        try {
            const res = await fetch('/api/admin/users/role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, action }),
            })
            const result = await res.json()
            if (res.ok) {
                showToast(result.message)
                // Update local state
                const refreshed = users.map(u =>
                    u.id === user.id ? { ...u, role: action === 'grant' ? 'admin' : null } : u
                )
                setUsers(refreshed)
                setCachedUsers(refreshed)
            } else {
                showToast(result.error || 'Failed to update role')
            }
        } catch {
            showToast('Network error')
        }
        setTogglingId(null)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="animate-spin text-muted-foreground" size={32} />
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {toast && (
                <div className="fixed bottom-6 right-6 bg-accent text-accent-foreground px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 animate-in slide-in-from-bottom border border-accent/20">
                    <CheckCircle2 size={18} />
                    <span className="font-medium text-sm">{toast}</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight mb-2">User Login Data</h1>
                    <p className="text-muted-foreground text-sm">View all registered users and manage admin access.</p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                {users.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground flex items-center justify-center flex-col gap-3">
                        <p>No registered users found.</p>
                    </div>
                ) : (
                    <div className="w-full">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-secondary/50 text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-4 font-medium w-[25%]">User</th>
                                    <th className="px-4 py-4 font-medium w-[25%]">Email</th>
                                    <th className="px-4 py-4 font-medium w-[15%] hidden sm:table-cell">Last Login</th>
                                    <th className="px-4 py-4 font-medium w-[15%] hidden lg:table-cell">Joined</th>
                                    <th className="px-4 py-4 font-medium text-center w-[10%]">Role</th>
                                    <th className="px-4 py-4 font-medium text-right w-[10%]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {users.map((user) => {
                                    const isSuperAdmin = user.role === 'super_admin'
                                    const isAdmin = !!user.role
                                    return (
                                        <tr key={user.id} className="hover:bg-secondary/30 transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    {user.avatar ? (
                                                        <Image src={user.avatar} alt={user.name || 'User avatar'} width={32} height={32} className="w-8 h-8 rounded-full object-cover border border-border shrink-0" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                                                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                                                        </div>
                                                    )}
                                                    <span className="font-medium truncate max-w-[150px] sm:max-w-[200px]" title={user.name || 'Unknown'}>{user.name || 'Unknown'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-muted-foreground">
                                                <span className="truncate block max-w-[150px] sm:max-w-[250px]" title={user.email}>{user.email}</span>
                                            </td>
                                            <td className="px-4 py-4 text-muted-foreground text-xs hidden sm:table-cell">
                                                {user.last_sign_in ? new Date(user.last_sign_in).toLocaleDateString() : 'Never'}
                                            </td>
                                            <td className="px-4 py-4 text-muted-foreground text-xs hidden lg:table-cell">
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                {isSuperAdmin ? (
                                                    <span className="inline-flex items-center gap-1.5 bg-accent/15 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                                        <ShieldCheck size={14} /> Super Admin
                                                    </span>
                                                ) : isAdmin ? (
                                                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                                        <ShieldCheck size={14} /> Admin
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground/60">User</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                {isSuperAdmin ? (
                                                    <span className="text-xs text-muted-foreground/40 italic">Protected</span>
                                                ) : (
                                                    <button
                                                        onClick={() => toggleRole(user)}
                                                        disabled={togglingId === user.id}
                                                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isAdmin
                                                            ? 'border border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground'
                                                            : 'border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white'
                                                            }`}
                                                    >
                                                        {togglingId === user.id ? (
                                                            <Loader2 size={14} className="animate-spin" />
                                                        ) : isAdmin ? (
                                                            <><ShieldOff size={14} /> <span className="hidden sm:inline">Revoke</span></>
                                                        ) : (
                                                            <><ShieldCheck size={14} /> <span className="hidden sm:inline">Grant</span></>
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
