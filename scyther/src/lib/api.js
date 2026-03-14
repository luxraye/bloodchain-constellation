/**
 * PHANTOM BACKEND — localStorage adapter for Scyther.
 * Implements FFT (Fault Tolerance & Offline Sync):
 *   - Mission 2: Outbox queue for offline createBloodAsset calls
 *   - Mission 3: processOutbox() flushes to main DB when back online
 *
 * DB key:     'bloodchain_db'     shape: { assets: Asset[], users: User[] }
 * Outbox key: 'bloodchain_outbox' shape: [{ id, type, payload, timestamp }]
 */

const DB_KEY = 'bloodchain_db'
const OUTBOX_KEY = 'bloodchain_outbox'

// ─── Main DB helpers ──────────────────────────────────────────────────────────

function getDb() {
    try {
        const raw = localStorage.getItem(DB_KEY)
        if (raw) return JSON.parse(raw)
    } catch { /* ignore */ }
    return { assets: [], users: [] }
}

function saveDb(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db))
}

// ─── Outbox helpers (Mission 2) ───────────────────────────────────────────────

function getOutbox() {
    try {
        const raw = localStorage.getItem(OUTBOX_KEY)
        if (raw) return JSON.parse(raw)
    } catch { /* ignore */ }
    return []
}

function saveOutbox(queue) {
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(queue))
}

