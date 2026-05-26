import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const WORKFLOW_CATEGORIES = [
  { id: 'all', label: 'All Requests', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { id: 'DRAFT', label: 'Draft', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { id: 'SUBMITTED', label: 'Submitted', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { id: 'RECOMMENDED', label: 'Recommended', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
  { id: 'APPROVED', label: 'Approved', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'rejected', label: 'Rejected', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'IMPLEMENTED', label: 'Implemented', icon: 'M5 13l4 4L19 7' },
];

export default function HamburgerMenu({ isOpen, onClose }) {
  const navigate = useNavigate();
  const setFilters = useAppStore(state => state.setFilters);

  const handleCategoryClick = (id) => {
    // Update global filter state to match the clicked category tab
    setFilters({ activeTab: id, status: 'all', page: 1 });
    navigate('/data');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          
          {/* Menu Drawer */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-72 bg-white shadow-2xl z-[101] flex flex-col"
          >
            <div className="p-6 border-b border-enterprise-line bg-nalco-blue text-white flex items-center justify-between">
              <div>
                <h3 className="text-white text-lg font-bold">Workflow</h3>
                <p className="text-white/70 text-xs uppercase tracking-wider font-bold">Categories</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-4 mb-2 mt-2">
                <span className="text-[10px] font-bold text-enterprise-muted uppercase tracking-widest">Navigation</span>
              </div>
              <nav className="px-2 space-y-1 mb-6">
                <button
                  onClick={() => { navigate('/dashboard'); onClose(); }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-enterprise-ink hover:bg-nalco-blue/5 hover:text-nalco-blue transition-all group"
                >
                  <svg className="w-5 h-5 text-enterprise-muted group-hover:text-nalco-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  <span className="font-medium">Dashboard</span>
                </button>
                <button
                  onClick={() => { navigate('/request'); onClose(); }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-nalco-blue bg-blue-50 hover:bg-nalco-blue/10 transition-all group border border-blue-100"
                >
                  <svg className="w-5 h-5 text-nalco-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                  <span className="font-bold">New Request</span>
                </button>
              </nav>

              <div className="px-4 mb-2 border-t border-enterprise-line pt-4">
                <span className="text-[10px] font-bold text-enterprise-muted uppercase tracking-widest">Main Pipeline</span>
              </div>
              <nav className="px-2 space-y-1">
                {WORKFLOW_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-enterprise-ink hover:bg-nalco-blue/5 hover:text-nalco-blue transition-all group"
                  >
                    <svg className="w-5 h-5 text-enterprise-muted group-hover:text-nalco-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={category.icon} />
                    </svg>
                    <span className="font-medium">{category.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-4 border-t border-enterprise-line bg-enterprise-soft">
              <div className="bg-white p-3 rounded-lg border border-enterprise-line shadow-sm">
                <p className="text-[10px] font-bold text-enterprise-muted uppercase mb-2">System Status</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-enterprise-ink">Operational</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
