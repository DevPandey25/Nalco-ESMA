import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore.js';

export function useApprovalQueue() {
  const requests = useAppStore((state) => state.requests);
  const role = useAppStore((state) => state.role);

  return useMemo(() => {
    if (role === 'HOD') return requests.filter(r => r.status === 'SUBMITTED');
    if (role === 'Competent Authority') return requests.filter(r => r.status === 'RECOMMENDED');
    if (role === 'Network Admin') return requests.filter(r => r.status === 'APPROVED');
    if (role === 'IT Admin') return requests.filter(r => ['SUBMITTED', 'RECOMMENDED', 'APPROVED'].includes(r.status));
    return []; // Employee has no approval queue
  }, [requests, role]);
}
