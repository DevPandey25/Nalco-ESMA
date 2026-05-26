import { create } from 'zustand';
import { initialRequests } from '../constants/mockData.js';
import { ROLES } from '../constants/roles.js';

import { apiClient } from '../api/client.js';

export const useAppStore = create((set, get) => ({
  // User & Auth
  isAuthenticated: !!localStorage.getItem('esma_token'),
  role: localStorage.getItem('esma_active_role') || 'Employee',
  user: ROLES[localStorage.getItem('esma_active_role') || 'Employee'] || ROLES['Employee'],
  setRole: (role) => {
    localStorage.setItem('esma_active_role', role);
    set({ role, user: ROLES[role] });
  },
  
  login: async (employeeId, password, role) => {
    try {
      const response = await apiClient.post('/auth/login', {
        personalNo: employeeId,
        password: password,
        role: role // Backend currently accepts this as mock override or it maps internally
      });

      // Save token & active role
      localStorage.setItem('esma_token', response.token);
      localStorage.setItem('esma_active_role', response.role || role);

      set({ 
        isAuthenticated: true,
        user: { ...ROLES[response.role || role], name: response.name, personalNo: response.personalNo },
        role: response.role || role
      });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  },
  
  logout: () => {
    localStorage.removeItem('esma_token');
    localStorage.removeItem('esma_active_role');
    set({ isAuthenticated: false, role: 'Employee', user: ROLES['Employee'] });
  },

  // Requests Data
  requests: [],
  isLoadingRequests: false,
  fetchRequests: async () => {
    set({ isLoadingRequests: true });
    try {
      // Fetch from real backend
      const response = await apiClient.get(`/requests?limit=100&_t=${Date.now()}`);
      const fetched = Array.isArray(response) ? response : (response.data || []);
      const mapped = fetched.map(r => ({
          ...r,
          id: r.requestId || r.id || r._id,
          media: r.mediaType || r.media,
          employee: typeof r.employee === 'string' 
            ? { name: r.employee, title: r.designation || 'Staff' } 
            : r.employee,
          timestamps: r.timestamps || {
            submitted: r.createdAt || new Date().toISOString(),
            lastUpdated: r.updatedAt || new Date().toISOString()
          }
      }));
      set({ requests: mapped, isLoadingRequests: false });
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      set({ requests: [], isLoadingRequests: false });
    }
  },
  addRequest: (request) => set((state) => ({ requests: [request, ...state.requests] })),
  updateRequest: (id, patch) => set((state) => ({
    requests: state.requests.map((r) => r.id === id ? { ...r, ...patch } : r)
  })),

  // Data Management Filters
  filters: {
    search: '',
    status: 'all',
    activeTab: 'all',
    sort: 'dateDesc',
    page: 1,
    pageSize: 5,
    view: 'table',
  },
  setFilters: (patch) => set((state) => ({ filters: { ...state.filters, ...patch } })),

  // Detail Modal State
  detail: { isOpen: false, requestId: null },
  openDetail: (requestId) => set({ detail: { isOpen: true, requestId } }),
  closeDetail: () => set({ detail: { isOpen: false, requestId: null } }),

  // Workflow Modal State
  workflow: { isOpen: false, action: null, requestId: null, draft: null },
  openWorkflow: (action, requestId, draft = null) => set({
    workflow: { isOpen: true, action, requestId, draft }
  }),
  closeWorkflow: () => set({
    workflow: { isOpen: false, action: null, requestId: null, draft: null }
  }),

  // Email Preview Modal State
  emailPreview: { isOpen: false, requestId: null },
  openEmailPreview: (requestId) => set({ emailPreview: { isOpen: true, requestId } }),
  closeEmailPreview: () => set({ emailPreview: { isOpen: false, requestId: null } }),

  // Profile Settings Modal State
  profileSettings: { isOpen: false },
  openProfileSettings: () => set({ profileSettings: { isOpen: true } }),
  closeProfileSettings: () => set({ profileSettings: { isOpen: false } }),

  // Toasts
  toasts: [],
  showToast: (message) => {
    const id = Date.now();
    set((state) => ({ toasts: [...state.toasts, { id, message }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3600);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
