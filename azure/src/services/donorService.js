import apiClient from '../lib/apiClient.js'
import { getApiBaseUrl } from '../lib/apiBase.js'
import { DONOR_VERIFICATIONS_BUCKET, VERIFICATION_DOC_SIGNED_URL_SECONDS } from '../lib/storage.js'
import { supabase } from '../lib/supabase.js'

// ── Profile ──────────────────────────────────────────
export async function getMyProfile() {
    try { const { data } = await apiClient.get('/profile/me'); return data.data ?? null } catch { return null }
}
export async function updateMyProfile(payload) {
    const { data } = await apiClient.patch('/profile/me', payload); return data.data
}

// ── Registration (public — no token needed) ──────────
export async function registerDonor({ email, password, name, bloodType, accepted_terms_at }) {
    const url = `${getApiBaseUrl()}/register`
    let res
    try {
        res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, bloodType, accepted_terms_at }),
        })
    } catch (e) {
        const msg = e?.message || ''
        if (msg === 'Failed to fetch' || e?.name === 'TypeError') {
            throw new Error(
                'Cannot reach the API. From the repo root, start bloodchain-core (e.g. cd bloodchain-core && yarn dev) so it listens on port 4000, then try again.'
            )
        }
        throw e
    }
    const text = await res.text()
    let json = {}
    try {
        json = text ? JSON.parse(text) : {}
    } catch {
        /* non-JSON error body */
    }
    if (!res.ok) {
        if (res.status === 502 || res.status === 503) {
            throw new Error(
                'The API is not responding. Start bloodchain-core on port 4000 (yarn dev in bloodchain-core), then retry.'
            )
        }
        throw new Error(json.error || `Registration failed (${res.status})`)
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) throw new Error(signInError.message)
    return json.data
}

// ── Document Upload (Level 1 → 2) ────────────────────
export async function uploadVerificationDoc(file) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const ext = file.name.split('.').pop()
    const path = `${user.id}/omang.${ext}`
    const { error } = await supabase.storage
        .from(DONOR_VERIFICATIONS_BUCKET)
        .upload(path, file, { upsert: true })
    if (error) throw new Error(error.message)
    const { data: signed, error: signError } = await supabase.storage
        .from(DONOR_VERIFICATIONS_BUCKET)
        .createSignedUrl(path, VERIFICATION_DOC_SIGNED_URL_SECONDS)
    if (signError) throw new Error(signError.message)
    return signed.signedUrl
}

export async function submitForVerification(docUrl) {
    const { data } = await apiClient.patch('/profile/me', { trustLevel: 2, verificationDocUrl: docUrl })
    return data.data
}

// ── Donation history ─────────────────────────────────
export async function getDonationHistory() {
    try { const { data } = await apiClient.get('/assets/my-donations'); return data.data ?? [] } catch { return [] }
}

export async function getDonationJourney() {
    throw new Error('Donation journey endpoint is not implemented yet')
}

// ── Blood unit custody (read-only for donors) ────────
export async function getAssetCustody(assetId) {
    try { const { data } = await apiClient.get(`/assets/${assetId}/custody`); return data } catch { return null }
}

export async function getNationalStockLevels() {
    const { data } = await apiClient.get('/admin/stats')
    return data?.data ?? data ?? null
}
export async function getDonationCenters() { throw new Error('Donation centers endpoint is not implemented yet') }
export async function getScheduleSlots() { throw new Error('Schedule slots endpoint is not implemented yet') }
export async function bookScheduleSlot() { throw new Error('Schedule booking endpoint is not implemented yet') }
export async function getDonationEducation() { throw new Error('Donation education endpoint is not implemented yet') }
export async function getNearbyRequests() { throw new Error('Nearby requests endpoint is not implemented yet') }
export async function respondToNearbyRequest() { throw new Error('Nearby request response endpoint is not implemented yet') }
export async function getRequests() { throw new Error('Requests endpoint is not implemented yet') }
export async function createRequest() { throw new Error('Requests endpoint is not implemented yet') }
export function getStoredSession() { try { return JSON.parse(localStorage.getItem('azure_session') || 'null') } catch { return null } }
export async function getUserProfile() { return getMyProfile() }
