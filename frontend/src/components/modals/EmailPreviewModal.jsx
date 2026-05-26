import { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getDirectEditLink } from '../../utils/statusHelpers';
import '../../styles/modal.css';

export default function EmailPreviewModal() {
  const { isOpen, requestId } = useAppStore(state => state.emailPreview);
  const closeEmailPreview = useAppStore(state => state.closeEmailPreview);
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

  const subject = "Request Rejected - Action Required";
  const body = `Employee Name: ${request.employee.name}\nRequest ID: ${request.id}\nReason: ${request.rejectionReason || "Not specified"}\nDirect edit link: ${getDirectEditLink(request.id)}`;

  return (
    <dialog className="modal" ref={dialogRef} onClose={closeEmailPreview}>
      <div className="modal-card email-preview">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Email Preview</p>
            <h3>Request Rejected</h3>
          </div>
          <button className="icon-btn" type="button" onClick={closeEmailPreview} aria-label="Close">x</button>
        </div>
        
        <div>
          <p><strong>Subject:</strong> {subject}</p>
          <div className="email-box">{body}</div>
        </div>
        
        <div className="modal-actions">
          <button className="btn ghost" type="button" onClick={closeEmailPreview}>Close</button>
          <a 
            className="btn primary" 
            href={`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
          >
            Open Mail
          </a>
        </div>
      </div>
    </dialog>
  );
}
