import { useAppStore } from '../store/useAppStore.js';
import { motion } from 'framer-motion';

export default function SummaryCards() {
  const requests = useAppStore(state => state.requests);

  const countByStatus = (status) => {
    if (status === 'pending') {
      return requests.filter((r) => ['SUBMITTED', 'RECOMMENDED'].includes(r.status)).length;
    }
    if (status === 'rejected') {
      return requests.filter(r => r.status === 'REJECTED_L1' || r.status === 'REJECTED_FINAL').length;
    }
    return requests.filter((r) => r.status === status).length;
  };

  const summary = [
    { label: 'Total Requests', value: requests.length, color: 'border-nalco-blue', bg: 'bg-blue-50', text: 'text-nalco-blue' },
    { label: 'Pending Action', value: countByStatus('pending'), color: 'border-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-700' },
    { label: 'Approved', value: countByStatus('APPROVED'), color: 'border-green-500', bg: 'bg-green-50', text: 'text-green-700' },
    { label: 'Rejected', value: countByStatus('rejected'), color: 'border-red-500', bg: 'bg-red-50', text: 'text-red-700' },
    { label: 'Implemented', value: countByStatus('IMPLEMENTED'), color: 'border-teal-500', bg: 'bg-teal-50', text: 'text-teal-700' }
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4" aria-label="Request summary">
      {summary.map((item, index) => (
        <motion.article 
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`enterprise-card p-5 border-l-4 ${item.color} flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-enterprise-muted">
              {item.label}
            </span>
            <div className={`p-1.5 rounded-lg ${item.bg} ${item.text}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <strong className="text-3xl font-black text-enterprise-ink">{item.value}</strong>
        </motion.article>
      ))}
    </section>
  );
}
