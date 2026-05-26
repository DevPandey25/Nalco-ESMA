import React, { useEffect } from 'react';
import ActivityFeed from '../components/ActivityFeed';
import MiniRequestTable from '../components/MiniRequestTable';
import { useAppStore } from '../store/useAppStore';
import { useApprovalQueue } from '../hooks/useApprovalQueue';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const role = useAppStore(state => state.role);
  const user = useAppStore(state => state.user);
  const requests = useAppStore(state => state.requests);
  const fetchRequests = useAppStore(state => state.fetchRequests);
  const approvalQueue = useApprovalQueue();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const scopedRequests = role === 'Employee'
    ? requests.filter((r) => (r.employee?.name || r.employee) === user.name)
    : approvalQueue.slice(0, 5);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-nalco-blue">ESMA Command Center</h2>
          <p className="text-sm text-enterprise-muted">Welcome back, <span className="font-bold text-nalco-red">{user.name}</span>. Monitor your enterprise workflow in real-time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Activity Feed */}
        <section className="lg:col-span-1 bg-white border border-enterprise-line rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-enterprise-line bg-enterprise-soft/50">
            <h3 className="text-sm font-black text-nalco-blue uppercase tracking-widest">Recent Activity</h3>
            <p className="text-[10px] font-bold text-enterprise-muted uppercase mt-0.5">Workflow movement</p>
          </div>
          <div className="p-2">
            <ActivityFeed />
          </div>
        </section>
        
        {/* Right Column: Request Queue */}
        <section className="lg:col-span-2 bg-white border border-enterprise-line rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-enterprise-line bg-enterprise-soft/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-nalco-blue uppercase tracking-widest">
                {role === 'Employee' ? 'My Request Status' : 'Approval Queue'}
              </h3>
              <p className="text-[10px] font-bold text-enterprise-muted uppercase mt-0.5">
                Current priority items
              </p>
            </div>
            <span className="px-2 py-1 bg-nalco-blue text-white rounded text-[10px] font-bold">
              {scopedRequests.length} Active
            </span>
          </div>
          <div className="p-0">
            <MiniRequestTable rows={scopedRequests} />
          </div>
        </section>
      </div>
    </motion.div>
  );
}
