import { memo, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import StatusBadge from './StatusBadge';
import SignatureTrail from './SignatureTrail';
import AssignmentDropdown from './AssignmentDropdown';
import ActionButtons from './ActionButtons';
import DataTable from './DataTable';
import { formatDate, approvalStage } from '../utils/statusHelpers';

const RequestTable = memo(({ rows }) => {
  const filters = useAppStore(state => state.filters);
  const openDetail = useAppStore(state => state.openDetail);
  
  const start = (filters.page - 1) * filters.pageSize;

  const columns = useMemo(() => [
    { 
      header: '#', 
      width: '50px',
      render: (_, index) => <span className="text-enterprise-muted">{start + index + 1}</span> 
    },
    { 
      header: 'Request ID', 
      key: 'id',
      width: '120px',
      render: (row) => <span className="font-bold text-nalco-blue text-base">{row.id}</span>
    },
    { 
      header: 'Employee Details', 
      width: '200px',
      render: (row) => (
        <div>
          <p className="font-bold text-base">{row.employee.name}</p>
          <p className="text-xs text-enterprise-muted uppercase">{row.department} | {row.unit}</p>
        </div>
      )
    },
    { 
      header: 'Period', 
      width: '180px',
      render: (row) => (
        <div className="text-sm">
          <span className="font-semibold">{formatDate(row.fromDate)}</span>
          <span className="mx-1 text-enterprise-muted">to</span>
          <span className="font-semibold">{formatDate(row.toDate)}</span>
        </div>
      )
    },
    { 
      header: 'Media', 
      key: 'media',
      width: '100px'
    },
    { 
      header: 'Workflow Status', 
      width: '150px',
      render: (row) => <StatusBadge status={row.status} />
    },
    { 
      header: 'Signatures', 
      width: '150px',
      render: (row) => <SignatureTrail signatures={row.signatures} />
    },
    { 
      header: 'Assigned To', 
      width: '180px',
      render: (row) => <AssignmentDropdown request={row} />
    },
    { 
      header: 'Stage', 
      width: '120px',
      render: (row) => (
        <span className="px-2 py-1 bg-nalco-blue/5 text-nalco-blue rounded text-xs font-bold uppercase tracking-tight">
          {approvalStage(row)}
        </span>
      )
    }
  ], [start]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold text-enterprise-ink">All Workflow Requests</h3>
        <span className="text-xs font-bold text-enterprise-muted">Showing {rows.length} records</span>
      </div>
      
      <DataTable 
        columns={columns} 
        data={rows} 
        onRowClick={(row) => openDetail(row.id)}
        actions={(row) => <ActionButtons request={row} />}
      />
    </div>
  );
});

RequestTable.displayName = 'RequestTable';

export default RequestTable;
