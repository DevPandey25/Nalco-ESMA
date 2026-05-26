import { useAppStore } from '../store/useAppStore';
import { useApprovalQueue } from '../hooks/useApprovalQueue';
import ApprovalTable from '../components/ApprovalTable';

export default function Approvals() {
  const role = useAppStore(state => state.role);
  const queue = useApprovalQueue();

  return (
    <section className="page-section active" data-page="approvals">
      <section className="panel">
        <div className="section-toolbar">
          <div>
            <h3>Role-Based Approval Queue</h3>
            <p>{queue.length} requests requiring action for {role}</p>
          </div>
          <span className="status-badge status-APPROVED">{role}</span>
        </div>
        <ApprovalTable rows={queue} />
      </section>
    </section>
  );
}
