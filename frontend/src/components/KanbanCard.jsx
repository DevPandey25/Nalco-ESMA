import { memo } from 'react';
import { formatDate, approvalStage } from '../utils/statusHelpers';
import StatusBadge from './StatusBadge';

const KanbanCard = memo(({ request }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', request.id);
  };

  return (
    <article 
      className="kanban-card" 
      draggable="true" 
      onDragStart={handleDragStart}
    >
      <strong>{request.id}</strong>
      <span>{request.employee.name}</span>
      <span>{request.media} | {formatDate(request.fromDate)} - {formatDate(request.toDate)}</span>
      <StatusBadge status={request.status} />
      <span>{approvalStage(request)}</span>
    </article>
  );
});

KanbanCard.displayName = 'KanbanCard';

export default KanbanCard;
