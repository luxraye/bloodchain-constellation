import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getUsers, getAssets } from '../lib/api.js';
import { getInventoryByType } from '../lib/collectionHelpers.js';

const AppContext = createContext(null);

function mapUserToDonor(user) {
    const name = user.name || user.email || 'Donor';
    const parts = name.split(' ');
    return {
        id: user.id,
        omang: user.omang || '',
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth || '',
        bloodType: user.bloodType || '',
        phone: user.phone || '',
        email: user.email || '',
        lastDonation: user.lastDonation || null,
        totalDonations: user.totalDonations ?? 0,
        status: user.status || 'ELIGIBLE',
    };
}

export function AppProvider({ children }) {
    const [mode, setMode] = useState('collection');
    const [donors, setDonors] = useState([]);
    const [donorsLoading, setDonorsLoading] = useState(true);
    const [bloodUnits, setBloodUnits] = useState([]);
    const [unitsLoading, setUnitsLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [transfusions, setTransfusions] = useState([]);
    const [activeDonor, setActiveDonor] = useState(null);
    const [activeScreening, setActiveScreening] = useState(null);
    const [standbyDonors, setStandbyDonors] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const inventory = getInventoryByType(bloodUnits);

    useEffect(() => {
        let cancelled = false;
        getUsers()
            .then(res => {
                if (cancelled || !res?.data) return;
                setDonors((res.data || []).map(mapUserToDonor));
            })
            .catch(() => { if (!cancelled) setDonors([]); })
            .finally(() => { if (!cancelled) setDonorsLoading(false); });
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        let cancelled = false;
        getAssets()
            .then(res => {
                if (cancelled || !res?.data) return;
                const list = res.data || [];
                setBloodUnits(list.map(a => ({
                    id: a.id,
                    type: a.bloodType,
                    donorId: a.donorId,
                    collectedAt: a.createdAt,
                    expiresAt: a.expiresAt || null,
                    status: a.status,
                    location: a.currentLocation,
                })));
            })
            .catch(() => { if (!cancelled) setBloodUnits([]); })
            .finally(() => { if (!cancelled) setUnitsLoading(false); });
        return () => { cancelled = true; };
    }, []);

    const addNotification = useCallback((message, type = 'info') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 4000);
    }, []);

    const addBloodUnit = useCallback((unit) => {
        setBloodUnits(prev => [...prev, unit]);
        addNotification(`Unit ${unit.id} added to quarantine`, 'success');
    }, [addNotification]);

    const updateRequest = useCallback((id, updates) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    }, []);

    const addTransfusion = useCallback((txn) => {
        setTransfusions(prev => [...prev, txn]);
        setBloodUnits(prev => prev.map(u => u.id === txn.unitId ? { ...u, status: 'USED' } : u));
        addNotification(`Transfusion ${txn.id} recorded — unit marked USED`, 'success');
    }, [addNotification]);

    const updateStandbyDonor = useCallback((id, updates) => {
        setStandbyDonors(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    }, []);

    const value = {
        mode,
        setMode,
        donors,
        donorsLoading,
        bloodUnits,
        setBloodUnits,
        unitsLoading,
        requests,
        setRequests,
        transfusions,
        inventory,
        activeDonor,
        setActiveDonor,
        activeScreening,
        setActiveScreening,
        addBloodUnit,
        updateRequest,
        addTransfusion,
        standbyDonors,
        updateStandbyDonor,
        notifications,
        addNotification,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
}
