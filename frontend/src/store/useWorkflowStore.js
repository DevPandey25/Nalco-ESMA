import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { workflowService } from '../services/workflowService';

export const useWorkflowStore = create(
  devtools(
    (set, get) => ({
      activeRequests: [],
      approvalQueue: [],
      isLoading: false,
      error: null,

      // Fetch active requests for the dashboard
      fetchActiveRequests: async () => {
        set({ isLoading: true, error: null });
        try {
          // Placeholder for real API call
          // const requests = await workflowService.getActiveRequests();
          const requests = []; 
          set({ activeRequests: requests, isLoading: false });
        } catch (err) {
          set({ error: err.message, isLoading: false });
        }
      },

      // Process an approval/rejection action
      processWorkflowAction: async (requestId, action, signatureData, comment) => {
        set({ isLoading: true });
        try {
          // Placeholder for backend transition logic
          // await workflowService.transitionState(requestId, action, signatureData, comment);
          
          // Re-fetch queues after successful action
          await get().fetchActiveRequests();
          set({ isLoading: false });
          return true;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          return false;
        }
      }
    }),
    { name: 'WorkflowStore' }
  )
);
