import { memo } from 'react';
import { formatDate } from '../utils/statusHelpers';
import StatusBadge from './StatusBadge';
import SignatureTrail from './SignatureTrail';
import ActionButtons from './ActionButtons';

const ApprovalTable = memo(({ rows }) => {
  if (!rows || rows.length === 0) {
    return (
      <div className="table-wrap">
        <table className="approval-table">
          <thead>
            <tr>
              <th>Request</th>
              <th>Employee</th>
              <th>Department</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Signature Trail</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan="7">No approval items for this role.</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="approval-table">
        <thead>
          <tr>
            <th>Request</th>
            <th>Employee</th>
            <th>Department</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Signature Trail</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((request) => (
            <tr key={request.id}>
              <td>
                <strong>{request.id}</strong>
                <div className="mini-meta">{formatDate(request.fromDate)} - {formatDate(request.toDate)}</div>
              </td>
              <td>{request.employee.name}</td>
              <td>{request.department}</td>
              <td><StatusBadge status={request.status} /></td>
              <td>{request.assignedTo}</td>
              <td><SignatureTrail signatures={request.signatures} /></td>
              <td><ActionButtons request={request} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

ApprovalTable.displayName = 'ApprovalTable';

export default ApprovalTable;
