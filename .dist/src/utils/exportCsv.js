export function exportCsv(rows, filename = 'nalco-esma-requests.csv') {
  const { statusLabel, approvalStage } = require('./statusHelpers.js');

  const header = [
    'Request ID', 'Employee Name', 'Department', 'Unit', 'Media',
    'From Date', 'To Date', 'Status', 'Assigned To',
    'Approval Stage', 'Last Updated', 'Rejection Reason',
  ];

  const csvValue = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;

  const csv = [
    header,
    ...rows.map((r) => [
      r.id, r.employee.name, r.department, r.unit, r.media,
      r.fromDate, r.toDate, statusLabel(r.status), r.assignedTo,
      approvalStage(r), r.timestamps.lastUpdated, r.rejectionReason,
    ].map(csvValue)),
  ].map((row) => row.join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
