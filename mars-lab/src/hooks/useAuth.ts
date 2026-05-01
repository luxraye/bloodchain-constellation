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

const GUEST_USER = {
  id: 'guest-mars-001',
  name: 'Demo Visitor',
  email: 'guest@bloodchain.demo',
  username: 'demo_guest',
  role: 'LAB',
  roles: ['LAB'],
}

function isGuestDemoSession() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('guest') === '1'
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
  const bypass = import.meta.env.DEV && import.meta.env.VITE_AUTH_BYPASS === 'true'
  const guest = isGuestDemoSession()
  const fallbackUser = guest ? GUEST_USER : bypass ? DEV_USER : null
  const [user, setUser] = useState<ReturnType<typeof parseUser>>(fallbackUser)
  const [loading, setLoading] = useState(!(bypass || guest))

  useEffect(() => {
    if (bypass || guest) return

    supabase.auth.getSession().then(({ data }) => {
      setUser(parseUser(data.session?.user ?? null))
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(parseUser(session?.user ?? null))
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [bypass, guest])

  const hasRole = (...check: string[]) =>
    guest
      ? check.some(r => GUEST_USER.roles.includes(r.toUpperCase()))
      : bypass
      ? check.some(r => DEV_USER.roles.includes(r.toUpperCase()))
      : check.some(r => r.toUpperCase() === user?.role)

  const exitGuestDemo = () => {
    if (typeof window === 'undefined') return
    const nextUrl = new URL(window.location.href)
    nextUrl.searchParams.delete('guest')
    window.location.href = nextUrl.toString()
  }

  return {
    user: guest ? GUEST_USER : bypass ? DEV_USER : user,
    loading,
    roles: guest ? GUEST_USER.roles : bypass ? DEV_USER.roles : (user ? [user.role] : []),
    hasRole,
    isGuest: guest,
    login: (email: string, password: string) => supabase.auth.signInWithPassword({ email, password }),
    logout: () => guest ? Promise.resolve(exitGuestDemo()) : supabase.auth.signOut(),
  }
}