function pushToOutbox(type, payload) {
    const queue = getOutbox()
    queue.push({
        id: `outbox_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        type,
        payload,
        timestamp: new Date().toISOString(),
    })
    saveOutbox(queue)
}

function removeFromOutbox(id) {
    const queue = getOutbox().filter(item => item.id !== id)
    saveOutbox(queue)
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_USERS = [
    { id: 'usr_001', name: 'Kagiso Modise', email: 'kagiso@bloodchain.local', omang: 'OM1234567', gender: 'M', dateOfBirth: '1990-04-12', bloodType: 'O+', phone: '+26771000001', lastDonation: '2025-11-15', totalDonations: 4, status: 'ELIGIBLE' },
    { id: 'usr_002', name: 'Amantle Setlhare', email: 'amantle@bloodchain.local', omang: 'OM2345678', gender: 'F', dateOfBirth: '1985-08-23', bloodType: 'A+', phone: '+26771000002', lastDonation: '2026-01-10', totalDonations: 7, status: 'ELIGIBLE' },
    { id: 'usr_003', name: 'Tshiamo Kgari', email: 'tshiamo@bloodchain.local', omang: 'OM3456789', gender: 'M', dateOfBirth: '1998-01-30', bloodType: 'B-', phone: '+26771000003', lastDonation: null, totalDonations: 0, status: 'ELIGIBLE' },
    { id: 'usr_004', name: 'Oratile Dikgole', email: 'oratile@bloodchain.local', omang: 'OM4567890', gender: 'F', dateOfBirth: '1992-06-05', bloodType: 'AB+', phone: '+26771000004', lastDonation: '2025-12-01', totalDonations: 3, status: 'ELIGIBLE' },
    { id: 'usr_005', name: 'Keabetswe Maphane', email: 'keabetswe@bloodchain.local', omang: 'OM5678901', gender: 'M', dateOfBirth: '1987-11-17', bloodType: 'O-', phone: '+26771000005', lastDonation: '2026-02-01', totalDonations: 12, status: 'ELIGIBLE' },
    { id: 'usr_006', name: 'Dineo Ramotswe', email: 'dineo@bloodchain.local', omang: 'OM6789012', gender: 'F', dateOfBirth: '1994-03-08', bloodType: 'A-', phone: '+26771000006', lastDonation: '2025-10-20', totalDonations: 2, status: 'ELIGIBLE' },
    { id: 'usr_007', name: 'Mpho Segotso', email: 'mpho@bloodchain.local', omang: 'OM7890123', gender: 'M', dateOfBirth: '1989-07-15', bloodType: 'B+', phone: '+26771000007', lastDonation: '2026-01-28', totalDonations: 6, status: 'ELIGIBLE' },
    { id: 'usr_008', name: 'Lesego Sithole', email: 'lesego@bloodchain.local', omang: 'OM8901234', gender: 'F', dateOfBirth: '2000-12-01', bloodType: 'O+', phone: '+26771000008', lastDonation: null, totalDonations: 0, status: 'ELIGIBLE' },
    { id: 'usr_009', name: 'Gosiame Phiri', email: 'gosiame@bloodchain.local', omang: 'OM9012345', gender: 'M', dateOfBirth: '1983-05-22', bloodType: 'A+', phone: '+26771000009', lastDonation: '2025-09-10', totalDonations: 9, status: 'ELIGIBLE' },
    { id: 'usr_010', name: 'Neo Molefe', email: 'neo@bloodchain.local', omang: 'OM0123456', gender: 'F', dateOfBirth: '1996-11-03', bloodType: 'AB-', phone: '+26771000010', lastDonation: '2025-12-15', totalDonations: 1, status: 'ELIGIBLE' },
    { id: 'usr_011', name: 'Onkabetse Tau', email: 'onka@bloodchain.local', omang: 'OM1122334', gender: 'M', dateOfBirth: '1975-09-09', bloodType: 'O+', phone: '+26771000011', lastDonation: '2026-02-10', totalDonations: 18, status: 'ELIGIBLE' },
    { id: 'usr_012', name: 'Boitumelo Dithebe', email: 'boitu@bloodchain.local', omang: 'OM2233445', gender: 'F', dateOfBirth: '1991-02-14', bloodType: 'B+', phone: '+26771000012', lastDonation: '2026-01-05', totalDonations: 5, status: 'ELIGIBLE' },
    { id: 'usr_013', name: 'Tebogo Mogorosi', email: 'tebogo@bloodchain.local', omang: 'OM3344556', gender: 'M', dateOfBirth: '2001-08-18', bloodType: 'A+', phone: '+26771000013', lastDonation: null, totalDonations: 0, status: 'ELIGIBLE' },
    { id: 'usr_014', name: 'Kefilwe Ntlhane', email: 'kefilwe@bloodchain.local', omang: 'OM4455667', gender: 'F', dateOfBirth: '1988-04-27', bloodType: 'O-', phone: '+26771000014', lastDonation: '2025-11-30', totalDonations: 8, status: 'ELIGIBLE' },
    { id: 'usr_015', name: 'Baboloki Senyatso', email: 'baboloki@bloodchain.local', omang: 'OM5566778', gender: 'M', dateOfBirth: '1979-06-11', bloodType: 'AB+', phone: '+26771000015', lastDonation: '2025-10-05', totalDonations: 14, status: 'ELIGIBLE' },
]

const now = new Date()
const daysAgo = (n) => new Date(now - n * 86_400_000).toISOString()
const daysFromNow = (n) => new Date(+now + n * 86_400_000).toISOString()

const SEED_ASSETS = [
    { id: 'ast_001', donorId: 'usr_001', bloodType: 'O+', status: 'QUARANTINE', currentLocation: 'Scyther Collection — Gaborone Main', createdAt: daysAgo(3), expiresAt: daysFromNow(32) },
    { id: 'ast_002', donorId: 'usr_002', bloodType: 'A+', status: 'RELEASED', currentLocation: 'NBTS Main Lab — Princess Marina', createdAt: daysAgo(5), expiresAt: daysFromNow(30) },
    { id: 'ast_003', donorId: 'usr_003', bloodType: 'B-', status: 'QUARANTINE', currentLocation: 'Scyther Collection — Francistown', createdAt: daysAgo(2), expiresAt: daysFromNow(33) },
    { id: 'ast_004', donorId: 'usr_004', bloodType: 'AB+', status: 'QUARANTINE', currentLocation: 'Scyther Collection — Maun Drive', createdAt: daysAgo(1), expiresAt: daysFromNow(34) },
    { id: 'ast_005', donorId: 'usr_005', bloodType: 'O-', status: 'RELEASED', currentLocation: 'NBTS Main Lab — Princess Marina', createdAt: daysAgo(4), expiresAt: daysFromNow(31) },
    { id: 'ast_006', donorId: 'usr_006', bloodType: 'A-', status: 'QUARANTINE', currentLocation: 'Scyther Collection — Serowe Drive', createdAt: daysAgo(1), expiresAt: daysFromNow(34) },
    { id: 'ast_007', donorId: 'usr_007', bloodType: 'B+', status: 'RELEASED', currentLocation: 'Nyangabgwe Referral Hospital', createdAt: daysAgo(6), expiresAt: daysFromNow(29) },
    { id: 'ast_008', donorId: 'usr_009', bloodType: 'A+', status: 'QUARANTINE', currentLocation: 'Scyther Collection — Gaborone Main', createdAt: daysAgo(0), expiresAt: daysFromNow(35) },
]

function ensureSeeded() {
    const db = getDb()
    let changed = false
    if (!db.users || db.users.length === 0) { db.users = SEED_USERS; changed = true }
    if (!db.assets || db.assets.length === 0) { db.assets = SEED_ASSETS; changed = true }
    if (changed) saveDb(db)
}

// ─── Mission 3: processOutbox ─────────────────────────────────────────────────

/**
 * Flush the outbox to the main DB.
 * Called automatically by useNetwork when the device comes back online.
 * Simulates an async operation (e.g. API call) with a small delay per item.
 */
export async function processOutbox() {
    const queue = getOutbox()
    if (queue.length === 0) return

    for (const item of queue) {
        try {
            if (item.type === 'CREATE_ASSET') {
                const db = getDb()
                const now = new Date().toISOString()
                const asset = {
                    id: item.payload.offlineId ?? `ast_${Date.now()}`,
                    donorId: item.payload.donorId,
                    bloodType: item.payload.bloodType,
                    status: 'QUARANTINE',
                    currentLocation: item.payload.location || 'Scyther Collection',
                    createdAt: item.timestamp,
                    expiresAt: new Date(Date.parse(item.timestamp) + 35 * 86_400_000).toISOString(),
                    vitals: item.payload.vitals ?? null,
                    syncedAt: now,
                    syncSource: 'outbox',
                }
                db.assets = [asset, ...(db.assets ?? [])]
                saveDb(db)
            }
            // Simulate network latency per item (for realistic "Syncing..." experience)
            await new Promise(r => setTimeout(r, 300))
            removeFromOutbox(item.id)
        } catch (err) {
            // Leave failed items in the outbox to retry next sync
            console.warn('[FFT] Failed to sync outbox item:', item.id, err)
        }
    }
}

// ─── Public API ───────────────────────────────────────────────────────────────

const normalizeUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const protocol = (url.includes('localhost') || url.includes('127.0.0.1')) ? 'http://' : 'https://';
    return protocol + url;
};

const BASE = normalizeUrl(import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1')

async function authFetch(path, options = {}) {
    // Get the supabase token from localStorage (Supabase stores it under sb-*-auth-token)
    let token = null
    try {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('sb-') && k.endsWith('-auth-token'))
        if (keys[0]) {
            const session = JSON.parse(localStorage.getItem(keys[0]))
            token = session?.access_token ?? null
        }
    } catch { /* ignore */ }

    return fetch(`${BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers ?? {}),
        },
    })
}

