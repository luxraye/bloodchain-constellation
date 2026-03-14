import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { JobProvider } from './context/JobContext';
import ShiftSyncLog from './components/ShiftSyncLog.jsx';
import { useAuth } from './hooks/useAuth';
import BottomNav from './components/BottomNav';
import Navbar from './components/Navbar';
import DevSyncTool from './components/DevSyncTool';
import JobFeed from './pages/JobFeed';
import ActiveJob from './pages/ActiveJob';
import MapView from './pages/MapView';
import Profile from './pages/Profile';
import LoginScreen from './components/LoginScreen';

const ALLOWED_ROLES = ['TRANSIT', 'ADMIN', 'LOGISTICS_COMMAND', 'SUPER_ADMIN'];

function AccessDenied() {
    const { user, logout } = useAuth();
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-950 flex items-center justify-center mb-2">
                <span className="text-2xl">🔒</span>
            </div>
            <h1 className="text-xl font-bold text-slate-100">Access Denied</h1>
            <p className="text-sm text-slate-400 max-w-sm">
                <span className="font-medium text-slate-200">{user.name}</span>, your role
                (<span className="font-mono text-sky-400">{user.role}</span>) does not have
                access to Voyager. Only <span className="font-mono text-sky-400">TRANSIT</span>, <span className="font-mono text-sky-400">LOGISTICS_COMMAND</span>, or restricted admin clearance users can use this app.
            </p>
            <button onClick={() => logout()} className="mt-2 rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-500 transition">
                Log out
            </button>
        </div>
    );
}

export default function App() {
    const { user, loading, hasRole } = useAuth();

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900">
            <div className="h-8 w-8 rounded-full border-2 border-sky-800 border-t-sky-400 animate-spin" />
        </div>
    );
    if (!user) {
        return <LoginScreen />;
    }
    if (!hasRole(...ALLOWED_ROLES)) {
        return <AccessDenied />;
    }
    return (
        <>
            <BrowserRouter>
                <JobProvider>
                    <div className="flex h-screen w-screen max-w-lg mx-auto flex-col bg-slate-900 relative overflow-hidden">
                        <Navbar />
                        <div className="flex-1 overflow-hidden">
                            <Routes>
                                <Route path="/" element={<JobFeed />} />
                                <Route path="/active" element={<ActiveJob />} />
                                <Route path="/map" element={<MapView />} />
                                <Route path="/profile" element={<Profile />} />
                            </Routes>
                        </div>
                        <BottomNav />
                    </div>
                </JobProvider>
            </BrowserRouter>
            <DevSyncTool />
            <ShiftSyncLog />
        </>
    );
}
