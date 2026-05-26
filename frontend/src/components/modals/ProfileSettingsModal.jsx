import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

export default function ProfileSettingsModal() {
  const { isOpen } = useAppStore(state => state.profileSettings);
  const closeProfileSettings = useAppStore(state => state.closeProfileSettings);
  const user = useAppStore(state => state.user);
  const showToast = useAppStore(state => state.showToast);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Profile settings saved successfully.');
    closeProfileSettings();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={closeProfileSettings}
      />
      
      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border-t-8 border-nalco-red"
      >
        <div className="p-6 border-b border-enterprise-line flex items-center justify-between bg-enterprise-soft/30">
          <div>
            <h3 className="text-xl font-black text-enterprise-ink tracking-tight">Profile Settings</h3>
            <p className="text-xs font-bold text-enterprise-muted mt-1 uppercase tracking-wider">Manage your account details</p>
          </div>
          <button 
            className="w-8 h-8 flex items-center justify-center bg-white border border-enterprise-line rounded-lg text-enterprise-ink hover:bg-enterprise-soft transition-colors" 
            type="button" 
            onClick={closeProfileSettings} 
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-nalco-blue flex items-center justify-center text-white font-black text-2xl shadow-md border-4 border-white ring-2 ring-enterprise-line">
              {user?.name?.charAt(0) || 'E'}
            </div>
            <div>
              <p className="text-sm font-black text-enterprise-ink">{user?.name}</p>
              <p className="text-xs font-bold text-nalco-red uppercase tracking-wider">{user?.title}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-enterprise-muted uppercase mb-1.5 ml-1">Full Name</label>
              <input type="text" className="input-field bg-enterprise-soft/50" defaultValue={user?.name} readOnly />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-enterprise-muted uppercase mb-1.5 ml-1">Official Email / ID</label>
              <input type="text" className="input-field bg-enterprise-soft/50" defaultValue={`${user?.name?.toLowerCase().replace(/\s+/g, '.')}@nalcoindia.co.in`} readOnly />
            </div>

            <div>
              <label className="block text-xs font-bold text-enterprise-muted uppercase mb-1.5 ml-1">Department / Designation</label>
              <input type="text" className="input-field bg-enterprise-soft/50" defaultValue={user?.title} readOnly />
            </div>

            <div className="pt-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-nalco-red rounded border-enterprise-line focus:ring-nalco-red" defaultChecked />
                <span className="text-sm font-semibold text-enterprise-ink">Receive Email Notifications</span>
              </label>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-enterprise-line flex justify-end space-x-3">
            <button type="button" className="btn-secondary bg-white text-enterprise-ink border border-enterprise-line hover:bg-enterprise-soft" onClick={closeProfileSettings}>
              Cancel
            </button>
            <button type="submit" className="btn-primary bg-nalco-red">
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
