/**
 * Voyager Assets API — wired to bloodchain-core
 * Replaces the localStorage phantom adapter.
 * Exports the same function names so JobContext needs zero changes.
 */
import apiClient from './api.js'

const isGuestDemo = () =>
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('guest') === '1'

const DEMO_JOBS = [
  {
    id: 'job-001',
    bloodType: 'O-',
    status: 'IN_TRANSIT',
    priority: 'STAT',
    shortId: 'JOB001',
    route: {
      source: 'NBTS Gaborone',
      destination: 'Princess Marina Hospital',
      distance: '8.4 km',
      eta: '18 min',
      destCoords: [-24.6545, 25.9086],
    },
    payload: '2 units packed RBC',
    manifestId: 'MAN-24001',
    donor: null,
    courierId: 'Voyager-01',
    custodyLog: {
      pickupTime: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      pickupBy: 'Demo Dispatcher',
    },
    incidents: [],
    updatedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'job-002',
    bloodType: 'A+',
    status: 'PENDING',
    priority: 'NORMAL',
    shortId: 'JOB002',
    route: {
      source: 'NBTS Francistown',
      destination: 'Nyangabwe Referral Hospital',
      distance: '5.2 km',
      eta: '11 min',
      destCoords: [-21.1702, 27.5075],
    },
    payload: '1 platelet shipment',
    manifestId: 'MAN-24002',
    donor: null,
    courierId: 'Voyager-02',
    custodyLog: {},
    incidents: [],
    updatedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
]

/** Map a BloodAsset from bloodchain-core into Voyager's "job" shape */
function toJob(asset) {
  return {
    id: asset.id,
    bloodType: asset.bloodType,
    status: asset.status,           // COLLECTED | RELEASED | IN_TRANSIT | USED | etc.
    priority: 'NORMAL',
    shortId: asset.id.slice(-10).toUpperCase(),
    route: {
      source: asset.currentLocation ?? 'NBTS',
      destination: asset.donor?.facilityId ?? 'Hospital',
    },
    donor: asset.donor ?? null,
    custodyLog: {},
    incidents: [],
    updatedAt: asset.updatedAt,
    createdAt: asset.createdAt,
  }
}

/** Fetch RELEASED units ready for pickup + IN_TRANSIT ones already accepted */
export async function fetchJobs() {
  if (isGuestDemo()) {
    return DEMO_JOBS
  }
  try {
    const [releasedRes, transitRes] = await Promise.all([
      apiClient.get('/assets?status=RELEASED'),
      apiClient.get('/assets?status=IN_TRANSIT'),
    ])
    const released = (releasedRes.data?.data ?? []).map(toJob)
    const inTransit = (transitRes.data?.data ?? []).map(toJob)
    return [...inTransit, ...released]
  } catch {
    return []
  }
}

/** Update a blood unit's status to IN_TRANSIT or back to RELEASED on delivery */
export async function scanAsset(assetId, newStatus, location) {
  if (isGuestDemo()) {
    return { id: assetId, status: newStatus, currentLocation: location }
  }
  const { data } = await apiClient.post('/assets/scan', { assetId, newStatus, location })
  return data.data
}

/** Fetch the custody chain for a single blood unit */
export async function getAssetCustody(assetId) {
  if (isGuestDemo()) {
    return { id: assetId, events: [] }
  }
  try {
    const { data } = await apiClient.get(`/assets/${assetId}/custody`)
    return data
  } catch {
    return null
  }
}
