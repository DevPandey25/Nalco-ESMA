import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflowActions } from '../hooks/useWorkflowActions';
import { useAppStore } from '../store/useAppStore';
import { isRejected } from '../utils/statusHelpers';

const ActionButtons = memo(({ request }) => {
  const { canRun, dispatchAction } = useWorkflowActions();
  const openDetail = useAppStore(state => state.openDetail);
  const openEmailPreview = useAppStore(state => state.openEmailPreview);
  const navigate = useNavigate();
  const role = useAppStore(state => state.role);

  const btnBase = "px-4 py-2 text-xs font-bold uppercase tracking-tight rounded-md transition-all duration-200 active:scale-95";

  const handleViewReceipt = () => {
    if (role === 'IT Admin') {
      navigate(`/admin/receipt/${request.id}`);
    } else {
      navigate(`/receipt/${request.id}`);
    }
  };

  return (
    <div className="flex items-center space-x-1.5">
      <button 
        className={`${btnBase} bg-enterprise-soft text-enterprise-ink hover:bg-enterprise-line border border-enterprise-line`} 
        type="button" 
        onClick={() => openDetail(request.id)}
      >
        View
      </button>

      <button 
        className={`${btnBase} bg-slate-800 text-white hover:bg-black border border-slate-700 shadow-sm`} 
        type="button" 
        onClick={handleViewReceipt}
      >
        Receipt
      </button>

      {canRun('submit', request) && (
        <button className={`${btnBase} bg-nalco-red text-white hover:bg-red-700`} type="button" onClick={() => dispatchAction('submit', request.id)}>
          Submit
        </button>
      )}
      {canRun('recommend', request) && (
        <button className={`${btnBase} bg-nalco-blue text-white hover:bg-nalco-blue-dark`} type="button" onClick={() => dispatchAction('recommend', request.id)}>
          Recommend
        </button>
      )}
      {canRun('return', request) && (
        <button className={`${btnBase} bg-enterprise-soft text-enterprise-ink hover:bg-enterprise-line border border-enterprise-line`} type="button" onClick={() => dispatchAction('return', request.id)}>
          Return
        </button>
      )}
      {canRun('approve', request) && (
        <button className={`${btnBase} bg-green-600 text-white hover:bg-green-700`} type="button" onClick={() => dispatchAction('approve', request.id)}>
          Approve
        </button>
      )}
      {canRun('reject', request) && (
        <button className={`${btnBase} bg-red-600 text-white hover:bg-red-700`} type="button" onClick={() => dispatchAction('reject', request.id)}>
          Reject
        </button>
      )}
      {canRun('implement', request) && (
        <button className={`${btnBase} bg-teal-600 text-white hover:bg-teal-700`} type="button" onClick={() => dispatchAction('implement', request.id)}>
          Implement
        </button>
      )}
      {isRejected(request) && (
        <button className={`${btnBase} bg-[#1a1a1a] text-white hover:bg-black`} type="button" onClick={() => openEmailPreview(request.id)}>
          Email Requester
        </button>
      )}
    </div>
  );
});

ActionButtons.displayName = 'ActionButtons';

export default ActionButtons;
