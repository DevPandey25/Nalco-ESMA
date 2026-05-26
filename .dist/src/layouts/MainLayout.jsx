import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SummaryCards from '../components/SummaryCards';
import Toast from '../components/Toast';
import DetailModal from '../components/modals/DetailModal';
import WorkflowModal from '../components/modals/WorkflowModal';
import EmailPreviewModal from '../components/modals/EmailPreviewModal';
import ProfileSettingsModal from '../components/modals/ProfileSettingsModal';
import { useAppStore } from '../store/useAppStore';

export default function MainLayout() {
  const fetchRequests = useAppStore(state => state.fetchRequests);
  const role = useAppStore(state => state.role);
  const isAuthenticated = useAppStore(state => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests();
    }
  }, [fetchRequests, role, isAuthenticated]);
  return (
    <div className="min-h-screen bg-nalco-beige flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full px-4 md:px-8 lg:px-12 py-6 flex flex-col space-y-6 mx-auto">
        <SummaryCards />
        <div className="enterprise-card p-6 bg-white w-full min-h-[600px] flex-1 overflow-x-auto overflow-y-hidden">
          <Outlet />
        </div>
      </main>
      
      {/* Global Overlays */}
      <DetailModal />
      <WorkflowModal />
      <EmailPreviewModal />
      <ProfileSettingsModal />
      <Toast />
      
      <footer className="py-6 px-8 text-center border-t border-enterprise-line text-enterprise-muted text-[10px] uppercase tracking-widest font-bold bg-white mt-auto">
        NALCO ESMA &copy; {new Date().getFullYear()} Enterprise Workflow System
      </footer>
    </div>
  );
}
