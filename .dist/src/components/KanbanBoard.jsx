import { memo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { BOARD_COLUMNS } from '../constants/workflow';
import { statusLabel, isRejected } from '../utils/statusHelpers';
import KanbanCard from './KanbanCard';
import { STATUS_TO_ASSIGNEE } from '../constants/workflow';

const KanbanBoard = memo(({ filteredRequests }) => {
  const role = useAppStore(state => state.role);
  const updateRequest = useAppStore(state => state.updateRequest);
  const showToast = useAppStore(state => state.showToast);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, column) => {
    e.preventDefault();
    if (role !== 'IT Admin') {
      showToast('Only IT Admin can manage workflow status by board drag.');
      return;
    }

    const id = e.dataTransfer.getData('text/plain');
    const status = column === 'REJECTED' ? 'REJECTED_FINAL' : column;
    updateRequest(id, { status, assignedTo: STATUS_TO_ASSIGNEE[status] || 'IT Admin' });
    showToast(`${id} moved to ${statusLabel(status)}.`);
  };

  return (
    <div className="kanban-board active">
      {BOARD_COLUMNS.map(column => {
        const cards = filteredRequests.filter(r => {
          if (column === 'REJECTED') return isRejected(r);
          return r.status === column;
        });

        return (
          <section 
            key={column} 
            className="kanban-column" 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column)}
          >
            <header>
              <span>{statusLabel(column)}</span>
              <span>{cards.length}</span>
            </header>
            <div className="kanban-list">
              {cards.length > 0 ? (
                cards.map(request => <KanbanCard key={request.id} request={request} />)
              ) : (
                <span>No requests</span>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
});

KanbanBoard.displayName = 'KanbanBoard';

export default KanbanBoard;
