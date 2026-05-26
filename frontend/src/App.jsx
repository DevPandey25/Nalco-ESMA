import { insforge } from "./lib/insforge.js"
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { useAppStore } from './store/useAppStore';
import { Analytics } from '@vercel/analytics/react';



const LoginPage = lazy(() => import('./pages/LoginPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RequestForm = lazy(() => import('./pages/RequestForm'));
const DataManagement = lazy(() => import('./pages/DataManagement'));
const Approvals = lazy(() => import('./pages/Approvals'));
const Reports = lazy(() => import('./pages/Reports'));
const ReceiptPage = lazy(() => import('./pages/ReceiptPage'));

// Protected Route Component
const AuthGuard = ({ children }) => {
  const isAuthenticated = useAppStore(state => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {


  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-nalco-beige">
          <div className="w-12 h-12 border-4 border-nalco-blue/20 border-t-nalco-blue rounded-full animate-spin" />
        </div>
      }>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Standalone Protected Routes (No App Layout sidebar/navbar) */}
          <Route path="/receipt/:id" element={<AuthGuard><ReceiptPage /></AuthGuard>} />
          <Route path="/admin/receipt/:id" element={<AuthGuard><ReceiptPage isAdmin={true} /></AuthGuard>} />

          {/* Protected Routes with layout */}
          <Route element={<AuthGuard><MainLayout /></AuthGuard>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/request" element={<RequestForm />} />
            <Route path="/data" element={<DataManagement />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Suspense>
      <Analytics />
    </BrowserRouter>
  );
}
