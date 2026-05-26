import { useAppStore } from '../store/useAppStore';
import StatusBadge from './StatusBadge';

export default function ActivityFeed() {
  const requests = useAppStore(state => state.requests);

  const recent = [...requests]
    .sort((a, b) => b.timestamps.lastUpdated.localeCompare(a.timestamps.lastUpdated))
    .slice(0, 6);

  return (
    <div className="activity-list">
      {recent.map(request => (
        <div key={request.id} className="activity-item">
          <time>{request.timestamps.lastUpdated}</time>
          <div>
            <strong>{request.id}</strong> moved to <StatusBadge status={request.status} />
            <div className="mini-meta">{request.employee.name} | {request.department}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
