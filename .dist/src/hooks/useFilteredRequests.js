import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore.js';
import { isRejected } from '../utils/statusHelpers.js';

export function useFilteredRequests() {
  const requests = useAppStore((state) => state.requests);
  const filters = useAppStore((state) => state.filters);

  return useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    
    let effectiveStatus = filters.status;
    if (filters.status === 'all' && filters.activeTab !== 'all') {
      effectiveStatus = filters.activeTab;
    }

    const filtered = requests
      .filter((request) => {
        if (!query) return true;
        const searchable = [
          request.employee?.name || (typeof request.employee === 'string' ? request.employee : ''),
          request.id || '',
          request.department || '',
          request.unit || '',
          request.media || ''
        ].join(' ').toLowerCase();
        return searchable.includes(query);
      })
      .filter((request) => {
        if (effectiveStatus === 'all') return true;
        if (effectiveStatus === 'rejected') return isRejected(request);
        return request.status === effectiveStatus;
      })
      .sort((a, b) => {
        if (filters.sort === 'statusAsc') {
          return a.status.localeCompare(b.status) || 
                 b.timestamps.lastUpdated.localeCompare(a.timestamps.lastUpdated);
        }
        return b.timestamps.lastUpdated.localeCompare(a.timestamps.lastUpdated);
      });

    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / filters.pageSize));
    const page = Math.min(filters.page, totalPages);
    const start = (page - 1) * filters.pageSize;
    const rows = filtered.slice(start, start + filters.pageSize);

    return { rows, totalPages, totalCount, filtered }; // filtered returned for Kanban
  }, [requests, filters]);
}
