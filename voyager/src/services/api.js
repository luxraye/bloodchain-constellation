import apiClient from '../lib/api.js'

const STATUS_LABELS = {
    COLLECTED: 'Collected', TESTING: 'Testing', QUARANTINE: 'Quarantine',
    RELEASED: 'Released', IN_TRANSIT: 'In Transit', USED: 'Used', DISCARDED: 'Discarded',
}

// ── Assets ───────────────────────────────────────────

export async function getBloodAssets(status) {
    try {
        const url = status ? `/assets?status=${status}` : '/assets'
        const { data } = await apiClient.get(url)
        return (data.data ?? []).map(a => ({ ...a, statusLabel: STATUS_LABELS[a.status] ?? a.status, shortId: a.id.slice(-10).toUpperCase() }))
    } catch { return [] }
}

export async function getAsset(id) {
    try { const { data } = await apiClient.get(`/assets/${id}`); return data.data ?? null } catch { return null }
}

export async function getAssetCustody(id) {
    try { const { data } = await apiClient.get(`/assets/${id}/custody`); return data } catch { return null }
}

export async function scanAsset(assetId, newStatus, location, notes) {
    const { data } = await apiClient.post('/assets/scan', { assetId, newStatus, location, notes })
    return data.data
}

// ── Profile ───────────────────────────────────────────

export async function getMyProfile() {
    try { const { data } = await apiClient.get('/profile/me'); return data.data ?? null } catch { return null }
}

export async function updateMyProfile(payload) {
    const { data } = await apiClient.patch('/profile/me', payload); return data.data
}
