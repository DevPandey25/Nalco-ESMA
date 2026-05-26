import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import StatusBadge from './StatusBadge';

const MiniRequestTable = memo(({ rows }) => {
  const navigate = useNavigate();
  const role = useAppStore(state => state.role);

  if (!rows || rows.length === 0) {
    return (
      <div className="py-12 text-center text-enterprise-muted font-medium italic text-sm">
        No records found in this queue.
      </div>
    );
  }

  const handleViewReceipt = (requestId) => {
    if (role === 'IT Admin') {
      navigate(`/admin/receipt/${requestId}`);
    } else {
      navigate(`/receipt/${requestId}`);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-enterprise-soft/30 border-b border-enterprise-line">
            <th className="px-6 py-3 text-[10px] font-black text-nalco-blue uppercase tracking-widest">Request</th>
            <th className="px-6 py-3 text-[10px] font-black text-nalco-blue uppercase tracking-widest">Employee</th>
            <th className="px-6 py-3 text-[10px] font-black text-nalco-blue uppercase tracking-widest">Status</th>
            <th className="px-6 py-3 text-[10px] font-black text-nalco-blue uppercase tracking-widest">Assigned</th>
            <th className="px-6 py-3 text-[10px] font-black text-nalco-blue uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-enterprise-line">
          {rows.map((request, idx) => (
            <tr 
              key={request.id}
              className={`hover:bg-nalco-blue/[0.01] transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-enterprise-soft/10'}`}
            >
              <td className="px-6 py-3 text-xs font-bold text-nalco-blue">{request.id}</td>
              <td className="px-6 py-3 text-xs font-medium text-enterprise-ink">{request.employee?.name || request.employee}</td>
              <td className="px-6 py-3"><StatusBadge status={request.status} /></td>
              <td className="px-6 py-3 text-xs font-semibold text-enterprise-muted">{request.assignedTo}</td>
              <td className="px-6 py-3 text-right">
                <button
                  onClick={() => handleViewReceipt(request.id)}
                  className="px-3 py-1 bg-slate-800 hover:bg-black text-[10px] font-extrabold uppercase tracking-wider text-white rounded transition-all duration-200 active:scale-95 shadow-sm border border-slate-700"
                  type="button"
                >
                  Receipt
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

MiniRequestTable.displayName = 'MiniRequestTable';

export default MiniRequestTable;
