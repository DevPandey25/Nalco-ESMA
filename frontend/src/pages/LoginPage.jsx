import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import nalcoLogo from '../assets/nalco-logo.png';

export default function LoginPage() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('Employee');
  
  const login = useAppStore(state => state.login);
  const setRole = useAppStore(state => state.setRole);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!employeeId || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    // Execute Real API Call
    const success = await login(employeeId, password, selectedRole);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials or Server Error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-height-screen flex items-center justify-center bg-nalco-beige p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="enterprise-card overflow-hidden">
          {/* Header */}
          <div className="bg-nalco-blue p-8 text-center text-white relative">
            <div className="flex flex-col items-center justify-center">
              <img src={nalcoLogo} alt="NALCO Logo" className="h-16 w-auto object-contain bg-white p-2 rounded-lg shadow-md mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">NALCO ESMA</h1>
              <p className="text-blue-100/80 text-sm">Enterprise Service Management Automation</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-enterprise-muted uppercase mb-1.5 ml-1">
                  Employee ID / Email
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. NALCO-12345"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-enterprise-muted uppercase mb-1.5 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-enterprise-muted uppercase mb-1.5 ml-1">
                  Select Role (Testing)
                </label>
                <select 
                  className="input-field cursor-pointer"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="Employee">Employee</option>
                  <option value="HOD">HOD</option>
                  <option value="Competent Authority">Competent Authority</option>
                  <option value="Network Admin">Network Admin</option>
                  <option value="IT Admin">IT Admin</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 flex items-center justify-center space-x-2 relative overflow-hidden group"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <span>Login to Dashboard</span>
                  <motion.span 
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="bg-enterprise-soft p-4 text-center border-t border-enterprise-line">
            <p className="text-xs text-enterprise-muted">
              Secure Enterprise Access &copy; {new Date().getFullYear()} NALCO ESMA
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