/** GET /admin/users → { data: User[] } — falls back to seed data if backend down */
export async function getUsers(_params) {
    try {
        const res = await authFetch('/admin/users')
        if (!res.ok) throw new Error('Backend error')
        const json = await res.json()
        return { data: json.users ?? [] }
    } catch {
        ensureSeeded()
        return { data: getDb().users ?? [] }
    }
}

/** GET /assets → { data: Asset[] } — falls back to local seed if backend down */
export async function getAssets(_params) {
    try {
        const res = await authFetch('/assets')
        if (!res.ok) throw new Error('Backend error')
        const json = await res.json()
        // Map bloodchain-core fields to scyther's expected shape
        const assets = (json.data ?? []).map(a => ({
            id: a.id,
            donorId: a.donorId,
            bloodType: a.bloodType,
            type: a.bloodType,
            status: a.status === 'COLLECTED' ? 'QUARANTINE' : a.status,
            currentLocation: a.currentLocation,
            location: a.currentLocation,
            createdAt: a.createdAt,
            expiresAt: new Date(Date.parse(a.createdAt) + 35 * 86_400_000).toISOString(),
        }))
        return { data: assets }
    } catch {
        ensureSeeded()
        return { data: getDb().assets ?? [] }
    }
}

/**
 * Mission 2: createBloodAsset — Offline-aware.
 * If device is offline → queues to outbox and returns a simulated success.
 * If device is online  → writes directly to the main DB (Phantom backend).
 */
export async function createBloodAsset(payload) {
    ensureSeeded()
    const now = new Date().toISOString()
    const offlineId = `ast_${Date.now().toString(36)}`

    if (!navigator.onLine) {
        // ── OFFLINE: queue to outbox ─────────────────────────────────────────
        pushToOutbox('CREATE_ASSET', { ...payload, offlineId })
        // Return a simulated success so the UI never crashes
        return {
            data: {
                id: offlineId,
                donorId: payload.donorId,
                bloodType: payload.bloodType,
                status: 'QUARANTINE',
                currentLocation: payload.location || 'Scyther Collection',
                createdAt: now,
                expiresAt: new Date(Date.now() + 35 * 86_400_000).toISOString(),
                _offlineQueued: true,
            },
        }
    }

    // ── ONLINE: write to main DB directly ───────────────────────────────────
    const db = getDb()
    const asset = {
        id: offlineId,
        donorId: payload.donorId,
        bloodType: payload.bloodType,
        status: 'QUARANTINE',
        currentLocation: payload.location || 'Scyther Collection',
        createdAt: now,
        expiresAt: new Date(Date.now() + 35 * 86_400_000).toISOString(),
        vitals: payload.vitals ?? null,
    }
    db.assets = [asset, ...(db.assets ?? [])]
    saveDb(db)
    return { data: asset }
}

/** Expose outbox size for UI indicators */
export function getOutboxCount() {
    return getOutbox().length
}
