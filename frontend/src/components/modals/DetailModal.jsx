import { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { formatDate, approvalStage, getDirectEditLink } from '../../utils/statusHelpers';
import SignatureMatrix from '../SignatureMatrix';
import '../../styles/modal.css';

export default function DetailModal() {
  const { isOpen, requestId } = useAppStore(state => state.detail);
  const closeDetail = useAppStore(state => state.closeDetail);
  const request = useAppStore(state => state.requests.find(r => r.id === requestId));
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (dialogRef.current) {
      dialogRef.current.close();
    }
  }, [isOpen]);

  if (!request) return null;

  const detailItems = [
    ['Employee Name', request.employee.name],
    ['Personal No', request.employee.personalNo],
    ['Designation', request.employee.designation],
    ['Department', request.department],
    ['Unit', request.unit],
    ['Media Type', request.media],
    ['From Date', formatDate(request.fromDate)],
    ['To Date', formatDate(request.toDate)],
    ['Status', request.status], // Or statusLabel
    ['Assigned To', request.assignedTo],
    ['Approval Stage', approvalStage(request)],
    ['Last Updated', request.timestamps.lastUpdated],
    ['Justification', request.justification],
    ['Rejection Reason', request.rejectionReason || '-'],
    ['Direct Edit Link', getDirectEditLink(request.id)]
  ];

  return (
    <dialog className="modal" ref={dialogRef} onClose={closeDetail}>
      <div className="modal-card">
        <div className="flex items-start justify-between border-b border-enterprise-line pb-4 mb-4">
          <div>
            <p className="text-xs font-bold text-enterprise-muted uppercase tracking-wider mb-1">Request Detail</p>
            <h3 className="text-xl font-bold text-nalco-blue">{request.id}</h3>
          </div>
          <button 
            className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 hover:bg-red-500 text-red-600 hover:text-white transition-colors absolute top-4 right-4" 
            type="button" 
            onClick={closeDetail} 
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="detail-grid">
          {detailItems.map(([label, value]) => (
            <div key={label} className="detail-item">
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        
        <SignatureMatrix signatures={request.signatures} />
      </div>
    </dialog>
  );
}
