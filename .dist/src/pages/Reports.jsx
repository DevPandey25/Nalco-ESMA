import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { exportCsv } from '../utils/exportCsv';
import BarChart from '../components/BarChart';
import RateCards from '../components/RateCards';
import MiniRequestTable from '../components/MiniRequestTable';
import '../styles/reports.css';

export default function Reports() {
  const requests = useAppStore(state => state.requests);

  const { monthCounts, approvalRate, rejectionRate } = useMemo(() => {
    const counts = requests.reduce((acc, request) => {
      const key = request.fromDate.slice(0, 7);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const completed = requests.filter(r => ['APPROVED', 'IMPLEMENTED'].includes(r.status)).length;
    const rejected = requests.filter(r => r.status.startsWith('REJECTED')).length;
    
    const aRate = Math.round((completed / Math.max(1, requests.length)) * 100);
    const rRate = Math.round((rejected / Math.max(1, requests.length)) * 100);

    return { monthCounts: counts, approvalRate: aRate, rejectionRate: rRate };
  }, [requests]);

  return (
    <section className="page-section active" data-page="reports">
      <div className="reports-grid">
        <section className="panel">
          <div className="section-toolbar compact">
            <div>
              <h3>Requests Per Month</h3>
              <p>Volume trend</p>
            </div>
          </div>
          <BarChart monthCounts={monthCounts} />
        </section>
        <section className="panel">
          <div className="section-toolbar compact">
            <div>
              <h3>Approval Quality</h3>
              <p>Approval and rejection rate</p>
            </div>
          </div>
          <RateCards approvalRate={approvalRate} rejectionRate={rejectionRate} />
        </section>
      </div>
      <section className="panel">
        <div className="section-toolbar">
          <div>
            <h3>Exportable Report</h3>
            <p>Operational workflow snapshot</p>
          </div>
          <button 
            className="btn secondary" 
            type="button" 
            onClick={() => exportCsv(requests, 'nalco-esma-workflow-report.csv')}
          >
            Export Report
          </button>
        </div>
        <div className="mini-table">
          <MiniRequestTable rows={requests} />
        </div>
      </section>
    </section>
  );
}
