import api from '../lib/api';

const isGuestDemo = () =>
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('guest') === '1';

const DEMO_USERS: User[] = [
    { id: 'admin-001', email: 'giftjrnakedi@gmail.com', name: 'Gift Nakedi', role: 'ADMIN', facilityId: 'MoH HQ', status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'lab-001', email: 'lab.demo@bloodchain.local', name: 'Lesego Molefe', role: 'LAB', facilityId: 'NBTS Gaborone', status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'med-001', email: 'medical.demo@bloodchain.local', name: 'Kea Bantsi', role: 'MEDICAL', facilityId: 'Princess Marina Hospital', status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'transit-001', email: 'transit.demo@bloodchain.local', name: 'Thabo Mpho', role: 'TRANSIT', facilityId: 'NBTS Francistown Depot', status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

const DEMO_ASSET_STATUS = { RELEASED: 24, IN_TRANSIT: 6, TESTING: 9, QUARANTINE: 4, DISCARDED: 2, USED: 37 }

const DEMO_WASTAGE: TremorDataPoint[] = [
    { date: '2026-04-01', 'O+': 1, 'A+': 1, 'B+': 0, 'A-': 0, 'AB+': 0, Discarded: 2 },
    { date: '2026-04-08', 'O+': 2, 'A+': 0, 'B+': 1, 'A-': 0, 'AB+': 0, Discarded: 3 },
    { date: '2026-04-15', 'O+': 0, 'A+': 0, 'B+': 0, 'A-': 1, 'AB+': 1, Discarded: 2 },
]

const DEMO_LEDGER_ROWS: LedgerRow[] = [
    { id: 'led-001', assetId: 'asset-001', actionPerformed: 'Collected', userId: 'med-001', userName: 'Kea Bantsi', userRole: 'MEDICAL', userEmail: 'medical.demo@bloodchain.local', facility: 'Princess Marina Hospital', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'led-002', assetId: 'asset-001', actionPerformed: 'In Transit', userId: 'transit-001', userName: 'Thabo Mpho', userRole: 'TRANSIT', userEmail: 'transit.demo@bloodchain.local', facility: 'NBTS Route 1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

// ─── Types aligned with Phase 2 Backend Contract ─────

export interface SystemStats {
    totalUsers: number;
    totalAssets: number;
    assetsByStatus: Record<string, number>;
}

export interface DashboardStats {
    nationalSupply: number;
    activeLogistics: number;
    testingQueue: number;
    wastageRate: number;
    totalDonors: number;
    totalUnits: number;
    criticalAlerts: number;
    assetsByStatus: Record<string, number>;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'PUBLIC' | 'MEDICAL' | 'LAB' | 'TRANSIT' | 'ADMIN' | 'LOGISTICS_COMMAND' | 'SUPER_ADMIN' | 'MOH_AUDITOR';
    facilityId: string | null;
    status: 'ACTIVE' | 'SUSPENDED';
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserPayload {
    email: string;
    name: string;
    role: string;
    facilityId?: string;
}

// ─── GeoJSON Types (Phase 2 — MapLibre/Deck.gl contract) ─

export interface GeoJSONFeature {
    type: 'Feature';
    geometry: {
        type: 'Point' | 'LineString';
        coordinates: number[] | number[][];
    };
    properties: Record<string, unknown>;
}

export interface GeoJSONFeatureCollection {
    type: 'FeatureCollection';
    features: GeoJSONFeature[];
}

// Mapped types consumed by Leaflet (Dashboard.tsx)
export interface MapNode {
    id: string;
    name: string;
    type: string;
    lat: number;
    lng: number;
    status: string;
    inventory?: number;
}

export interface TransitRoute {
    id: string;
    courierName: string;
    from: { lat: number; lng: number; name: string };
    to: { lat: number; lng: number; name: string };
    status: string;
    bloodType: string;
}

// ─── TanStack Table Types (Phase 2 — Ledger) ─────────

export interface LedgerRow {
    id: string;
    assetId: string | null;
    actionPerformed: string;
    userId: string;
    userName: string;
    userRole: string;
    userEmail: string;
    facility: string;
    createdAt: string;
    updatedAt: string;
}

export interface LedgerMeta {
    totalRowCount: number;
    pageCount: number;
    pageIndex: number;
    pageSize: number;
}

export interface LedgerResponse {
    success: boolean;
    data: LedgerRow[];
    meta: LedgerMeta;
}

// ─── Tremor Types (Phase 2 — Wastage) ────────────────

export type TremorDataPoint = Record<string, string | number>;

// ─── Legacy types for backward compat ────────────────

export interface LedgerEntry {
    id: string;
    unitId: string;
    donorName: string;
    bloodType: string;
    currentLocation: string;
    status: string;
    collectedAt: string;
    expiresAt: string;
    chainOfCustody: CustodyEvent[];
}

export interface CustodyEvent {
    timestamp: string;
    actor: string;
    action: string;
    location: string;
    txHash: string;
}

export interface WastageTrend {
    month: string;
    collected: number;
    used: number;
    wasted: number;
    expired: number;
}

// ─── Backend response wrapper ────────────────────────

interface ApiResponse<T> {
    success: boolean;
    data: T;
    meta?: Record<string, unknown>;
    error?: string;
}

// ─── Service ─────────────────────────────────────────

export const adminService = {
    // ── Stats (maps backend shape → dashboard shape) ──
    fetchSystemStats: async (): Promise<DashboardStats> => {
        if (isGuestDemo()) {
            const totalAssets = Object.values(DEMO_ASSET_STATUS).reduce((sum, value) => sum + value, 0)
            return {
                nationalSupply: totalAssets,
                activeLogistics: DEMO_ASSET_STATUS.IN_TRANSIT,
                testingQueue: DEMO_ASSET_STATUS.TESTING,
                wastageRate: Math.round((DEMO_ASSET_STATUS.DISCARDED / totalAssets) * 100),
                totalDonors: 1284,
                totalUnits: totalAssets,
                criticalAlerts: DEMO_ASSET_STATUS.QUARANTINE,
                assetsByStatus: DEMO_ASSET_STATUS,
            };
        }
        const res = await api.get<ApiResponse<SystemStats>>('/admin/stats');
        const s = res.data.data;
        return {
            nationalSupply: s.totalAssets,
            activeLogistics: s.assetsByStatus['IN_TRANSIT'] || 0,
            testingQueue: s.assetsByStatus['TESTING'] || 0,
            wastageRate: s.totalAssets > 0
                ? Math.round(((s.assetsByStatus['DISCARDED'] || 0) / s.totalAssets) * 100)
                : 0,
            totalDonors: s.totalUsers,
            totalUnits: s.totalAssets,
            criticalAlerts: (s.assetsByStatus['QUARANTINE'] || 0),
            assetsByStatus: s.assetsByStatus,
        };
    },

    // ── Users ──
    fetchUsers: async (params?: { page?: number; limit?: number; role?: string }): Promise<{ users: User[]; total: number }> => {
        if (isGuestDemo()) {
            const filtered = params?.role && params.role !== 'ALL'
                ? DEMO_USERS.filter((user) => user.role === params.role)
                : DEMO_USERS
            return { users: filtered, total: filtered.length }
        }
        const queryParams: Record<string, string> = {};
        if (params?.role && params.role !== 'ALL') queryParams.role = params.role;
        if (params?.page) queryParams.page = String(params.page);
        if (params?.limit) queryParams.limit = String(params.limit);

        const res = await api.get<ApiResponse<User[]>>('/admin/users', { params: queryParams });
        const meta = res.data.meta as Record<string, number> | undefined;
        return {
            users: res.data.data,
            total: meta?.total ?? res.data.data.length,
        };
    },

    createUser: async (data: CreateUserPayload): Promise<User> => {
        if (isGuestDemo()) {
            return {
                id: `demo-user-${Date.now()}`,
                email: data.email,
                name: data.name,
                role: data.role as User['role'],
                facilityId: data.facilityId ?? null,
                status: 'ACTIVE',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tempPassword: 'demo-only',
            } as User;
        }
        const res = await api.post<ApiResponse<User>>('/admin/users', data);
        return res.data.data;
    },

    deleteUser: async (id: string): Promise<void> => {
        if (isGuestDemo()) return;
        await api.delete(`/admin/users/${id}`);
    },

    // ── Map Nodes (GeoJSON → Leaflet-friendly) ──
    fetchMapNodes: async (): Promise<MapNode[]> => {
        if (isGuestDemo()) {
            return [
                { id: 'node-001', name: 'NBTS Gaborone', type: 'LAB', lat: -24.6545, lng: 25.9086, status: 'ONLINE', inventory: 62 },
                { id: 'node-002', name: 'Princess Marina Hospital', type: 'HOSPITAL', lat: -24.661, lng: 25.913, status: 'ONLINE', inventory: 18 },
            ];
        }
        const res = await api.get<ApiResponse<GeoJSONFeatureCollection>>('/admin/map-nodes');
        const fc = res.data.data;
        return fc.features.map((f) => ({
            id: f.properties.facilityId as string,
            name: f.properties.name as string,
            type: f.properties.type as string,
            lat: (f.geometry.coordinates as number[])[1],  // GeoJSON is [lng, lat]
            lng: (f.geometry.coordinates as number[])[0],
            status: 'ONLINE',
            inventory: f.properties.currentInventoryLevel as number | undefined,
        }));
    },

    // ── Transit Routes (GeoJSON → Leaflet-friendly) ──
    fetchTransitRoutes: async (): Promise<TransitRoute[]> => {
        if (isGuestDemo()) {
            return [
                {
                    id: 'route-001',
                    courierName: 'Demo Courier',
                    from: { lat: -24.6545, lng: 25.9086, name: 'NBTS Gaborone' },
                    to: { lat: -24.661, lng: 25.913, name: 'Princess Marina Hospital' },
                    status: 'IN_TRANSIT',
                    bloodType: 'O-',
                },
            ];
        }
        const res = await api.get<ApiResponse<GeoJSONFeatureCollection>>('/admin/transit-routes');
        const fc = res.data.data;
        return fc.features.map((f) => {
            const coords = f.geometry.coordinates as number[][];
            return {
                id: f.properties.dispatchId as string,
                courierName: f.properties.courierName as string,
                from: { lng: coords[0][0], lat: coords[0][1], name: f.properties.originFacility as string },
                to: { lng: coords[1][0], lat: coords[1][1], name: f.properties.destinationFacility as string },
                status: f.properties.status as string,
                bloodType: f.properties.bloodType as string,
            };
        });
    },

    // ── Wastage Trends (Tremor-ready — direct passthrough) ──
    fetchWastageTrends: async (days: number = 30): Promise<TremorDataPoint[]> => {
        if (isGuestDemo()) return DEMO_WASTAGE.slice(0, Math.max(1, Math.min(DEMO_WASTAGE.length, Math.ceil(days / 30))));
        const res = await api.get<ApiResponse<TremorDataPoint[]>>('/admin/wastage-trends', {
            params: { days },
        });
        return res.data.data;
    },

    // ── Wastage by Facility (Tremor-ready) ──
    fetchWastageByFacility: async (days: number = 30): Promise<TremorDataPoint[]> => {
        if (isGuestDemo()) {
            return [
                { facility: 'NBTS Gaborone', Discarded: 2, days },
                { facility: 'Princess Marina Hospital', Discarded: 1, days },
            ];
        }
        const res = await api.get<ApiResponse<TremorDataPoint[]>>('/admin/wastage-by-facility', {
            params: { days },
        });
        return res.data.data;
    },

    // ── Global Ledger (TanStack Table — server-side pagination) ──
    fetchLedger: async (params?: {
        pageIndex?: number;
        pageSize?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        filterAction?: string;
        filterRole?: string;
        filterFacility?: string;
        dateFrom?: string;
        dateTo?: string;
    }): Promise<LedgerResponse> => {
        if (isGuestDemo()) {
            return {
                success: true,
                data: DEMO_LEDGER_ROWS,
                meta: {
                    totalRowCount: DEMO_LEDGER_ROWS.length,
                    pageCount: 1,
                    pageIndex: params?.pageIndex ?? 0,
                    pageSize: params?.pageSize ?? DEMO_LEDGER_ROWS.length,
                },
            };
        }
        const res = await api.get<LedgerResponse>('/admin/ledger', { params });
        return res.data;
    },
};
