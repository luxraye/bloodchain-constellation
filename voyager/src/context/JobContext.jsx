import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { fetchJobs, scanAsset } from '../lib/assetsApi.js';

const JobContext = createContext(null);

const defaultDriver = {
    id: 'courier',
    name: 'Courier',
    callsign: 'Voyager',
    vehicle: '—',
    region: '—',
    totalDeliveries: 0,
    activeJobId: null,
};

const initialState = {
    jobs: [],
    driver: defaultDriver,
    activeJobId: null,
    jobsLoading: true,
    jobsError: null,
};

function jobReducer(state, action) {
    switch (action.type) {
        case 'ACCEPT_JOB':
            return {
                ...state,
                activeJobId: action.payload.jobId,
                jobs: state.jobs.map(job =>
                    job.id === action.payload.jobId
                        ? {
                            ...job,
                            status: 'IN_TRANSIT',
                            custodyLog: {
                                ...job.custodyLog,
                                pickupTime: new Date().toISOString(),
                                pickupBy: state.driver.name,
                                pickupLocation: job.route.source,
                            }
                        }
                        : job
                ),
            };

        case 'CONFIRM_PICKUP':
            return {
                ...state,
                jobs: state.jobs.map(job =>
                    job.id === action.payload.jobId
                        ? {
                            ...job,
                            status: 'IN_TRANSIT',
                            custodyLog: {
                                ...job.custodyLog,
                                pickupTime: new Date().toISOString(),
                                pickupBy: action.payload.handoverFrom || state.driver.name,
                                pickupLocation: job.route.source,
                            }
                        }
                        : job
                ),
            };

        case 'CONFIRM_DELIVERY':
            return {
                ...state,
                jobs: state.jobs.map(job =>
                    job.id === action.payload.jobId
                        ? {
                            ...job,
                            status: 'DELIVERED',
                            custodyLog: {
                                ...job.custodyLog,
                                deliveryTime: new Date().toISOString(),
                                deliveryBy: action.payload.handoverTo || 'Lab Tech',
                                deliveryLocation: job.route.destination,
                            }
                        }
                        : job
                ),
                activeJobId: state.activeJobId === action.payload.jobId ? null : state.activeJobId,
            };

        case 'REPORT_INCIDENT':
            return {
                ...state,
                jobs: state.jobs.map(job =>
                    job.id === action.payload.jobId
                        ? {
                            ...job,
                            status: 'FLAGGED',
                            incidents: [
                                ...job.incidents,
                                {
                                    type: action.payload.incident.type,
                                    severity: action.payload.incident.severity,
                                    timestamp: new Date().toISOString(),
                                    note: action.payload.incident.note,
                                }
                            ],
                        }
                        : job
                ),
            };

        case 'SET_ACTIVE_JOB':
            return { ...state, activeJobId: action.payload.jobId };

        case 'SET_JOBS':
            return { ...state, jobs: action.payload.jobs, jobsLoading: false, jobsError: null };
        case 'SET_JOBS_LOADING':
            return { ...state, jobsLoading: true, jobsError: null };
        case 'SET_JOBS_ERROR':
            return { ...state, jobsLoading: false, jobsError: action.payload.message };

        default:
            return state;
    }
}

export function JobProvider({ children }) {
    const [state, dispatch] = useReducer(jobReducer, initialState);

    const refreshJobs = useCallback(async () => {
        dispatch({ type: 'SET_JOBS_LOADING' });
        try {
            const jobs = await fetchJobs();
            dispatch({ type: 'SET_JOBS', payload: { jobs } });
        } catch (err) {
            dispatch({ type: 'SET_JOBS_ERROR', payload: { message: err?.message || 'Failed to load jobs' } });
        }
    }, []);

    useEffect(() => {
        refreshJobs();
    }, [refreshJobs]);

    const acceptJob = useCallback(async (jobId) => {
        try {
            await scanAsset(jobId, 'IN_TRANSIT', 'Courier Vehicle');
            dispatch({ type: 'ACCEPT_JOB', payload: { jobId } });
            await refreshJobs();
        } catch (err) {
            console.error('Accept job failed:', err);
        }
    }, [refreshJobs]);

    const confirmPickup = useCallback((jobId, handoverFrom) => {
        dispatch({ type: 'CONFIRM_PICKUP', payload: { jobId, handoverFrom } });
    }, []);

    const confirmDelivery = useCallback(async (jobId, handoverTo) => {
        try {
            // Mark asset RELEASED at delivery destination — scyther marks it USED after transfusion
            const job = state.jobs.find(j => j.id === jobId)
            const destination = job?.route?.destination ?? 'Hospital Blood Bank'
            await scanAsset(jobId, 'RELEASED', destination)
            dispatch({ type: 'CONFIRM_DELIVERY', payload: { jobId, handoverTo } })
            await refreshJobs()
        } catch (err) {
            console.error('Confirm delivery failed:', err)
        }
    }, [refreshJobs, state.jobs])

    const reportIncident = useCallback((jobId, incident) => {
        dispatch({ type: 'REPORT_INCIDENT', payload: { jobId, incident } });
    }, []);

    const setActiveJob = useCallback((jobId) => {
        dispatch({ type: 'SET_ACTIVE_JOB', payload: { jobId } });
    }, []);

    const getActiveJob = useCallback(() => {
        return state.jobs.find(j => j.id === state.activeJobId) || null;
    }, [state.jobs, state.activeJobId]);

    const value = {
        ...state,
        acceptJob,
        confirmPickup,
        confirmDelivery,
        reportIncident,
        setActiveJob,
        getActiveJob,
        refreshJobs,
    };

    return (
        <JobContext.Provider value={value}>
            {children}
        </JobContext.Provider>
    );
}

export function useJobs() {
    const ctx = useContext(JobContext);
    if (!ctx) throw new Error('useJobs must be used within a JobProvider');
    return ctx;
}
