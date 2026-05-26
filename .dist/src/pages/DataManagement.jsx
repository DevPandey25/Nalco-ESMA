import { useAppStore } from '../store/useAppStore';
import { useFilteredRequests } from '../hooks/useFilteredRequests';
import { WORKFLOW_TABS } from '../constants/workflow';
import RequestTable from '../components/RequestTable';
import KanbanBoard from '../components/KanbanBoard';
import '../styles/kanban.css';

export default function DataManagement() {
  const filters = useAppStore(state => state.filters);
  const setFilters = useAppStore(state => state.setFilters);
  const requests = useAppStore(state => state.requests);
  const { rows, totalPages, totalCount, filtered } = useFilteredRequests();

  const handleSearch = (e) => setFilters({ search: e.target.value, page: 1 });
  const handleStatusFilter = (e) => setFilters({ status: e.target.value, activeTab: 'all', page: 1 });
  const handleSort = (e) => setFilters({ sort: e.target.value, page: 1 });
  const handleTabClick = (tabValue) => setFilters({ activeTab: tabValue, status: 'all', page: 1 });

  return (
    <section className="page-section active" data-page="data">
      <section className="data-management-section">
        <div className="section-toolbar">
          <div>
            <h3>All Requests</h3>
            <p>{totalCount} records</p>
          </div>
          <div className="toolbar-controls">
            <label className="search-box">
              <span>Search</span>
              <input type="search" placeholder="Name, ID, department" value={filters.search} onChange={handleSearch} />
            </label>
            <label>
              <span>Status</span>
              <select value={filters.status} onChange={handleStatusFilter}>
                <option value="all">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="RECOMMENDED">Recommended</option>
                <option value="APPROVED">Approved</option>
                <option value="IMPLEMENTED">Implemented</option>
                <option value="REJECTED_L1">Rejected L1</option>
                <option value="REJECTED_FINAL">Rejected Final</option>
              </select>
            </label>
            <label>
              <span>Sort</span>
              <select value={filters.sort} onChange={handleSort}>
                <option value="dateDesc">Date</option>
                <option value="statusAsc">Status</option>
              </select>
            </label>
            <div className="view-toggle" role="group">
              <button 
                className={`toggle-btn ${filters.view === 'table' ? 'active' : ''}`} 
                onClick={() => setFilters({ view: 'table' })}
              >
                Table
              </button>
              <button 
                className={`toggle-btn ${filters.view === 'board' ? 'active' : ''}`} 
                onClick={() => setFilters({ view: 'board' })}
              >
                Board
              </button>
            </div>
          </div>
        </div>

        <div className="workflow-tabs">
          {WORKFLOW_TABS.map(tab => {
            const count = tab.value === 'all' 
              ? requests.length 
              : tab.value === 'rejected'
                ? requests.filter(r => r.status.startsWith('REJECTED')).length
                : requests.filter(r => r.status === tab.value).length;
            
            return (
              <button 
                key={tab.value}
                className={`tab-btn ${filters.activeTab === tab.value ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.value)}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        <div className={`advanced-table view-panel ${filters.view === 'table' ? 'active' : ''}`}>
          <RequestTable rows={rows} />
          
          <div className="pagination-bar">
            <span>Page {filters.page} of {totalPages}</span>
            <div>
              <button 
                className="btn ghost" 
                disabled={filters.page === 1}
                onClick={() => setFilters({ page: filters.page - 1 })}
              >
                Previous
              </button>
              <button 
                className="btn ghost" 
                disabled={filters.page === totalPages || totalPages === 0}
                onClick={() => setFilters({ page: filters.page + 1 })}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {filters.view === 'board' && (
          <KanbanBoard filteredRequests={filtered} />
        )}
      </section>
    </section>
  );
}
