/**
 * useAuth — Mars-Lab (LAB / ADMIN access)
 * Supabase-powered. Preserves VITE_AUTH_BYPASS for demo mode.
 */
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const DEV_USER = {
  id: 'dev-mars-001',
  name: 'Dev Lab Tech',
  email: 'dev@bloodchain.local',
  username: 'dev_lab',
  role: 'LAB',
  roles: ['LAB'],
}

function parseUser(supaUser: { id: string; email?: string; app_metadata?: Record<string, string>; user_metadata?: Record<string, string> } | null) {
  if (!supaUser) return null
  const role = (supaUser.app_metadata?.role ?? 'PUBLIC').toUpperCase()
  return {
    id: supaUser.id,
    name: supaUser.user_metadata?.name ?? supaUser.email ?? 'User',
    email: supaUser.email ?? '',
    username: supaUser.email ?? '',
    role,
    roles: [role],
  }
}

export function useAuth() {
  const bypass = import.meta.env.VITE_AUTH_BYPASS === 'true'
  const [user, setUser] = useState<ReturnType<typeof parseUser>>(bypass ? DEV_USER : null)
  const [loading, setLoading] = useState(!bypass)

  useEffect(() => {
    if (bypass) return

    supabase.auth.getSession().then(({ data }) => {
      setUser(parseUser(data.session?.user ?? null))
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(parseUser(session?.user ?? null))
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [bypass])

  const hasRole = (...check: string[]) =>
    bypass
      ? check.some(r => DEV_USER.roles.includes(r.toUpperCase()))
      : check.some(r => r.toUpperCase() === user?.role)

  return {
    user: bypass ? DEV_USER : user,
    loading,
    roles: bypass ? DEV_USER.roles : (user ? [user.role] : []),
    hasRole,
    login: (email: string, password: string) => supabase.auth.signInWithPassword({ email, password }),
    logout: () => supabase.auth.signOut(),
  }
}
