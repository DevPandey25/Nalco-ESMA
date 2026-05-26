import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore.js';
import { buildSignature } from '../utils/requestFactory.js';
import { nowStamp, workflowToastVerb } from '../utils/statusHelpers.js';
import { apiClient } from '../api/client.js';

export function useWorkflowActions() {
  const role = useAppStore(state => state.role);
  const user = useAppStore(state => state.user);
  const requests = useAppStore(state => state.requests);
  const updateRequest = useAppStore(state => state.updateRequest);
  const addRequest = useAppStore(state => state.addRequest);
  const openWorkflow = useAppStore(state => state.openWorkflow);
  const closeWorkflow = useAppStore(state => state.closeWorkflow);
  const showToast = useAppStore(state => state.showToast);
  const navigate = useNavigate();

  const canRun = useCallback((action, request) => {
    if (role === 'IT Admin') {
      if (action === 'submit') return request.status === 'DRAFT';
      if (action === 'recommend' || action === 'return') return request.status === 'SUBMITTED';
      if (action === 'approve') return request.status === 'RECOMMENDED';
      if (action === 'reject') return ['SUBMITTED', 'RECOMMENDED'].includes(request.status);
      if (action === 'implement') return request.status === 'APPROVED';
      return false;
    }
    if (role === 'Employee') return action === 'submit' && request.status === 'DRAFT';
    if (role === 'HOD') return ['recommend', 'return', 'reject'].includes(action) && request.status === 'SUBMITTED';
    if (role === 'Competent Authority') return ['approve', 'reject'].includes(action) && request.status === 'RECOMMENDED';
    if (role === 'Network Admin') return action === 'implement' && request.status === 'APPROVED';
    return false;
  }, [role]);

  const dispatchAction = useCallback((action, requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (!request || !canRun(action, request)) {
      showToast(`${role} cannot perform this action at the current stage.`);
      return;
    }
    openWorkflow(action, requestId);
  }, [requests, canRun, role, showToast, openWorkflow]);

  const applyWorkflow = useCallback((action, requestId, draft, comment, signatureMode, canvasDataUrl) => {
    const signature = buildSignature(user, signatureMode, canvasDataUrl);
    signature.comment = comment; // Attach comment to signature object if needed

    if (action === 'submit' && draft) {
       const payload = {
          employee: draft.employeeName,
          email: draft.email,
          employeeId: draft.personalNo,
          designation: draft.designation,
          department: draft.department,
          unit: draft.unit,
          mediaType: draft.media,
          fromDate: draft.fromDate,
          toDate: draft.toDate,
          justification: draft.justification,
          comment: comment,
          signatureData: {
            name: draft.employeeName || signature.name,
            timestamp: signature.timestamp,
            mode: signatureMode,
            hash: signature.hash
          }
       };

       apiClient.post('/requests', payload).then(response => {
           useAppStore.getState().fetchRequests();
           showToast(`Request submitted successfully!`);
           navigate('/data');
       }).catch(err => {
           console.error('API Submit Error:', err);
           showToast(`Failed to submit request: ${err.message}`);
       });
    } else {
      const request = requests.find(r => r.id === requestId || r._id === requestId || r.requestId === requestId);
      if (!request) return;

      // Ensure we hit the correct backend endpoint string format
      let endpoint = action;
      if (action === 'submit') {
          // Submitting an already saved draft (if applicable in future)
          endpoint = 'submit'; 
          // Note: Backend might not have /approvals/submit, you might need a PUT /requests/:id instead.
          // Since the UI only supports creating new drafts via RequestForm right now, we can leave this.
      }

      const payload = {
        requestId: request.requestId || request._id || request.id,
        comment: comment,
        signatureData: {
          name: signature.name,
          title: signature.title,
          timestamp: signature.timestamp,
          mode: signatureMode,
          hash: signature.hash
        }
      };

      apiClient.post(`/approvals/${endpoint}`, payload).then(response => {
         useAppStore.getState().fetchRequests();
         showToast(`${payload.requestId} ${workflowToastVerb(action)} by ${signature.name}.`);
         
         // Automated Rejection Email Trigger visual feedback
         if (action === 'reject') {
            const targetEmail = request.employee?.email || `${(request.employee?.name || request.employee || 'employee').toLowerCase().replace(/\s+/g, '.')}@nalcoindia.co.in`;
            setTimeout(() => {
              showToast(`Automated rejection email sent to ${targetEmail}`);
            }, 800);
         }
      }).catch(err => {
         console.error('API Workflow Error:', err);
         showToast(`Failed to process ${action}: ${err.message}`);
      });
    }
    closeWorkflow();
  }, [user, addRequest, updateRequest, showToast, closeWorkflow, requests, role, navigate]);

  return { canRun, dispatchAction, applyWorkflow };
}
