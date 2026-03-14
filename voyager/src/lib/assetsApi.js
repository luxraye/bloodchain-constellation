/**
 * Voyager Assets API — wired to bloodchain-core
 * Replaces the localStorage phantom adapter.
 * Exports the same function names so JobContext needs zero changes.
 */
import apiClient from './api.js'

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
  const { data } = await apiClient.post('/assets/scan', { assetId, newStatus, location })
  return data.data
}

/** Fetch the custody chain for a single blood unit */
export async function getAssetCustody(assetId) {
  try {
    const { data } = await apiClient.get(`/assets/${assetId}/custody`)
    return data
  } catch {
    return null
  }
}
