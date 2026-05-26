import { memo } from 'react';

const STATUS_CONFIG = {
  draft: { label: 'Draft', colors: 'bg-gray-100 text-gray-700 border-gray-200' },
  submitted: { label: 'Submitted', colors: 'bg-blue-50 text-blue-700 border-blue-200' },
  recommended: { label: 'Recommended', colors: 'bg-purple-50 text-purple-700 border-purple-200' },
  approved: { label: 'Approved', colors: 'bg-green-50 text-green-700 border-green-200' },
  rejected: { label: 'Rejected', colors: 'bg-red-50 text-red-700 border-red-200' },
  implemented: { label: 'Implemented', colors: 'bg-teal-50 text-teal-700 border-teal-200' },
};

const StatusBadge = memo(({ status }) => {
  const config = STATUS_CONFIG[status.toLowerCase()] || { label: status, colors: 'bg-gray-50 text-gray-600 border-gray-100' };
  
  return (
    <span className={`
      inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
      ${config.colors}
    `}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-60" />
      {config.label}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

export default StatusBadge;
