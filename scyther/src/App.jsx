import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useAuth } from './hooks/useAuth';
import Layout from './layouts/Layout';
import DevSyncTool from './components/DevSyncTool';
import LoginScreen from './components/LoginScreen';
import DonorCheckIn from './pages/collection/DonorCheckIn';
import MedicalScreening from './pages/collection/MedicalScreening';
import Phlebotomy from './pages/collection/Phlebotomy';
import InventoryDashboard from './pages/clinical/InventoryDashboard';
import RequestManagement from './pages/clinical/RequestManagement';
import TransfusionLog from './pages/clinical/TransfusionLog';
import StandbyDonors from './pages/clinical/StandbyDonors';
import ProfilePage from './pages/ProfilePage';

const ALLOWED_ROLES = ['MEDICAL', 'ADMIN', 'LAB', 'NURSE', 'CLINICAL', 'STAFF', 'DOCTOR'];

function AccessDenied() {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center">
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-2">
        <span className="text-2xl">🔒</span>
      </div>
      <h1 className="text-xl font-bold text-slate-900">Access Denied</h1>
      <p className="text-sm text-slate-500 max-w-sm">
        <span className="font-medium text-slate-800">{user?.name}</span>, your role
        (<span className="font-mono text-brand-red-600">{user?.role}</span>) does not have
        access to Scyther. Contact your system administrator.
      </p>
      <button onClick={() => logout()} className="mt-2 rounded-lg bg-brand-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-red-700 transition">
        Log out
      </button>
    </div>
  );
}

function App() {
  const { user, loading, hasRole } = useAuth();
  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="h-8 w-8 rounded-full border-2 border-brand-red-200 border-t-brand-red-600 animate-spin" />
    </div>
  );
  if (!user) return <LoginScreen />;
  if (!hasRole(...ALLOWED_ROLES)) return <AccessDenied />;

  return (
    <>
      <BrowserRouter>
        <AppProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Default redirect */}
              <Route index element={<Navigate to="/collection/check-in" replace />} />

              {/* Collection Centre */}
              <Route path="collection/check-in" element={<DonorCheckIn />} />
              <Route path="collection/screening" element={<MedicalScreening />} />
              <Route path="collection/phlebotomy" element={<Phlebotomy />} />

              {/* Clinical / Hospital */}
              <Route path="clinical/inventory" element={<InventoryDashboard />} />
              <Route path="clinical/requests" element={<RequestManagement />} />
              <Route path="clinical/standby" element={<StandbyDonors />} />
              <Route path="clinical/transfusion" element={<TransfusionLog />} />

              {/* Profile */}
              <Route path="profile" element={<ProfilePage />} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/collection/check-in" replace />} />
            </Route>
          </Routes>
        </AppProvider>
      </BrowserRouter>
      <DevSyncTool />
    </>
  );
}

export default App;
