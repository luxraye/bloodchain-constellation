import { supabase } from './supabase.js'

const normalizeUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const protocol = (url.includes('localhost') || url.includes('127.0.0.1')) ? 'http://' : 'https://'
  return protocol + url
}

const BASE = normalizeUrl(import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1')

async function getAccessToken() {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

async function authFetch(path, options = {}) {
  const token = await getAccessToken()
  if (!token) {
    throw new Error('Authentication required')
  }

  const res = await fetch(`${BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
            ...(options.headers ?? {}),
        },
    })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `API request failed: ${res.status}`)
  }
  return res.json()
}

export async function getUsers() {
  const json = await authFetch('/admin/users')
  return { data: json.data ?? json.users ?? [] }
}

export async function getAssets() {
  const json = await authFetch('/assets')
  const assets = (json.data ?? []).map((a) => ({
            id: a.id,
            donorId: a.donorId,
            bloodType: a.bloodType,
            type: a.bloodType,
    status: a.status,
            currentLocation: a.currentLocation,
            location: a.currentLocation,
            createdAt: a.createdAt,
    expiresAt: new Date(Date.parse(a.createdAt) + 35 * 86400000).toISOString(),
        }))
        return { data: assets }
}

export async function createBloodAsset(payload) {
  const json = await authFetch('/assets', {
    method: 'POST',
    body: JSON.stringify({
                donorId: payload.donorId,
                bloodType: payload.bloodType,
      location: payload.location,
      notes: payload.vitals ? JSON.stringify({ vitals: payload.vitals }) : undefined,
    }),
  })
  return { data: json.data }
}

export async function processOutbox() {
  return
}

export function getOutboxCount() {
  return 0
}
