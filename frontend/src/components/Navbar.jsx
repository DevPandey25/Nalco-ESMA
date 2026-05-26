import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import HamburgerMenu from './HamburgerMenu';
import nalcoLogo from '../assets/nalco-logo.png';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/request', label: 'Request Form' },
  { path: '/data', label: 'Data Management' },
  { path: '/approvals', label: 'Approvals' },
  { path: '/reports', label: 'Reports' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAppStore(state => state.user);
  const logout = useAppStore(state => state.logout);
  const openProfileSettings = useAppStore(state => state.openProfileSettings);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleExportCSV = () => {
    // Basic stub for exporting CSV
    const csvContent = "data:text/csv;charset=utf-8,ID,Status,Employee\n1,Draft,John Doe";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "nalco_esma_requests.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-enterprise-line shadow-sm px-6 h-20 flex items-center justify-between">
        {/* Left Side: Brand & Hamburger */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-enterprise-soft rounded-lg transition-colors group"
            aria-label="Open Menu"
          >
            <div className="space-y-1.5">
              <span className="block w-6 h-0.5 bg-nalco-blue group-hover:bg-nalco-red transition-colors" />
              <span className="block w-6 h-0.5 bg-nalco-blue group-hover:bg-nalco-red transition-colors" />
              <span className="block w-4 h-0.5 bg-nalco-blue group-hover:bg-nalco-red transition-colors" />
            </div>
          </button>
          
          <div className="flex items-center space-x-3">
            <img src={nalcoLogo} alt="NALCO Logo" className="h-10 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="text-xl font-black text-nalco-blue leading-tight tracking-tighter">NALCO ESMA</span>
              <span className="text-[10px] font-bold text-nalco-red uppercase tracking-widest leading-none">Enterprise Workflow</span>
            </div>
          </div>
        </div>

        {/* Right Side: Navigation & User */}
        <div className="flex items-center space-x-2">
          {/* Main Nav Links */}
          <div className="hidden lg:flex items-center space-x-1 mr-4">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform active:scale-95
                  ${isActive 
                    ? 'text-nalco-red bg-red-50' 
                    : 'text-enterprise-muted hover:text-nalco-blue hover:bg-enterprise-soft'}
                `}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <button 
            onClick={handleExportCSV}
            className="hidden md:flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 transform active:scale-95 hover:shadow-lg hover:-translate-y-0.5 mr-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export CSV</span>
          </button>

          <div className="h-8 w-px bg-enterprise-line mx-2 hidden lg:block" />

          {/* User Profile */}
          <div className="flex items-center space-x-4 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-enterprise-ink">{user?.name || 'Employee'}</p>
              <p className="text-[10px] font-medium text-enterprise-muted uppercase">{user?.title || 'Staff'}</p>
            </div>
            
            <div className="relative group">
              <button className="w-10 h-10 rounded-full bg-nalco-blue flex items-center justify-center text-white font-bold text-sm shadow-md transition-transform active:scale-95">
                {user?.name?.charAt(0) || 'E'}
              </button>
              
              {/* Simple Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white border border-enterprise-line rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                <div className="p-2 space-y-1">
                  <button 
                    onClick={openProfileSettings}
                    className="w-full text-left px-4 py-2 text-sm font-semibold text-[#004b8d] hover:bg-enterprise-soft rounded-lg"
                  >
                    Profile Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm font-semibold text-nalco-red hover:bg-red-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
